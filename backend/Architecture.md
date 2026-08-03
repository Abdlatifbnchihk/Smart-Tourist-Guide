# Smart Tourist Guide - Backend Architecture

## Project Structure

```
backend/
├── app/
│   ├── Enums/                  # PHP 8.1+ Enums
│   │   ├── BookingStatus.php   # Pending, Confirmed, InProgress, Cancelled, Completed
│   │   └── BookingType.php     # Hotel, Transport
│   ├── Http/
│   │   ├── Controllers/        # API Controllers (see below)
│   │   ├── Requests/           # Form Request validation classes
│   │   └── Resources/          # API Resource transformers
│   ├── Models/                 # Eloquent Models
│   └── Services/               # Business logic services
├── database/
│   └── migrations/             # Database migrations
└── routes/
    └── api.php                 # API route definitions
```

## Controllers Folder Structure

```
app/Http/Controllers/
├── AuthController.php              # Core authentication (login, register, logout, tokens)
├── Controller.php                  # Base controller
│
├── Admin/                          # Administrator management (role:administrator)
│   ├── AdminController.php         # User management (CRUD)
│   └── RoleController.php          # Role management (CRUD)
│
├── Api/
│   └── V1/
│       ├── AiController.php        # AI itinerary generation
│       │
│       ├── Catalog/                # Public catalog endpoints
│       │   ├── AttractionController.php   # Attractions (public read, admin write)
│       │   ├── CityController.php         # Cities (CRUD)
│       │   └── RestaurantController.php   # Restaurants (CRUD)
│       │
│       ├── Hotel/                  # Hotel-related endpoints
│       │   ├── HotelController.php        # Hotels (public read, owner write)
│       │   ├── HotelBookingController.php # Hotel bookings (tourist/manager)
│       │   └── RoomController.php         # Rooms (public read, owner write)
│       │
│       ├── Transport/              # Transport booking endpoints
│       │   └── TransportBookingController.php # Transport bookings (tourist/driver)
│       │
│       └── User/                   # User-related endpoints
│           ├── FavoriteController.php     # User favorites (toggle/list/delete)
│           ├── ReviewController.php       # Reviews (CRUD with service)
│           └── UserController.php         # User profile management
│
├── Driver/                         # Driver-specific endpoints (role:driver)
│   ├── BookingController.php       # Driver transport bookings (list/show/updateStatus)
│   ├── DriverController.php        # Driver profiles (CRUD, verify)
│   └── VehicleController.php       # Driver vehicles (CRUD)
│
└── HotelManager/                   # Hotel manager endpoints (role:hotel_manager)
    ├── HotelController.php         # Manage own hotels (CRUD)
    └── RoomController.php          # Manage own rooms (CRUD, restore, forceDelete)
```

## Route Mapping

### Public Routes (No Auth)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET | `/health` | Closure | Health check |
| POST | `/auth/register` | `AuthController` | `register` |
| POST | `/auth/login` | `AuthController` | `login` |

### Auth Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| POST | `/tokens` | `AuthController` | `issueToken` |
| GET | `/tokens` | `AuthController` | `listTokens` |
| DELETE | `/tokens/{tokenId}` | `AuthController` | `revokeToken` |
| DELETE | `/tokens` | `AuthController` | `revokeAllTokens` |
| POST | `/auth/logout` | `AuthController` | `logout` |
| GET | `/auth/me` | `AuthController` | `me` |

### Admin Routes (role:administrator)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/admin/users` | `Admin\AdminController` | `index/store` |
| GET/PUT/DELETE | `/admin/users/{user}` | `Admin\AdminController` | `show/update/destroy` |
| GET/POST | `/admin/roles` | `Admin\RoleController` | `index/store` |
| GET/PUT/DELETE | `/admin/roles/{role}` | `Admin\RoleController` | `show/update/destroy` |

### Catalog Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/cities` | `Catalog\CityController` | `index/store` |
| GET/PUT/DELETE | `/cities/{city}` | `Catalog\CityController` | `show/update/destroy` |
| GET/POST | `/restaurants` | `Catalog\RestaurantController` | `index/store` |
| GET/PUT/DELETE | `/restaurants/{restaurant}` | `Catalog\RestaurantController` | `show/update/destroy` |
| GET | `/attractions` | `Catalog\AttractionController` | `index` |
| GET | `/attractions/{attraction}` | `Catalog\AttractionController` | `show` |
| POST | `/attractions` | `Catalog\AttractionController` | `store` (admin) |
| PUT | `/attractions/{attraction}` | `Catalog\AttractionController` | `update` (admin) |
| DELETE | `/attractions/{attraction}` | `Catalog\AttractionController` | `destroy` |

### Hotel Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET | `/hotels` | `Hotel\HotelController` | `index` |
| GET | `/hotels/{hotel}` | `Hotel\HotelController` | `show` |
| POST | `/hotels` | `Hotel\HotelController` | `store` (hotel_manager) |
| PUT | `/hotels/{hotel}` | `Hotel\HotelController` | `update` |
| DELETE | `/hotels/{hotel}` | `Hotel\HotelController` | `destroy` |
| GET | `/hotels/{hotelId}/rooms` | `Hotel\RoomController` | `index` |
| POST | `/hotels/{hotelId}/rooms` | `Hotel\RoomController` | `store` (hotel_manager) |
| GET | `/rooms/{id}` | `Hotel\RoomController` | `show` |
| PUT | `/rooms/{id}` | `Hotel\RoomController` | `update` |
| DELETE | `/rooms/{id}` | `Hotel\RoomController` | `destroy` |
| PUT | `/rooms/{id}/restore` | `Hotel\RoomController` | `restore` |
| DELETE | `/rooms/{id}/force` | `Hotel\RoomController` | `forceDestroy` |

### Hotel Booking Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/hotel-bookings` | `Hotel\HotelBookingController` | `index/store` |
| GET | `/hotel-bookings/{booking}` | `Hotel\HotelBookingController` | `show` |
| PATCH | `/hotel-bookings/{booking}/cancel` | `Hotel\HotelBookingController` | `cancel` |
| PATCH | `/hotel-bookings/{booking}/status` | `Hotel\HotelBookingController` | `status` |

### Transport Booking Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET | `/transport-bookings` | `Transport\TransportBookingController` | `index` |
| POST | `/transport-bookings` | `Transport\TransportBookingController` | `store` |
| GET | `/transport-bookings/{booking}` | `Transport\TransportBookingController` | `show` |
| PATCH | `/transport-bookings/{booking}/cancel` | `Transport\TransportBookingController` | `cancel` |
| PATCH | `/transport-bookings/{booking}/status` | `Transport\TransportBookingController` | `status` |

### Driver Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/drivers` | `Driver\DriverController` | `index/store` |
| GET | `/drivers/{id}` | `Driver\DriverController` | `show` |
| PUT | `/drivers/{id}` | `Driver\DriverController` | `update` |
| PATCH | `/drivers/{id}/verify` | `Driver\DriverController` | `verify` (admin) |
| GET | `/drivers/{driverId}/vehicles` | `Driver\VehicleController` | `index` |
| POST | `/drivers/{driverId}/vehicles` | `Driver\VehicleController` | `store` (driver) |
| GET/PUT/DELETE | `/vehicles/{id}` | `Driver\VehicleController` | `show/update/destroy` |

### User Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET | `/profile` | `User\UserController` | `profile` |
| PUT | `/profile` | `User\UserController` | `updateProfile` |
| PUT | `/profile/driver` | `User\UserController` | `updateDriverProfile` |
| GET | `/favorites` | `User\FavoriteController` | `index` |
| POST | `/favorites/toggle` | `User\FavoriteController` | `toggle` |
| DELETE | `/favorites/{favorite}` | `User\FavoriteController` | `destroy` |
| GET/POST | `/reviews` | `User\ReviewController` | `index/store` |
| GET/PUT/DELETE | `/reviews/{review}` | `User\ReviewController` | `show/update/destroy` |

### Hotel Manager Routes (role:hotel_manager)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/hotel-manager/manage-hotel` | `HotelManager\HotelController` | `index/store` |
| GET/PUT/DELETE | `/hotel-manager/manage-hotel/{hotel}` | `HotelManager\HotelController` | `show/update/destroy` |
| GET/POST | `/hotel-manager/manage-rooms` | `HotelManager\RoomController` | `index/store` |
| PUT/DELETE | `/hotel-manager/manage-rooms/{room}` | `HotelManager\RoomController` | `update/destroy` |
| GET | `/hotel-manager/manage-rooms/{room}` | `HotelManager\RoomController` | `show` (withTrashed) |
| POST | `/hotel-manager/manage-rooms/{room}/restore` | `HotelManager\RoomController` | `restore` |
| DELETE | `/hotel-manager/manage-rooms/{room}/force-delete` | `HotelManager\RoomController` | `forceDelete` |

### Driver Management Routes (role:driver)
| Method | URI | Controller | Action |
|---|---|---|---|
| GET/POST | `/driver/manage-vehicle` | `Driver\VehicleController` | `index/store` |
| GET/PUT/DELETE | `/driver/manage-vehicle/{vehicle}` | `Driver\VehicleController` | `show/update/destroy` |
| GET | `/driver/transport-bookings` | `Driver\BookingController` | `index` |
| GET | `/driver/transport-bookings/{booking}` | `Driver\BookingController` | `show` |
| PATCH | `/driver/transport-bookings/{booking}` | `Driver\BookingController` | `update` |

### AI Routes (auth:sanctum)
| Method | URI | Controller | Action |
|---|---|---|---|
| POST | `/ai/itinerary` | `AiController` | `generateItinerary` |

## Models

| Model | Table | Key Relationships |
|---|---|---|
| `User` | `users` | hasOne Driver, hasMany Bookings, Reviews, Favorites |
| `Hotel` | `hotels` | belongsTo City, hasMany Rooms, Reviews |
| `Room` | `rooms` | belongsTo Hotel, hasMany Bookings |
| `Booking` | `bookings` | belongsTo User, Room, Driver |
| `Driver` | `drivers` | belongsTo User, hasMany Vehicles, Bookings |
| `Vehicle` | `vehicles` | belongsTo Driver |
| `City` | `cities` | hasMany Hotels, Attractions, Restaurants |
| `Attraction` | `attractions` | belongsTo City, hasMany Reviews |
| `Restaurant` | `restaurants` | belongsTo City |
| `Review` | `reviews` | belongsTo User, Hotel/Driver/Attraction |
| `Favorite` | `favorites` | belongsTo User, Hotel/Attraction/Restaurant |

## Services

| Service | Responsibility |
|---|---|
| `HotelBookingService` | Hotel booking creation, confirmation, cancellation, completion |
| `TransportBookingService` | Transport booking creation, confirmation, start, completion, cancellation |
| `ReviewService` | Review creation, update, deletion with authorization |

## Naming Conventions

- **Public endpoints** (`Api\V1\`): Read-heavy operations accessible to authenticated users
- **Role-specific endpoints** (`Driver\`, `HotelManager\`): Protected by role middleware
- **Domain grouping**: Controllers grouped by business domain within `Api\V1\`
  - `Catalog/` - Cities, restaurants, attractions
  - `Hotel/` - Hotels, rooms, hotel bookings
  - `Transport/` - Transport bookings
  - `User/` - Favorites, reviews, user profiles
