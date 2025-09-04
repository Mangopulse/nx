#!/bin/bash

# NewsletterX API E2E Test Runner
# This script runs comprehensive end-to-end tests for the NewsletterX API

echo "🚀 Starting NewsletterX API E2E Tests..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed or not in PATH"
    exit 1
fi

# Check if Docker is running (for database)
if ! docker info &> /dev/null; then
    print_warning "Docker is not running. Some tests may fail."
fi

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

# 1. Unit Tests
print_status "Running Unit Tests..."
if mvn test -Dtest="*Test" -q; then
    print_success "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# 2. Integration Tests
print_status "Running Integration Tests..."
if mvn test -Dtest="*ControllerTest" -q; then
    print_success "Integration tests passed"
else
    print_error "Integration tests failed"
    exit 1
fi

# 3. Performance Tests (optional, can be skipped with --skip-performance)
if [[ "$1" != "--skip-performance" ]]; then
    print_status "Running Performance Tests..."
    if mvn test -Dtest="LoadTest" -q; then
        print_success "Performance tests passed"
    else
        print_warning "Performance tests failed (non-critical)"
    fi
fi

# 4. Generate Test Report
print_status "Generating test reports..."
mvn surefire-report:report -q

# 5. Test Coverage (if jacoco is configured)
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
