# Central API Reference

This document covers the core endpoints exposed by the shared API server running on port `4000`.

---

## Authentication Endpoints (BetterAuth)

All authentication endpoints are mounted under the base path `/api/auth/*` on `http://localhost:4000`.

### 1. Request Login Code
Sends a 6-digit OTP code to the requested email address. In development, the code is printed directly to the server terminal console.

- **URL:** `/api/auth/email-otp/send-verification-otp`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "type": "sign-in"
  }
  ```
- **Response (200 Success):**
  ```json
  {
    "success": true
  }
  ```

---

### 2. Verify Code & Sign In
Verifies the 6-digit OTP code. If the code is correct, the server authenticates the user, generates a session token, and sets the session cookie. If the user doesn't have an account, it registers them automatically.

- **URL:** `/api/auth/sign-in/email-otp`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "name": "John Doe" // Optional: used for registration on first login
  }
  ```
- **Response Headers:**
  - `Set-Cookie: better-auth.session_token=...; HttpOnly; Path=/; SameSite=Lax;`
- **Response (200 Success):**
  ```json
  {
    "session": {
      "id": "session-uuid",
      "userId": "user-uuid",
      "expiresAt": "2026-07-25T12:00:00.000Z"
    },
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": true
    }
  }
  ```

---

### 3. Sign Out
Terminates the active session and clears the session cookies.

- **URL:** `/api/auth/sign-out`
- **Method:** `POST`
- **Response Headers:**
  - `Set-Cookie: better-auth.session_token=; Max-Age=0; Path=/;`
- **Response (200 Success):**
  ```json
  {
    "success": true
  }
  ```

---

### 4. Fetch Session
Retrieves details of the currently authenticated session by reading the session token cookie.

- **URL:** `/api/auth/get-session`
- **Method:** `GET`
- **Headers:** Includes cookies (`better-auth.session_token`)
- **Response (200 Success):**
  - If authenticated: Returns user and session objects.
  - If unauthenticated: Returns `null`.

---

## Health Check Endpoint

- **URL:** `/api/health`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "ok",
    "database": "connected"
  }
  ```
