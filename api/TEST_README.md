# NewsletterX API - End-to-End Tests

This document describes the comprehensive end-to-end test suite for the NewsletterX API.

## 📋 Test Coverage

### Authentication Tests (`AuthenticationControllerTest`)
- ✅ User registration (success, duplicate email/website, invalid data)
- ✅ User authentication (valid/invalid credentials, disabled users)
- ✅ Email confirmation (valid/invalid tokens)
- ✅ Token refresh and logout
- ✅ Account re-enablement for disabled users

### Subscription Tests (`SubscriptionsControllerTest`)
- ✅ Create subscriptions (success, duplicates, validation)
- ✅ Email verification (valid/invalid tokens)
- ✅ Unsubscribe functionality
- ✅ Subscription counting and analytics
- ✅ Multi-domain subscription support

### User Management Tests (`UserManagementControllerTest`)
- ✅ User profile management (get, update)
- ✅ Password changes (validation, security)
- ✅ User statistics and analytics
- ✅ Admin vs regular user permissions
- ✅ Account deletion and data export

### Newsletter Tests (`NewsletterControllerTest`)
- ✅ Newsletter template management
- ✅ Newsletter configuration (get, update)
- ✅ Test newsletter sending
- ✅ Newsletter analytics and metrics
- ✅ Website collector configuration
- ✅ Installation script generation
- ✅ Newsletter scheduling and management
- ✅ Subscriber management (list, export, import)
- ✅ Content validation

### Performance Tests (`LoadTest`)
- ✅ Concurrent user registrations
- ✅ Concurrent subscription requests
- ✅ Database connection pool stress testing
- ✅ Memory efficiency under load
- ✅ Overall system performance metrics

## 🛠️ Test Infrastructure

### Base Test Configuration
- **Base Class**: `BaseIntegrationTest` - Provides common setup and utilities
- **Database**: H2 in-memory database for fast, isolated tests
- **Security**: Spring Security Test support with mock users
- **Data**: Automated test data setup with `test-data.sql`

### Test Utilities
- **TestUtils**: Helper methods for creating test data and common operations
- **JSON Serialization**: Automatic object-to-JSON conversion for requests
- **Mock Authentication**: JWT token generation for authenticated endpoints

## 🚀 Running Tests

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker (optional, for PostgreSQL integration tests)

### Quick Start
```bash
# Run all tests
cd api
./run-tests.sh

# Skip performance tests (faster)
./run-tests.sh --skip-performance

# Run specific test categories
mvn test -Dtest="*ControllerTest"  # Integration tests only
mvn test -Dtest="LoadTest"         # Performance tests only
mvn test -Dtest="*Test"            # Unit tests only
```

### Maven Commands
```bash
# Clean and run all tests
mvn clean test

# Run tests with coverage
mvn clean test jacoco:report

# Run specific test class
mvn test -Dtest=AuthenticationControllerTest

# Run specific test method
mvn test -Dtest=AuthenticationControllerTest#testUserRegistration_Success

# Run tests in parallel (faster)
mvn test -DforkCount=2 -DreuseForks=true
```

## 📊 Test Reports

After running tests, reports are available at:
- **Surefire Report**: `target/site/surefire-report.html`
- **Coverage Report**: `target/site/jacoco/index.html`
- **Raw Results**: `target/surefire-reports/`

## 🔧 Configuration

### Test Profiles
- **test**: Default test profile with H2 database
- **integration**: Uses real PostgreSQL database
- **performance**: Optimized for performance testing

### Environment Variables
```bash
# Override test database
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/test_db
export SPRING_DATASOURCE_USERNAME=test_user
export SPRING_DATASOURCE_PASSWORD=test_pass

# Enable debug logging
export LOGGING_LEVEL_ROOT=DEBUG
```

### Test Data
Test data is automatically loaded from:
- `test-data.sql`: Initial test users, websites, and configurations
- `TestUtils`: Dynamic test data generation

## 🧪 Writing New Tests

### Test Structure
```java
@DisplayName("Your Test Description")
public class YourControllerTest extends BaseIntegrationTest {
    
    @Test
    @DisplayName("Should do something successfully")
    public void testSomething_Success() throws Exception {
        // Arrange
        SomeRequest request = TestUtils.createSomeRequest();
        
        // Act & Assert
        mockMvc.perform(post("/api/endpoint")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.field").value("expected"));
    }
}
```

### Best Practices
1. **Use descriptive test names**: `testUserRegistration_Success` vs `test1`
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test both success and failure cases**
4. **Use `@DisplayName` for clear test descriptions**
5. **Verify database state changes when applicable**
6. **Clean up test data with `@Transactional`**

### Authentication Testing
```java
@Test
@WithMockUser(username = "test@example.com", roles = {"USER"})
public void testProtectedEndpoint() throws Exception {
    String token = getValidJwtToken("test@example.com");
    
    mockMvc.perform(get("/api/protected")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
}
```

## 🔄 Continuous Integration

Tests run automatically on:
- **Push** to main/develop branches
- **Pull Requests** to main/develop
- **Daily schedule** at 2 AM UTC

### GitHub Actions Workflow
- Multi-version Java testing (17, 21)
- PostgreSQL service container
- Test result reporting
- Security scanning
- Artifact uploads

## 📈 Performance Benchmarks

Current performance targets:
- **Registration**: < 500ms per request
- **Authentication**: < 200ms per request
- **Subscription**: < 300ms per request
- **Concurrent Users**: 50+ simultaneous requests
- **Memory Usage**: < 100MB increase for 1000 operations

## 🐛 Troubleshooting

### Common Issues

1. **Tests fail with database connection errors**
   ```bash
   # Ensure PostgreSQL is running
   docker-compose up postgres
   ```

2. **Permission denied on test runner**
   ```bash
   chmod +x run-tests.sh
   ```

3. **Out of memory errors during performance tests**
   ```bash
   # Increase JVM memory
   export MAVEN_OPTS="-Xmx2g -Xms1g"
   ```

4. **Tests pass locally but fail in CI**
   - Check environment-specific configurations
   - Verify test data setup
   - Review timing-sensitive tests

### Debug Mode
```bash
# Run tests with debug output
mvn test -X

# Enable SQL logging
mvn test -Dlogging.level.org.hibernate.SQL=DEBUG
```

## 📚 Additional Resources

- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)
- [MockMvc Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-framework)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [TestContainers Documentation](https://www.testcontainers.org/)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add performance tests for high-load endpoints
4. Update this documentation
5. Verify CI/CD pipeline passes
