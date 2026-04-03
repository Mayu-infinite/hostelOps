# Backend Test Suite

Comprehensive pytest test suite for HostelOps backend APIs.

## Structure

```
tests/
├── conftest.py          # Shared fixtures and test configuration
├── test_app.py          # Basic app health and root endpoints
├── test_auth.py         # Authentication API tests
├── test_complaints.py   # Complaints API tests
└── __init__.py
```

## Running Tests

### Run all tests
```bash
pytest
```

### Run tests with verbose output
```bash
pytest -v
```

### Run specific test file
```bash
pytest tests/test_auth.py
```

### Run specific test class
```bash
pytest tests/test_auth.py::TestAuthEndpoints
```

### Run specific test  
```bash
pytest tests/test_auth.py::TestAuthEndpoints::test_register_success
```

### Run with coverage report
```bash
pytest --cov=app tests/
```

### Run with coverage and HTML report
```bash
pytest --cov=app --cov-report=html tests/
```

## Test Organization

### Tests by Module

**test_app.py**
- Root endpoint health checks
- API documentation availability
- Response format validation
- CORS configuration

**test_auth.py**
- User registration
- Duplicate email handling
- Input validation (email, phone, password)
- Login/logout functionality

**test_complaints.py**
- Complaint creation (success and failure cases)
- Fetching complaints (list, detail, history)
- Category validation
- Status updates
- Image URL handling
- Deletion

## Fixtures

All fixtures are defined in `conftest.py`:

- `db` - Fresh test database for each test
- `client` - TestClient with test database
- `test_user` - Sample student user
- `test_worker` - Sample worker user  
- `test_complaint` - Sample complaint
- `auth_headers` - JWT authorization headers

## Key Testing Patterns

1. **Success Cases** - Test expected behavior works
2. **Validation Cases** - Test invalid input is rejected
3. **Edge Cases** - Test boundary conditions
4. **Error Cases** - Test proper error responses
5. **Auth Cases** - Test authorization/permission rules

## Best Practices

- Each test is independent and can run in any order
- Tests use in-memory SQLite database for speed
- Database is fresh for each test (isolation)
- Tests focus on API contract, not implementation
- Descriptive test names indicate what is being tested

## CI/CD Integration

To run tests in CI/CD pipeline:

```bash
pip install -r requirements.txt
pytest --cov=app --cov-report=xml tests/
```

## Notes

- Tests assume FastAPI TestClient behavior
- Some tests may need adjustment if auth is implemented differently
- Add more specific tests as features are added
- Keep test database fixtures minimal and focused
