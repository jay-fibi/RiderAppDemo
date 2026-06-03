# RiderAppDemo – API Reference

> **Base URL:** `https://api.riderapp.example.com/v1`  
> **Auth:** All endpoints (except `/auth/*` and `/health`) require a `Bearer <token>` header.

---

## Authentication

### POST `/auth/login`
Login and receive a session token.

**Request body**
```json
{ "email": "jay@riderapp.com", "password": "secret" }
```

**Response `200`**
```json
{
  "success": true,
  "token": "mock_token.eyJpZCI6InIwMDEifQ==",
  "user": { "id": "r001", "name": "Jay Gohil", "role": "rider" }
}
```

**Response `401`** – Invalid credentials
```json
{ "success": false, "error": "Invalid email or password." }
```

---

## Riders

### GET `/riders`
Return a list of all riders. Supports optional query filters.

| Query param   | Type   | Description                           |
|---------------|--------|---------------------------------------|
| `status`      | string | Filter by `active`, `inactive`, etc.  |
| `vehicleType` | string | Filter by `bicycle`, `scooter`, etc.  |

**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": "r001", "name": "Jay Gohil", "status": "active", "vehicleType": "bicycle", "rating": 4.8 }
  ]
}
```

---

### GET `/riders/:id`
Fetch a single rider by ID.

**Response `200`**
```json
{ "success": true, "data": { "id": "r001", "name": "Jay Gohil", ... } }
```

**Response `404`**
```json
{ "success": false, "message": "Rider not found." }
```

---

### POST `/riders`
Create a new rider profile.

**Request body**
```json
{ "name": "Priya Sharma", "email": "priya@example.com", "vehicleType": "scooter" }
```

**Response `201`**
```json
{ "success": true, "data": { "id": "r1717000000000", "status": "pending", ... } }
```

---

### PATCH `/riders/:id`
Update one or more fields of an existing rider.

**Request body** *(all fields optional)*
```json
{ "status": "active", "rating": 4.9 }
```

**Response `200`**
```json
{ "success": true, "data": { "id": "r001", "status": "active", "rating": 4.9, ... } }
```

---

### DELETE `/riders/:id`
Permanently remove a rider profile.

**Response `200`**
```json
{ "success": true, "message": "Rider deleted." }
```

---

## Health Check

### GET `/health`
Unauthenticated. Returns service status.

**Response `200`**
```json
{ "status": "ok", "uptime": 3600, "version": "1.0.0" }
```

---

## Error Codes

| HTTP Status | Meaning                                  |
|-------------|------------------------------------------|
| `400`       | Bad request – missing or invalid fields  |
| `401`       | Unauthorized – token missing or expired  |
| `403`       | Forbidden – insufficient role            |
| `404`       | Resource not found                       |
| `500`       | Internal server error                    |

---

## Vehicle Types
`bicycle` · `scooter` · `motorcycle` · `car` · `van`

## Rider Statuses
`pending` · `active` · `inactive` · `suspended`

---

*Documentation generated for RiderAppDemo · © 2026 Cline*
