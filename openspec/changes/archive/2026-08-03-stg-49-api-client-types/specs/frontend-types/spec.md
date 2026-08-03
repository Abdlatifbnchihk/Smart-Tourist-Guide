## ADDED Requirements

### Requirement: User type definition
The system SHALL define a User type with id, first_name, last_name, email, phone, role, status, active, created_at, updated_at fields.

#### Scenario: User type exists
- **WHEN** types/index.js is imported
- **THEN** a User type definition exists with all required fields

### Requirement: City type definition
The system SHALL define a City type with city_id, name, region, description, created_at, updated_at fields.

#### Scenario: City type exists
- **WHEN** types/index.js is imported
- **THEN** a City type definition exists with all required fields

### Requirement: Attraction type definition
The system SHALL define an Attraction type with attraction_id, city_id, name, description, address, opening_hours, created_at, updated_at fields.

#### Scenario: Attraction type exists
- **WHEN** types/index.js is imported
- **THEN** an Attraction type definition exists with all required fields

### Requirement: Hotel type definition
The system SHALL define a Hotel type with hotel_id, city_id, name, address, phone, email, description, stars, created_at, updated_at fields.

#### Scenario: Hotel type exists
- **WHEN** types/index.js is imported
- **THEN** a Hotel type definition exists with all required fields

### Requirement: Room type definition
The system SHALL define a Room type with room_id, hotel_id, number, type, capacity, price_per_night, available, created_at, updated_at fields.

#### Scenario: Room type exists
- **WHEN** types/index.js is imported
- **THEN** a Room type definition exists with all required fields

### Requirement: Driver type definition
The system SHALL define a Driver type with driver_id, user_id, city_id, license_number, years_of_experience, languages, available, created_at, updated_at fields.

#### Scenario: Driver type exists
- **WHEN** types/index.js is imported
- **THEN** a Driver type definition exists with all required fields

### Requirement: Vehicle type definition
The system SHALL define a Vehicle type with vehicle_id, driver_id, brand, model, type, seats, registration_number, air_conditioning, created_at, updated_at fields.

#### Scenario: Vehicle type exists
- **WHEN** types/index.js is imported
- **THEN** a Vehicle type definition exists with all required fields

### Requirement: Booking type definitions
The system SHALL define HotelBooking and TransportBooking types with appropriate fields.

#### Scenario: Booking types exist
- **WHEN** types/index.js is imported
- **THEN** HotelBooking and TransportBooking type definitions exist

### Requirement: Review type definition
The system SHALL define a Review type with review_id, user_id, rating, comment, hotel_id, driver_id, attraction_id, created_at, updated_at fields.

#### Scenario: Review type exists
- **WHEN** types/index.js is imported
- **THEN** a Review type definition exists with all required fields

### Requirement: Favorite type definition
The system SHALL define a Favorite type with favorite_id, user_id, hotel_id, restaurant_id, attraction_id, created_at, updated_at fields.

#### Scenario: Favorite type exists
- **WHEN** types/index.js is imported
- **THEN** a Favorite type definition exists with all required fields

### Requirement: API response types
The system SHALL define ApiResponse and PaginatedResponse types.

#### Scenario: Response types exist
- **WHEN** types/index.js is imported
- **THEN** ApiResponse and PaginatedResponse type definitions exist

### Requirement: Itinerary type definitions
The system SHALL define Itinerary and ItineraryDay types.

#### Scenario: Itinerary types exist
- **WHEN** types/index.js is imported
- **THEN** Itinerary and ItineraryDay type definitions exist

### Requirement: Payload type definitions
The system SHALL define LoginPayload, RegisterPayload, and CreateBookingPayload types.

#### Scenario: Payload types exist
- **WHEN** types/index.js is imported
- **THEN** LoginPayload, RegisterPayload, and CreateBookingPayload type definitions exist
