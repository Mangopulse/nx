#!/bin/bash

# NewsletterX API E2E Test Runner with Demo Database
# This script runs comprehensive end-to-end tests for the NewsletterX API
# Supports both local development and CI/CD environments (GitHub Actions)

echo "🚀 Starting NewsletterX API E2E Tests with Demo Database..."
echo "==========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_DB_NAME="nx_test_db"
TEST_DB_USER="test_admin"
TEST_DB_PASSWORD="test_password"
TEST_DB_PORT="5433"
DEMO_DB_CONTAINER="nx-test-postgres"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running in CI environment
is_ci_environment() {
    [[ "${CI}" == "true" ]] || [[ "${GITHUB_ACTIONS}" == "true" ]]
}

# Function to setup demo database
setup_demo_database() {
    print_status "Setting up demo database for testing..."
    
    if is_ci_environment; then
        print_status "Running in CI environment - using service containers"
        # In GitHub Actions, we'll use service containers
        export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/${TEST_DB_NAME}"
        export SPRING_DATASOURCE_USERNAME="${TEST_DB_USER}"
        export SPRING_DATASOURCE_PASSWORD="${TEST_DB_PASSWORD}"
    else
        print_status "Running locally - setting up Docker container"
        
        # Check if Docker is available
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker to run tests with demo database."
            exit 1
        fi
        
        # Stop and remove existing test container if it exists
        if docker ps -a --format 'table {{.Names}}' | grep -q "^${DEMO_DB_CONTAINER}$"; then
            print_status "Stopping existing test database container..."
            docker stop ${DEMO_DB_CONTAINER} >/dev/null 2>&1
            docker rm ${DEMO_DB_CONTAINER} >/dev/null 2>&1
        fi
        
        # Start fresh PostgreSQL container for testing
        print_status "Starting PostgreSQL test container..."
        docker run -d \
            --name ${DEMO_DB_CONTAINER} \
            -e POSTGRES_DB=${TEST_DB_NAME} \
            -e POSTGRES_USER=${TEST_DB_USER} \
            -e POSTGRES_PASSWORD=${TEST_DB_PASSWORD} \
            -p ${TEST_DB_PORT}:5432 \
            postgres:15 >/dev/null 2>&1
        
        if [ $? -ne 0 ]; then
            print_error "Failed to start PostgreSQL test container"
            exit 1
        fi
        
        # Wait for PostgreSQL to be ready
        print_status "Waiting for PostgreSQL to be ready..."
        for i in {1..30}; do
            if docker exec ${DEMO_DB_CONTAINER} pg_isready -U ${TEST_DB_USER} -d ${TEST_DB_NAME} >/dev/null 2>&1; then
                print_success "PostgreSQL is ready"
                break
            fi
            if [ $i -eq 30 ]; then
                print_error "PostgreSQL failed to start within 30 seconds"
                cleanup_demo_database
                exit 1
            fi
            sleep 1
        done
        
        # Set test database connection properties
        export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:${TEST_DB_PORT}/${TEST_DB_NAME}"
        export SPRING_DATASOURCE_USERNAME="${TEST_DB_USER}"
        export SPRING_DATASOURCE_PASSWORD="${TEST_DB_PASSWORD}"
    fi
    
    print_success "Demo database setup completed"
}

# Function to cleanup demo database
cleanup_demo_database() {
    if ! is_ci_environment; then
        print_status "Cleaning up demo database..."
        if docker ps --format 'table {{.Names}}' | grep -q "^${DEMO_DB_CONTAINER}$"; then
            docker stop ${DEMO_DB_CONTAINER} >/dev/null 2>&1
            docker rm ${DEMO_DB_CONTAINER} >/dev/null 2>&1
            print_success "Demo database cleaned up"
        fi
    fi
}

# Trap to ensure cleanup on script exit
trap cleanup_demo_database EXIT

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed or not in PATH"
    exit 1
fi

# Setup demo database
setup_demo_database

print_status "Cleaning previous test artifacts..."
mvn clean -q

print_status "Compiling test classes..."
if mvn test-compile -q; then
    print_success "Test compilation successful"
else
    print_error "Test compilation failed"
    exit 1
fi

# Run different test suites
echo ""
echo "🧪 Running Test Suites..."
echo "========================="

# Set Maven test properties to use our demo database
MAVEN_OPTS="-Dspring.datasource.url=${SPRING_DATASOURCE_URL} \
           -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
           -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
           -Dspring.profiles.active=test"

# 1. Unit Tests
print_status "Running Unit Tests..."
if mvn test -Dtest="*Test" ${MAVEN_OPTS} -q; then
    print_success "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# 2. Integration Tests
print_status "Running Integration Tests..."
if mvn test -Dtest="*ControllerTest,*IntegrationTest" ${MAVEN_OPTS} -q; then
    print_success "Integration tests passed"
else
    print_error "Integration tests failed"
    exit 1
fi

# 3. Service Tests
print_status "Running Service Tests..."
if mvn test -Dtest="*ServiceTest" ${MAVEN_OPTS} -q; then
    print_success "Service tests passed"
else
    print_error "Service tests failed"
    exit 1
fi

# 4. Performance Tests (optional, can be skipped with --skip-performance)
if [[ "$1" != "--skip-performance" ]]; then
    print_status "Running Performance Tests..."
    if mvn test -Dtest="*PerformanceTest" ${MAVEN_OPTS} -q; then
        print_success "Performance tests passed"
    else
        print_warning "Performance tests failed (non-critical)"
    fi
fi

# 5. Security Tests
print_status "Running Security Tests..."
if mvn test -Dtest="*SecurityTest" ${MAVEN_OPTS} -q; then
    print_success "Security tests passed"
else
    print_error "Security tests failed"
    exit 1
fi

# 6. Generate Test Report
print_status "Generating test reports..."
mvn surefire-report:report -q

# 7. Test Coverage (if jacoco is configured)
if mvn help:describe -Dplugin=org.jacoco:jacoco-maven-plugin -q &> /dev/null; then
    print_status "Generating coverage report..."
    mvn jacoco:report -q
fi

echo ""
echo "📊 Test Summary"
echo "==============="

# Count test results
TOTAL_TESTS=$(find target/surefire-reports -name "*.xml" -exec grep -l "testcase" {} \; 2>/dev/null | wc -l)
FAILED_TESTS=$(find target/surefire-reports -name "*.xml" -exec grep -l "failure\|error" {} \; 2>/dev/null | wc -l)
PASSED_TESTS=$((TOTAL_TESTS - FAILED_TESTS))

echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    print_success "All tests passed! 🎉"
    echo ""
    echo "📁 Test reports available at:"
    echo "   - Surefire Report: target/site/surefire-report.html"
    echo "   - Coverage Report: target/site/jacoco/index.html (if available)"
    exit 0
else
    print_error "$FAILED_TESTS tests failed"
    echo ""
    echo "📁 Check detailed reports at:"
    echo "   - target/surefire-reports/"
    echo "   - target/site/surefire-report.html"
    exit 1
fi
