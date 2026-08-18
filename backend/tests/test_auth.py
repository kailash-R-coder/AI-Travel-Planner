import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_user_registration_and_login(client: TestClient):
    # 1. Register new user
    register_payload = {
        "name": "Kailash",
        "email": "kailash@example.com",
        "password": "Password123!"
    }
    reg_response = client.post("/api/auth/register", json=register_payload)
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "kailash@example.com"
    token = data["access_token"]

    # 2. Duplicate registration should fail
    dup_response = client.post("/api/auth/register", json=register_payload)
    assert dup_response.status_code == 400

    # 3. Login with correct credentials
    login_payload = {
        "email": "kailash@example.com",
        "password": "Password123!"
    }
    login_response = client.post("/api/auth/login", json=login_payload)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    # 4. Login with invalid password should fail
    bad_login = {
        "email": "kailash@example.com",
        "password": "WrongPassword"
    }
    bad_resp = client.post("/api/auth/login", json=bad_login)
    assert bad_resp.status_code == 401

    # 5. Access protected /me route
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["name"] == "Kailash"


def test_unauthenticated_protected_route(client: TestClient):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
