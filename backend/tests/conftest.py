"""
Pytest configuration and shared fixtures for all tests.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db
from app import models


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh in-memory SQLite database for each test."""
    # Create in-memory SQLite database
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    yield session
    
    # Cleanup
    session.close()
    engine.dispose()


@pytest.fixture(scope="function")
def client(test_db):
    """Create TestClient with isolated test database."""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestClient(app)
    
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(test_db):
    """Create a test student user in database."""
    user = models.User(
        email="student@example.com",
        password="hashedpass",
        username="student_user",
        phone="9876543210",
        hostel_name="Hostel A",
        room_number="101",
        batch="2024",
        role="student",
        auth_provider="local"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_worker(test_db):
    """Create a test worker user in database."""
    worker = models.User(
        email="worker@test.example.com",
        password="hashedpass",
        username="worker_user",
        phone="9876543211",
        hostel_name="Hostel A",
        room_number="102",
        batch="2024",
        role="worker",
        auth_provider="local"
    )
    test_db.add(worker)
    test_db.commit()
    test_db.refresh(worker)
    return worker


@pytest.fixture(scope="function")
def test_complaint(test_db, test_user):
    """Create a test complaint."""
    complaint = models.Complaint(
        title="Test Electrical Issue",
        description="This is a test complaint for electrical problems in my room.",
        category="electrical",
        status="open",
        created_by=test_user.id,
        image_url=None
    )
    test_db.add(complaint)
    test_db.commit()
    test_db.refresh(complaint)
    return complaint


@pytest.fixture(scope="function")
def test_user_data():
    """Test user registration data."""
    return {
        "email": "newuser@example.com",
        "password": "SecurePass123!",
        "username": "new_user",
        "phone": "9876543210",
        "hostel_name": "Hostel B",
        "room_number": "201",
        "batch": "2024"
    }


@pytest.fixture(scope="function")
def auth_token(client, test_user):
    """Get JWT auth token for test user."""
    # This would need your actual login endpoint
    # For testing endpoints that require auth, this would be implemented
    return None
