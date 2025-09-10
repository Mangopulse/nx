# NewsletterX API Test Setup with Demo Database

This document explains how to run the NewsletterX API tests with a demo database that works both locally and in GitHub Actions.

## Overview

The test setup includes:
- **Demo Database**: Isolated PostgreSQL instance for testing
- **Test Data**: Pre-populated test data for comprehensive testing
- **CI/CD Ready**: Works seamlessly with GitHub Actions
- **Local Development**: Easy setup for local testing

## Quick Start

### Local Testing

```bash
# Navigate to API directory
cd api

# Run all tests with demo database
./run-tests.sh

# Skip performance tests (faster execution)
./run-tests.sh --skip-performance
```

### Using Docker Compose (Alternative)

```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run tests manually
mvn test -Dspring.profiles.active=test

# Clean up
docker-compose -f docker-compose.test.yml down -v
```

## Test Database Configuration

### Local Environment
- **Host**: localhost
- **Port**: 5433 (to avoid conflicts with existing PostgreSQL)
- **Database**: nx_test_db
- **Username**: test_admin
- **Password**: test_password

### CI Environment (GitHub Actions)
- **Host**: localhost
- **Port**: 5432 (service container)
- **Database**: nx_test_db
- **Username**: test_admin
- **Password**: test_password

## Test Suites

The test runner executes the following test suites in order:

1. **Unit Tests** (`*Test.java`)
   - Pure unit tests without external dependencies
   - Fast execution, isolated testing

2. **Integration Tests** (`*ControllerTest.java`, `*IntegrationTest.java`)
   - API endpoint testing
   - Database interaction testing

3. **Service Tests** (`*ServiceTest.java`)
   - Business logic testing
   - Service layer validation

4. **Performance Tests** (`*PerformanceTest.java`) - Optional
   - Load testing
   - Response time validation
   - Can be skipped with `--skip-performance`

5. **Security Tests** (`*SecurityTest.java`)
   - Authentication testing
   - Authorization validation
   - Security vulnerability checks

## GitHub Actions Integration

The workflow (`.github/workflows/api-tests.yml`) automatically:

1. Sets up PostgreSQL service container
2. Configures test environment
3. Runs comprehensive test suite
4. Generates test reports
5. Uploads artifacts for review

### Triggering Tests

Tests run automatically on:
- Push to `main`, `develop`, `discovery` branches
- Pull requests to `main`, `develop` branches
- Changes to API code or workflow configuration

## Test Data

The demo database is pre-populated with:
- Test users (regular, admin, pending)
- Sample websites and configurations
- Environment variables for testing
- Email templates and senders

Test data is defined in:
- `src/test/resources/test-data.sql`
- `src/test/resources/application-test.properties`

## Reports and Coverage

After test execution, reports are available at:
- **Test Report**: `target/site/surefire-report.html`
- **Coverage Report**: `target/site/jacoco/index.html` (if configured)
- **Raw Reports**: `target/surefire-reports/`

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```
   Error: Docker is not installed or not running
   Solution: Start Docker Desktop or install Docker
   ```

2. **Port conflict**
   ```
   Error: Port 5433 already in use
   Solution: Stop existing PostgreSQL or change TEST_DB_PORT in run-tests.sh
   ```

3. **Test failures**
   ```
   Check: target/surefire-reports/ for detailed error logs
   ```

### Environment Variables

Override database configuration:
```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/nx_test_db"
export SPRING_DATASOURCE_USERNAME="test_admin"
export SPRING_DATASOURCE_PASSWORD="test_password"
./run-tests.sh
```

## Maintenance

### Updating Test Data

1. Modify `src/test/resources/test-data.sql`
2. Run tests to validate changes
3. Commit changes

### Adding New Tests

1. Follow naming conventions (`*Test.java`, `*ControllerTest.java`, etc.)
2. Use `@ActiveProfiles("test")` annotation
3. Extend appropriate test base classes

### Database Schema Changes

Tests use `spring.jpa.hibernate.ddl-auto=create` which automatically:
- Creates tables from JPA entities
- Drops and recreates on each test run
- Ensures clean state for every test execution

## Performance Considerations

- **Parallel Execution**: Tests can run in parallel for faster execution
- **Database Isolation**: Each test class gets a fresh database
- **Resource Cleanup**: Automatic cleanup after test completion
- **CI Optimization**: Service containers in GitHub Actions for speed

