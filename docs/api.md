# Smart Tourist Guide — API Documentation

> RESTful API for the Smart Tourist Guide Morocco platform. All endpoints are versioned under `/api/v1`.

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Health Check](#health-check)
3. [Auth](#auth)
4. [Users (Admin)](#users-admin)
5. [Roles (Admin)](#roles-admin)
6. [Cities](#cities)
7. [Restaurants](#restaurants)
8. [Attractions](#attractions)
9. [Hotels](#hotels)
10. [Rooms](#rooms)
11. [Drivers](#drivers)
12. [Vehicles](#vehicles)
13. [Hotel Bookings](#hotel-bookings)
14. [Transport Bookings](#transport-bookings)
15. [Reviews](#reviews)
16. [Favorites](#favorites)
17. [User Profile](#user-profile)
18. [AI Itinerary](#ai-itinerary)
19. [Error Codes](#error-codes)

---

## Base URL & Authentication

**Base URL:** `http://localhost:8000/api/v1`

**Authentication:** Laravel Sanctum Bearer Token

Include the token in the `Authorization` header for all protected endpoints:

```
Authorization: Bearer <your_token_here>
```

**Roles:**

| Role | Value |
|------|-------|
| Tourist | `tourist` |
| Driver | `driver` |
| Hotel Manager | `hotel_manager` |
| Administrator | `administrator` |

**User Statuses:** `Pending`, `Approved`, `Rejected`, `Suspended`

**Booking Statuses:** `Pending`, `Confirmed`, `InProgress`, `Cancelled`, `Completed`

---

## Health Check

### `GET /health`

Check API availability. **No authentication required.**

**Response:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-08-12T00:00:00.000000Z"
}
```

---

## Auth

### `POST /auth/register`

Register a new user. **No authentication required.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `first_name` | string | Yes | max:100 |
| `last_name` | string | Yes | max:100 |
| `email` | string | Yes | email, max:150, unique |
| `phone` | string | Yes | max:20, unique |
| `password` | string | Yes | min:8, confirmed |
| `role` | string | Yes | `tourist`, `driver`, `hotel_manager`, `administrator` |
| `city_id` | integer | Conditional | required if role is `driver`, must exist in `cities` |
| `license_number` | string | Conditional | required if role is `driver`, unique in `drivers` |

**Request Example:**

```json
{
  "first_name": "Mohamed",
  "last_name": "Ali",
  "email": "mohamed@gmail.com",
  "phone": "0612345678",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "role": "tourist"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": 1,
    "first_name": "Mohamed",
    "last_name": "Ali",
    "email": "mohamed@gmail.com",
    "phone": "0612345678",
    "role": "tourist",
    "status": "Pending",
    "active": true,
    "created_at": "2026-08-12T00:00:00.000000Z",
    "updated_at": "2026-08-12T00:00:00.000000Z"
  },
  "token": "1|abc123..."
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 422 | Validation failed (missing fields, duplicate email/phone) |

---

### `POST /auth/login`

Authenticate a user and receive a token. **No authentication required.**

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Request Example:**

```json
{
  "email": "mohamed@gmail.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": 1,
    "first_name": "Mohamed",
    "last_name": "Ali",
    "email": "mohamed@gmail.com",
    "phone": "0612345678",
    "role": "tourist",
    "status": "Approved",
    "active": true
  },
  "token": "1|abc123..."
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 422 | `The provided credentials are incorrect.` |

---

### `POST /auth/logout`

Revoke the current access token. **Requires auth.**

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

### `GET /auth/me`

Get the authenticated user's profile. **Requires auth.**

**Response:** `200 OK`

```json
{
  "id": 1,
  "first_name": "Mohamed",
  "last_name": "Ali",
  "email": "mohamed@gmail.com",
  "phone": "0612345678",
  "role": "tourist",
  "status": "Approved",
  "active": true
}
```

---

### `POST /tokens`

Issue a new API token with specific abilities. **Requires auth.**

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Token name, max:255 |
| `abilities` | array | No | Array of ability strings (default: `["*"]`) |

**Response:** `201 Created`

```json
{
  "token": "2|abc123...",
  "token_id": 2,
  "name": "mobile-app",
  "abilities": ["*"],
  "created_at": "2026-08-12T00:00:00.000000Z"
}
```

---

### `GET /tokens`

List all API tokens for the authenticated user. **Requires auth.**

**Response:** `200 OK`

```json
{
  "tokens": [
    {
      "id": 1,
      "name": "auth-token",
      "abilities": ["*"],
      "last_used_at": "2026-08-12T00:00:00.000000Z",
      "expires_at": null,
      "created_at": "2026-08-12T00:00:00.000000Z"
    }
  ]
}
```

---

### `DELETE /tokens/{tokenId}`

Revoke a specific API token. **Requires auth.**

**Response:** `200 OK`

```json
{
  "message": "Token revoked successfully"
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 404 | Token not found |

---

### `DELETE /tokens`

Revoke all API tokens. **Requires auth.**

**Response:** `200 OK`

```json
{
  "message": "All tokens revoked successfully"
}
```

---

## Users (Admin)

Admin routes are prefixed with `/admin` and require `administrator` role.

### `GET /admin/stats`

Get dashboard statistics. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "data": {
    "total_users": 10,
    "total_cities": 9,
    "total_hotels": 15,
    "total_bookings": 42,
    "average_rating": 4.2,
    "recent_users": [
      {
        "id": 1,
        "first_name": "Mohamed",
        "last_name": "Ali",
        "email": "mohamed@gmail.com",
        "role": "tourist"
      }
    ],
    "recent_bookings": [
      {
        "id": 1,
        "booking_number": "HB-20260812-001",
        "tourist_name": "Mohamed Ali",
        "hotel_name": "Riad Marrakech",
        "start_date": "2026-09-01",
        "end_date": "2026-09-05",
        "status": "Confirmed",
        "total_price": 480.00
      }
    ]
  }
}
```

---

### `GET /admin/users`

List all users with pagination and filters. **Requires auth + admin role.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role |
| `status` | string | Filter by status |
| `active` | boolean | Filter by active status |
| `search` | string | Search by first_name, last_name, or email |
| `page` | integer | Page number (default: 1) |

**Response:** `200 OK`

```json
[
  {
    "user_id": 1,
    "first_name": "Mohamed",
    "last_name": "Ali",
    "email": "mohamed@gmail.com",
    "phone": "0612345678",
    "role": "tourist",
    "status": "Approved",
    "active": true,
    "created_at": "2026-08-12T00:00:00.000000Z"
  }
]
```

---

### `POST /admin/users`

Create a new user. **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `first_name` | string | Yes | max:100 |
| `last_name` | string | Yes | max:100 |
| `email` | string | Yes | email, max:150, unique |
| `phone` | string | Yes | max:20, unique |
| `password` | string | Yes | min:8, confirmed |
| `role` | string | Yes | `Tourist`, `Driver`, `Hotel Manager`, `Administrator` (or lowercase) |
| `status` | string | No | `Pending`, `Approved`, `Rejected`, `Suspended` |
| `city_id` | integer | Conditional | required if role is `Driver` |
| `license_number` | string | Conditional | required if role is `Driver` |

**Response:** `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "user_id": 2,
    "first_name": "Sara",
    "last_name": "Ben",
    "email": "sara@gmail.com",
    "role": "driver",
    "status": "Pending",
    "active": true
  }
}
```

---

### `GET /admin/users/{user}`

Get a single user. **Requires auth + admin role.**

**Response:** `200 OK` — User object with `driver` and `bookings` relations.

---

### `PUT /admin/users/{user}`

Update a user. **Requires auth + admin role.**

**Request Body:** Same as `POST /admin/users` but all fields are optional (`sometimes` validation).

**Response:** `200 OK`

```json
{
  "message": "User updated successfully",
  "user": { ... }
}
```

---

### `DELETE /admin/users/{user}`

Delete a user. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

---

## Roles (Admin)

### `GET /admin/roles`

List all roles with user counts. **Requires auth + admin role.**

**Response:** `200 OK` — Paginated list of roles.

```json
[
  {
    "id": 1,
    "name": "Admin",
    "slug": "admin",
    "description": "Platform administrator with full access.",
    "users_count": 1,
    "created_at": "2026-08-12T00:00:00.000000Z",
    "updated_at": "2026-08-12T00:00:00.000000Z"
  }
]
```

---

### `POST /admin/roles`

Create a new role. **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | max:50, unique |
| `slug` | string | Yes | max:50, unique |
| `description` | string | No | max:255 |

**Response:** `201 Created`

```json
{
  "message": "Role created successfully",
  "role": { ... }
}
```

---

### `GET /admin/roles/{role}`

Get a single role with its users. **Requires auth + admin role.**

---

### `PUT /admin/roles/{role}`

Update a role. **Requires auth + admin role.**

**Request Body:** Same as `POST /admin/roles` but all fields are optional.

**Response:** `200 OK`

```json
{
  "message": "Role updated successfully",
  "role": { ... }
}
```

---

### `DELETE /admin/roles/{role}`

Delete a role. **Requires auth + admin role.**

**Errors:**

| Status | Description |
|--------|-------------|
| 409 | Cannot delete role with assigned users |

**Response:** `200 OK`

```json
{
  "message": "Role deleted successfully"
}
```

---

## Cities

### `GET /cities`

List all cities. **Requires auth.**

**Response:** `200 OK`

```json
[
  {
    "city_id": 1,
    "name": "Marrakech",
    "region": "Marrakech-Safi",
    "description": "The Red City, famed for its medina, souks, and Jemaa el-Fnaa square.",
    "hotels_count": 5,
    "attractions_count": 8,
    "restaurants_count": 3
  }
]
```

---

### `GET /cities/{city}`

Get a single city with its hotels, attractions, and restaurants. **Requires auth.**

**Response:** `200 OK` — City object with `hotels`, `attractions`, `restaurants` relations loaded.

---

### `POST /cities`

Create a new city. **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | max:100, unique |
| `description` | string | No | — |
| `region` | string | No | max:100 |

**Response:** `201 Created`

```json
{
  "message": "City created successfully",
  "city": {
    "city_id": 10,
    "name": "Meknes",
    "region": "Fes-Meknes",
    "description": "An imperial city with historic monuments."
  }
}
```

---

### `PUT /cities/{city}`

Update a city. **Requires auth + admin role.**

**Request Body:** Same as `POST /cities` but all fields required.

**Response:** `200 OK`

```json
{
  "message": "City updated successfully",
  "city": { ... }
}
```

---

### `DELETE /cities/{city}`

Delete a city. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "City deleted successfully"
}
```

---

## Restaurants

### `GET /restaurants`

List all restaurants. **Requires auth.**

**Response:** `200 OK`

```json
[
  {
    "restaurant_id": 1,
    "city_id": 1,
    "name": "Nomad",
    "description": "Modern Moroccan cuisine.",
    "address": "Derb Aarjane, Marrakech",
    "cuisine": "Moroccan",
    "phone": "+212524381234",
    "price_range": 3,
    "average_rating": 4.5,
    "reviews_count": 12,
    "is_favorite": false,
    "city": { ... },
    "reviews": [ ... ]
  }
]
```

---

### `POST /restaurants`

Create a restaurant. **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `name` | string | Yes | max:150, unique |
| `description` | string | No | — |
| `address` | string | No | max:255 |
| `cuisine` | string | Yes | max:100 |
| `phone` | string | No | max:20 |
| `price_range` | integer | No | between:1-4 |

**Response:** `201 Created`

```json
{
  "message": "Restaurant created successfully",
  "restaurant": { ... }
}
```

---

### `GET /restaurants/{restaurant}`

Get a single restaurant with reviews. **Requires auth.**

---

### `PUT /restaurants/{restaurant}`

Update a restaurant. **Requires auth + admin role.**

**Request Body:** Same as `POST /restaurants`.

**Response:** `200 OK`

```json
{
  "message": "Restaurant updated successfully",
  "restaurant": { ... }
}
```

---

### `DELETE /restaurants/{restaurant}`

Delete a restaurant. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Restaurant deleted successfully"
}
```

---

## Attractions

### `GET /attractions`

List attractions with filters. **Requires auth.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `city_id` | integer | Filter by city |
| `category` | string | Filter by category |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |
| `min_rating` | number | Minimum average rating |
| `search` | string | Search by name |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of attractions.

```json
[
  {
    "id": 1,
    "name": "Jemaa el-Fnaa",
    "slug": "jemaa-el-fnaa",
    "description": "Famous square and market in Marrakech.",
    "address": "Jemaa el-Fnaa, Marrakech",
    "opening_hours": "24/7",
    "city_id": 1,
    "created_by": 1,
    "average_rating": 4.7,
    "reviews_count": 20,
    "is_favorite": false,
    "city": { ... },
    "reviews": [ ... ]
  }
]
```

---

### `POST /attractions`

Create an attraction. **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `name` | string | Yes | max:150, unique |
| `description` | string | No | — |
| `address` | string | No | max:255 |
| `opening_hours` | string | No | max:100 |

**Response:** `201 Created`

```json
{
  "message": "Attraction created successfully",
  "attraction": { ... }
}
```

---

### `GET /attractions/{attraction}`

Get a single attraction with reviews. **Requires auth.**

---

### `PUT /attractions/{attraction}`

Update an attraction. **Requires auth.** Must be the creator or admin.

**Request Body:** Same as `POST /attractions`.

**Response:** `200 OK`

```json
{
  "message": "Attraction updated successfully",
  "attraction": { ... }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 403 | You are not authorized to update this attraction |

---

### `DELETE /attractions/{attraction}`

Delete an attraction. **Requires auth.** Must be the creator or admin.

**Response:** `200 OK`

```json
{
  "message": "Attraction deleted successfully"
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 403 | You are not authorized to delete this attraction |

---

## Hotels

### `GET /hotels`

List hotels with filters. **Requires auth.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `city_id` | integer | Filter by city |
| `star_rating` | integer | Filter by stars (1-5) |
| `min_price` | number | Minimum room price |
| `max_price` | number | Maximum room price |
| `search` | string | Search by hotel name |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of hotels.

```json
[
  {
    "id": 1,
    "name": "Riad Marrakech",
    "address": "Derb Sidi Ahmed, Marrakech",
    "phone": "+212524381234",
    "email": "info@riadmarrakech.com",
    "description": "Traditional riad in the heart of the medina.",
    "stars": 4,
    "city_id": 1,
    "created_by": 1,
    "average_rating": 4.3,
    "reviews_count": 15,
    "rooms_count": 8,
    "is_favorite": false,
    "city": { ... },
    "rooms": [ ... ],
    "reviews": [ ... ]
  }
]
```

---

### `POST /hotels`

Create a hotel. **Requires auth + admin or hotel_manager role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `name` | string | Yes | max:150 |
| `address` | string | Yes | max:255 |
| `phone` | string | No | max:20 |
| `email` | string | No | email, max:150 |
| `description` | string | No | — |
| `stars` | integer | No | min:1, max:5 |

**Response:** `201 Created`

```json
{
  "message": "Hotel created successfully",
  "hotel": { ... }
}
```

---

### `GET /hotels/{hotel}`

Get a single hotel with rooms and reviews. **Requires auth.**

---

### `PUT /hotels/{hotel}`

Update a hotel. **Requires auth.** Must be the creator, admin, or hotel_manager.

**Request Body:** Same as `POST /hotels` but all fields optional.

**Response:** `200 OK`

```json
{
  "message": "Hotel updated successfully",
  "hotel": { ... }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 403 | You are not authorized to update this hotel |

---

### `DELETE /hotels/{hotel}`

Delete a hotel (soft delete). **Requires auth.** Must be the creator, admin, or hotel_manager.

**Response:** `200 OK`

```json
{
  "message": "Hotel deleted successfully"
}
```

---

## Rooms

### `GET /hotels/{hotelId}/rooms`

List rooms for a hotel. **Requires auth.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by room type |
| `available` | boolean | Filter by availability |
| `min_price` | number | Minimum price per night |
| `max_price` | number | Maximum price per night |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of rooms.

```json
[
  {
    "room_id": 1,
    "hotel_id": 1,
    "number": "101",
    "type": "Deluxe",
    "capacity": 2,
    "price_per_night": 120.00,
    "available": true,
    "hotel": { ... }
  }
]
```

---

### `POST /hotels/{hotelId}/rooms`

Create a room. **Requires auth + admin or hotel_manager role.** Must own the hotel.

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `number` | string | Yes | max:20, unique per hotel |
| `type` | string | Yes | max:50 |
| `capacity` | integer | Yes | min:1 |
| `price_per_night` | number | Yes | gt:0 |
| `available` | boolean | No | default: true |

**Response:** `201 Created`

```json
{
  "message": "Room created successfully",
  "room": { ... }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 403 | You are not authorized to add rooms to this hotel |

---

### `GET /rooms/{id}`

Get a single room. **Requires auth.**

---

### `PUT /rooms/{id}`

Update a room. **Requires auth.** Must be the hotel owner, admin, or hotel_manager.

**Request Body:** Same as `POST /rooms` but all fields optional.

**Response:** `200 OK`

```json
{
  "message": "Room updated successfully",
  "room": { ... }
}
```

---

### `DELETE /rooms/{id}`

Soft delete a room. **Requires auth.** Must be the hotel owner, admin, or hotel_manager.

**Response:** `200 OK`

```json
{
  "message": "Room deleted successfully"
}
```

---

### `PUT /rooms/{id}/restore`

Restore a soft-deleted room. **Requires auth.** Must be the hotel owner, admin, or hotel_manager.

**Response:** `200 OK`

```json
{
  "message": "Room restored successfully",
  "room": { ... }
}
```

---

### `DELETE /rooms/{id}/force`

Permanently delete a room. **Requires auth.** Must be the hotel owner, admin, or hotel_manager.

**Response:** `200 OK`

```json
{
  "message": "Room permanently deleted"
}
```

---

## Drivers

### `POST /drivers/profile`

Get or create a driver profile. **Requires auth + driver role.**

**Response:** `200 OK`

```json
{
  "id": 1,
  "user_id": 5,
  "city_id": 1,
  "license_number": "DL-ABC123",
  "years_of_experience": 5,
  "languages": "Arabic, French, English",
  "available": true,
  "is_verified": false,
  "user": { ... },
  "city": { ... }
}
```

---

### `GET /drivers`

List all drivers. **Requires auth.**

**Response:** `200 OK` — Array of driver objects with `user`, `city`, `vehicles`, `reviews` relations.

---

### `POST /drivers`

Create a driver profile. **Requires auth.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `license_number` | string | Yes | max:20, unique |
| `years_of_experience` | integer | No | min:0 |
| `languages` | string | No | max:255 |
| `available` | boolean | No | default: true |

**Response:** `201 Created`

```json
{
  "id": 1,
  "user_id": 5,
  "city_id": 1,
  "license_number": "DL-ABC123",
  "years_of_experience": 5,
  "languages": "Arabic, French",
  "available": true,
  "is_verified": false
}
```

---

### `GET /drivers/{id}`

Get a single driver. **Requires auth.**

---

### `PUT /drivers/{id}`

Update a driver. **Requires auth.**

**Request Body:** Same as `POST /drivers` but all fields optional.

**Response:** `200 OK`

---

### `PATCH /drivers/{id}/verify`

Verify a driver. **Requires auth + admin role.**

**Response:** `200 OK`

---

## Vehicles

### `GET /drivers/{driverId}/vehicles`

List vehicles for a driver. **Requires auth.**

**Response:** `200 OK`

```json
[
  {
    "vehicle_id": 1,
    "driver_id": 1,
    "brand": "Toyota",
    "model": "Corolla",
    "type": "sedan",
    "seats": 4,
    "registration_number": "ABC-1234",
    "air_conditioning": true,
    "price_per_km": 2.50,
    "driver": { ... }
  }
]
```

---

### `POST /drivers/{driverId}/vehicles`

Create a vehicle. **Requires auth + driver role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `brand` | string | Yes | max:100 |
| `model` | string | Yes | max:100 |
| `type` | string | Yes | `sedan`, `suv`, `van`, `minibus` |
| `seats` | integer | Yes | min:1 |
| `registration_number` | string | Yes | max:50, unique |
| `air_conditioning` | boolean | No | default: true |
| `price_per_km` | number | Yes | gt:0 |

**Response:** `201 Created`

```json
{
  "vehicle_id": 1,
  "driver_id": 1,
  "brand": "Toyota",
  "model": "Corolla",
  "type": "sedan",
  "seats": 4,
  "registration_number": "ABC-1234",
  "air_conditioning": true,
  "price_per_km": 2.50
}
```

---

### `GET /vehicles/{id}`

Get a single vehicle. **Requires auth.**

---

### `PUT /vehicles/{id}`

Update a vehicle. **Requires auth.**

**Request Body:** Same as `POST /vehicles` but all fields optional.

**Response:** `200 OK`

---

### `DELETE /vehicles/{id}`

Delete a vehicle. **Requires auth.**

**Response:** `200 OK`

---

## Hotel Bookings

### `GET /hotel-bookings`

List hotel bookings. **Requires auth.** Tourists see their own, hotel managers see bookings for their hotels.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of bookings.

```json
[
  {
    "id": 1,
    "user_id": 1,
    "room_id": 1,
    "booking_number": "HB-20260812-001",
    "booking_type": "Hotel",
    "booking_date": "2026-08-12",
    "start_date": "2026-09-01",
    "end_date": "2026-09-05",
    "total_price": 480.00,
    "status": "Pending",
    "user": { ... },
    "room": { ... },
    "hotel": { ... }
  }
]
```

---

### `POST /hotel-bookings`

Create a hotel booking. **Requires auth + tourist role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `room_id` | integer | Yes | must exist in `rooms` |
| `start_date` | date | Yes | after:today |
| `end_date` | date | Yes | after:start_date |

**Response:** `201 Created`

```json
{
  "message": "Booking created successfully",
  "booking": { ... }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 422 | Room not available for selected dates |

---

### `GET /hotel-bookings/{booking}`

Get a single booking. **Requires auth.** Tourists can only see their own; hotel managers can only see bookings for their hotels.

---

### `PATCH /hotel-bookings/{booking}/cancel`

Cancel a booking. **Requires auth.** Tourists can cancel their own; hotel managers can cancel bookings for their hotels.

**Response:** `200 OK`

```json
{
  "message": "Booking cancelled successfully",
  "booking": { ... }
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| 403 | Unauthorized |
| 422 | Cannot cancel a booking in current status |

---

### `PATCH /hotel-bookings/{booking}/status`

Update booking status. **Requires auth + hotel_manager role.**

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | Yes | `confirmed`, `completed` |

**Response:** `200 OK`

```json
{
  "message": "Booking status updated successfully",
  "booking": { ... }
}
```

---

### `DELETE /hotel-bookings/{booking}`

Delete a booking (admin only). **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Booking deleted successfully"
}
```

---

## Transport Bookings

### `GET /transport-bookings`

List transport bookings. **Requires auth.** Tourists see their own; drivers see bookings assigned to them.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of transport bookings.

```json
[
  {
    "id": 1,
    "user_id": 1,
    "driver_id": 1,
    "room_id": null,
    "booking_number": "TB-20260812-001",
    "booking_type": "Airport Transfer",
    "booking_date": "2026-08-12",
    "start_date": "2026-09-01",
    "end_date": "2026-09-01",
    "total_price": 150.00,
    "distance_km": 30.5,
    "status": "Pending",
    "user": { ... },
    "driver": { ... }
  }
]
```

---

### `POST /transport-bookings`

Create a transport booking. **Requires auth + tourist role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `vehicle_id` | integer | Yes | must exist in `vehicles` |
| `driver_id` | integer | Yes | must exist in `drivers` |
| `room_id` | integer | No | must exist in `rooms` |
| `distance_km` | number | Yes | gt:0 |
| `booking_type` | string | Yes | `Hotel + Driver`, `Airport Transfer` |
| `start_date` | date | Yes | after:today |
| `end_date` | date | Yes | after_or_equal:start_date |

**Response:** `201 Created`

```json
{
  "message": "Transport booking created successfully",
  "booking": { ... }
}
```

---

### `GET /transport-bookings/{booking}`

Get a single transport booking. **Requires auth.**

---

### `PATCH /transport-bookings/{booking}/cancel`

Cancel a transport booking. **Requires auth.** Tourists can cancel their own; drivers can cancel assigned bookings.

**Response:** `200 OK`

```json
{
  "message": "Booking cancelled successfully",
  "booking": { ... }
}
```

---

### `PATCH /transport-bookings/{booking}/status`

Update transport booking status. **Requires auth + driver role.**

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | Yes | `confirmed`, `completed` |

**Response:** `200 OK`

```json
{
  "message": "Booking status updated successfully",
  "booking": { ... }
}
```

---

### `DELETE /transport-bookings/{booking}`

Delete a transport booking (admin only). **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Booking deleted successfully"
}
```

---

## Reviews

### `GET /reviews`

List all reviews. **Requires auth.**

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "rating": 5,
    "comment": "Excellent hotel, great service!",
    "created_at": "2026-08-12T00:00:00.000000Z",
    "user": {
      "id": 1,
      "first_name": "Mohamed",
      "last_name": "Ali"
    },
    "hotel": {
      "id": 1,
      "name": "Riad Marrakech"
    }
  }
]
```

---

### `POST /reviews`

Create a review. **Requires auth + tourist role.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `rating` | integer | Yes | between:1-5 |
| `comment` | string | No | max:1000 |
| `hotel_id` | integer | No | must exist in `hotels` |
| `driver_id` | integer | No | must exist in `drivers` |
| `attraction_id` | integer | No | must exist in `attractions` |

At least one of `hotel_id`, `driver_id`, or `attraction_id` must be provided.

**Response:** `201 Created`

```json
{
  "id": 1,
  "rating": 5,
  "comment": "Excellent hotel, great service!",
  "created_at": "2026-08-12T00:00:00.000000Z",
  "user": { ... },
  "hotel": { ... }
}
```

---

### `GET /reviews/{review}`

Get a single review. **Requires auth.**

---

### `PUT /reviews/{review}`

Update a review. **Requires auth.** Must be the review author.

**Request Body:** Same as `POST /reviews` but all fields optional.

**Response:** `200 OK`

---

### `DELETE /reviews/{review}`

Delete a review. **Requires auth.** Must be the review author.

**Response:** `200 OK`

---

## Favorites

### `GET /favorites`

List the authenticated user's favorites. **Requires auth.**

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "created_at": "2026-08-12T00:00:00.000000Z",
    "hotel_id": 1,
    "attraction_id": null,
    "restaurant_id": null,
    "hotel": { ... },
    "attraction": null,
    "restaurant": null
  }
]
```

---

### `POST /favorites/toggle`

Toggle a favorite (add if not exists, remove if exists). **Requires auth.**

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `type` | string | Yes | `hotel`, `attraction`, `restaurant` |
| `id` | integer | Yes | ID of the item |

**Request Example:**

```json
{
  "type": "hotel",
  "id": 1
}
```

**Response:** `200 OK`

```json
{
  "message": "Favorite added",
  "is_favorite": true
}
```

or

```json
{
  "message": "Favorite removed",
  "is_favorite": false
}
```

---

### `DELETE /favorites/{favorite}`

Remove a favorite by its ID. **Requires auth.**

**Response:** `200 OK`

```json
{
  "message": "Favorite removed"
}
```

---

## User Profile

### `GET /profile`

Get the authenticated user's full profile. **Requires auth.**

**Response:** `200 OK` — User object.

---

### `PUT /profile`

Update the authenticated user's profile. **Requires auth.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `first_name` | string | Yes | max:100 |
| `last_name` | string | Yes | max:100 |
| `email` | string | Yes | email, max:150, unique (excl. self) |
| `phone` | string | Yes | max:20, unique (excl. self) |

**Response:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### `PUT /profile/driver`

Update the authenticated user's driver profile. **Requires auth.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `license_number` | string | Yes | max:20, unique (excl. self) |
| `years_of_experience` | integer | No | min:0 |
| `languages` | string | No | max:255 |
| `available` | boolean | No | — |

**Response:** `200 OK`

```json
{
  "message": "Driver profile updated successfully",
  "driver": { ... }
}
```

---

## Admin Trashed Items

### `GET /admin/trashed/hotels`

List soft-deleted hotels. **Requires auth + admin role.**

**Response:** `200 OK` — Paginated list of trashed hotels.

---

### `POST /admin/trashed/hotels/{id}/restore`

Restore a soft-deleted hotel. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Hotel restored successfully",
  "hotel": { ... }
}
```

---

### `DELETE /admin/trashed/hotels/{id}/force`

Permanently delete a hotel. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Hotel permanently deleted"
}
```

---

### `GET /admin/trashed/rooms`

List soft-deleted rooms. **Requires auth + admin role.**

**Response:** `200 OK` — Paginated list of trashed rooms.

---

### `POST /admin/trashed/rooms/{id}/restore`

Restore a soft-deleted room. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Room restored successfully",
  "room": { ... }
}
```

---

### `DELETE /admin/trashed/rooms/{id}/force`

Permanently delete a room. **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Room permanently deleted"
}
```

---

## Admin Hotel Bookings

### `GET /admin/hotel-bookings`

List all hotel bookings (admin view). **Requires auth + admin role.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `search` | string | Search by booking_number or user name |
| `per_page` | integer | Results per page (default: 15) |

**Response:** `200 OK` — Paginated list of bookings.

---

### `DELETE /admin/hotel-bookings/{booking}`

Delete a hotel booking (admin). **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Booking deleted successfully"
}
```

---

### `PATCH /admin/hotel-bookings/{booking}/status`

Update hotel booking status (admin). **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | Yes | `confirmed`, `completed`, `cancelled` |

**Response:** `200 OK`

```json
{
  "message": "Booking status updated successfully",
  "booking": { ... }
}
```

---

## Admin Transport Bookings

### `GET /admin/transport-bookings`

List all transport bookings (admin view). **Requires auth + admin role.**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `search` | string | Search by booking_number or user name |
| `per_page` | integer | Results per page (default: 15) |

---

### `DELETE /admin/transport-bookings/{booking}`

Delete a transport booking (admin). **Requires auth + admin role.**

**Response:** `200 OK`

```json
{
  "message": "Booking deleted successfully"
}
```

---

### `PATCH /admin/transport-bookings/{booking}/status`

Update transport booking status (admin). **Requires auth + admin role.**

**Request Body:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | Yes | `confirmed`, `completed`, `cancelled` |

---

## Hotel Manager Routes

All hotel manager routes are prefixed with `/hotel-manager` and require `hotel_manager` role.

### `GET /hotel-manager/manage-hotel`

List hotels owned by the authenticated hotel manager. **Requires auth + hotel_manager role.**

**Response:** `200 OK` — Paginated list of hotels.

---

### `POST /hotel-manager/manage-hotel`

Create a hotel. **Requires auth + hotel_manager role.**

**Request Body:** Same as `POST /hotels`.

---

### `GET /hotel-manager/manage-hotel/{hotel}`

Get a single hotel. **Requires auth + hotel_manager role.**

---

### `PUT /hotel-manager/manage-hotel/{hotel}`

Update a hotel. **Requires auth + hotel_manager role.**

---

### `DELETE /hotel-manager/manage-hotel/{hotel}`

Soft delete a hotel. **Requires auth + hotel_manager role.**

---

### `GET /hotel-manager/manage-hotel/trashed`

List soft-deleted hotels. **Requires auth + hotel_manager role.**

---

### `POST /hotel-manager/manage-hotel/{hotel}/restore`

Restore a soft-deleted hotel. **Requires auth + hotel_manager role.**

---

### `DELETE /hotel-manager/manage-hotel/{hotel}/force-delete`

Permanently delete a hotel. **Requires auth + hotel_manager role.**

---

### `GET /hotel-manager/manage-rooms`

List rooms for the hotel manager's hotels. **Requires auth + hotel_manager role.**

---

### `POST /hotel-manager/manage-rooms`

Create a room. **Requires auth + hotel_manager role.**

---

### `GET /hotel-manager/manage-rooms/{room}`

Get a single room (includes trashed). **Requires auth + hotel_manager role.**

---

### `PUT /hotel-manager/manage-rooms/{room}`

Update a room. **Requires auth + hotel_manager role.**

---

### `DELETE /hotel-manager/manage-rooms/{room}`

Soft delete a room. **Requires auth + hotel_manager role.**

---

### `GET /hotel-manager/manage-rooms/trashed`

List soft-deleted rooms. **Requires auth + hotel_manager role.**

---

### `POST /hotel-manager/manage-rooms/{room}/restore`

Restore a soft-deleted room. **Requires auth + hotel_manager role.**

---

### `DELETE /hotel-manager/manage-rooms/{room}/force-delete`

Permanently delete a room. **Requires auth + hotel_manager role.**

---

## Driver Routes

All driver routes are prefixed with `/driver` and require `driver` role.

### `GET /driver/manage-vehicle`

List vehicles for the authenticated driver. **Requires auth + driver role.**

---

### `POST /driver/manage-vehicle`

Create a vehicle. **Requires auth + driver role.**

---

### `GET /driver/manage-vehicle/{vehicle}`

Get a single vehicle. **Requires auth + driver role.**

---

### `PUT /driver/manage-vehicle/{vehicle}`

Update a vehicle. **Requires auth + driver role.**

---

### `DELETE /driver/manage-vehicle/{vehicle}`

Delete a vehicle. **Requires auth + driver role.**

---

### `GET /driver/transport-bookings`

List transport bookings for the driver. **Requires auth + driver role.**

---

### `GET /driver/transport-bookings/{booking}`

Get a single transport booking. **Requires auth + driver role.**

---

### `PUT /driver/transport-bookings/{booking}`

Update a transport booking. **Requires auth + driver role.**

---

## AI Itinerary

### `POST /ai/itinerary`

Generate a travel itinerary using AI. **Requires auth.**

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `city_id` | integer | Yes | must exist in `cities` |
| `preferences` | string | Yes | `adventure`, `cultural`, `relaxation` |
| `number_of_days` | integer | Yes | min:1, max:14 |
| `budget` | string | Yes | `LOW`, `MEDIUM`, `HIGH` |

**Request Example:**

```json
{
  "city_id": 1,
  "preferences": "cultural",
  "number_of_days": 3,
  "budget": "MEDIUM"
}
```

**Response:** `200 OK`

```json
{
  "city": "Marrakech",
  "preferences": "cultural",
  "budget": "MEDIUM",
  "total_days": 3,
  "estimated_total_cost": "$450",
  "itinerary": [
    {
      "day": 1,
      "title": "Exploring the Medina",
      "activities": [
        {
          "time": "09:00",
          "activity": "Visit Jemaa el-Fnaa square",
          "location": "Jemaa el-Fnaa"
        }
      ]
    }
  ]
}
```

---

### `GET /ai/itinerary/{itineraryJob}/status`

Check the status of an itinerary generation job. **Requires auth.**

**Response:** `200 OK`

```json
{
  "status": "completed",
  "result": { ... }
}
```

---

## Error Codes

| Status | Description |
|--------|-------------|
| `400` | Bad Request — Malformed syntax |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — Insufficient permissions |
| `404` | Not Found — Resource does not exist |
| `409` | Conflict — e.g., deleting role with assigned users |
| `422` | Unprocessable Content — Validation failed |
| `500` | Internal Server Error |

**Standard Error Response:**

```json
{
  "message": "Error description here",
  "errors": {
    "field_name": ["Specific validation error message"]
  }
}
```

**Validation Error Example (422):**

```json
{
  "message": "The first name field is required. (and 2 more errors)",
  "errors": {
    "first_name": ["The first name field is required."],
    "last_name": ["The last name field is required."],
    "phone": ["The phone field is required."]
  }
}
```
