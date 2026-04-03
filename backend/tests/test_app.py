"""
Tests for basic app endpoints and health checks.
"""

import pytest
from http import HTTPStatus


class TestAppHealth:
    """Test basic application health and root endpoints."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns correct message."""
        response = client.get("/")
        
        assert response.status_code == HTTPStatus.OK
        data = response.json()
        assert "message" in data
        assert "API is running" in data["message"]
    
    def test_api_docs_available(self, client):
        """Test API documentation is available."""
        response = client.get("/docs")
        
        assert response.status_code == HTTPStatus.OK
    
    def test_openapi_schema(self, client):
        """Test OpenAPI schema is available."""
        response = client.get("/openapi.json")
        
        assert response.status_code == HTTPStatus.OK
        data = response.json()
        assert "openapi" in data
        assert "paths" in data


class TestResponseFormats:
    """Test that responses follow expected formats."""
    
    def test_root_response_structure(self, client):
        """Test root endpoint response structure."""
        response = client.get("/")
        
        assert response.status_code == HTTPStatus.OK
        data = response.json()
        assert isinstance(data, dict)
        assert "message" in data
        assert isinstance(data["message"], str)
    
    def test_error_response_structure(self, client):
        """Test error response structure."""
        response = client.get("/api/v1/complaints/invalid-id")
        
        if response.status_code == HTTPStatus.NOT_FOUND:
            data = response.json()
            assert "detail" in data or "message" in data


class TestCORS:
    """Test CORS headers."""
    
    def test_cors_headers(self, client):
        """Test that CORS headers are present in responses."""
        response = client.get("/", headers={"Origin": "http://localhost:3000"})
        
        # CORS is configured in the app
        assert response.status_code == HTTPStatus.OK
