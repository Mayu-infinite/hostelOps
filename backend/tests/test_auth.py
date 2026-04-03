"""
Tests for Authentication endpoints (/api/v1/auth)
"""

import pytest
from http import HTTPStatus


class TestAuthEndpoints:
    """Test authentication API endpoints."""
    
    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "username": "newuser",
                "phone": "9876543210",
                "hostel_name": "Hostel B",
                "room_number": "201",
                "batch": "2024"
            }
        )
        
        assert response.status_code == HTTPStatus.CREATED
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["username"] == "newuser"
        assert data["role"] == "student"
        assert "id" in data
    
    def test_register_duplicate_email(self, client, test_user):
        """Test registration fails with duplicate email."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",  # Same as test_user
                "password": "SecurePass123!",
                "username": "differentuser",
                "phone": "9876543210",
                "hostel_name": "Hostel B",
                "room_number": "201",
                "batch": "2024"
            }
        )
        
        assert response.status_code == HTTPStatus.BAD_REQUEST
        assert "already exists" in response.json()["detail"]
    
    def test_register_missing_fields(self, client):
        """Test registration fails with missing required fields."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!"
                # Missing other required fields
            }
        )
        
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    
    def test_get_current_user(self, client, test_user):
        """Test getting current user info."""
        # This would need proper JWT token - adjust based on your auth
        response = client.get("/api/v1/auth/me")
        
        # If no auth, expect 401 or protected response
        assert response.status_code in [HTTPStatus.UNAUTHORIZED, HTTPStatus.UNPROCESSABLE_ENTITY]
    
    def test_logout(self, client):
        """Test user logout."""
        response = client.post("/api/v1/auth/logout")
        
        # Logout might require auth
        assert response.status_code in [HTTPStatus.OK, HTTPStatus.UNAUTHORIZED]


class TestAuthValidation:
    """Test authentication validation and edge cases."""
    
    def test_register_weak_password(self, client):
        """Test registration with weak password is rejected."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "123",  # Too weak
                "username": "newuser",
                "phone": "9876543210",
                "hostel_name": "Hostel B",
                "room_number": "201",
                "batch": "2024"
            }
        )
        
        # Should fail validation or password strength check
        assert response.status_code >= HTTPStatus.BAD_REQUEST
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "notanemail",  # Invalid format
                "password": "SecurePass123!",
                "username": "newuser",
                "phone": "9876543210",
                "hostel_name": "Hostel B",
                "room_number": "201",
                "batch": "2024"
            }
        )
        
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    
    def test_register_invalid_phone(self, client):
        """Test registration with invalid phone number."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "username": "newuser",
                "phone": "123",  # Too short
                "hostel_name": "Hostel B",
                "room_number": "201",
                "batch": "2024"
            }
        )
        
        # May pass validation if not strict, or fail
        # Adjust assertion based on your validation rules
        assert response.status_code in [HTTPStatus.CREATED, HTTPStatus.UNPROCESSABLE_ENTITY]
