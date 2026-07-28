## Purpose

RESTful API endpoints for hotel booking management — listing, creating, viewing, cancelling, and updating booking status with role-based access control.

## Requirements

### Requirement: Tourist can list own bookings
The system SHALL return paginated list of bookings where user_id matches the authenticated tourist.

#### Scenario: Tourist lists own bookings
- **WHEN** tourist sends GET request to /api/v1/hotel-bookings
- **THEN** response returns paginated bookings where user_id equals authenticated user's id

#### Scenario: Tourist cannot see other users' bookings
- **WHEN** tourist sends GET request to /api/v1/hotel-bookings
- **THEN** response only contains bookings where user_id equals authenticated user's id

### Requirement: Hotel owner can list bookings for their hotels
The system SHALL return paginated list of bookings for rooms in hotels owned by the authenticated hotel_owner.

#### Scenario: Hotel owner lists bookings for their hotels
- **WHEN** hotel_owner sends GET request to /api/v1/hotel-bookings
- **THEN** response returns paginated bookings where room belongs to a hotel created by the authenticated user

#### Scenario: Hotel owner cannot see bookings for other hotels
- **WHEN** hotel_owner sends GET request to /api/v1/hotel-bookings
- **THEN** response only contains bookings for hotels where created_by equals authenticated user's id

### Requirement: Tourist can create a booking
The system SHALL allow tourists to create bookings via the service layer with proper validation.

#### Scenario: Tourist creates booking successfully
- **WHEN** tourist sends POST request to /api/v1/hotel-bookings with valid room_id, start_date, end_date
- **THEN** response returns 201 with booking data including computed total_price

#### Scenario: Tourist creates booking with invalid data
- **WHEN** tourist sends POST request with missing required fields
- **THEN** response returns 422 with validation errors

#### Scenario: Tourist creates booking for unavailable room
- **WHEN** tourist sends POST request for room that is unavailable for selected dates
- **THEN** response returns 422 with error message "Room is not available for the selected dates"

### Requirement: User can view booking detail
The system SHALL return booking details with relationships for authorized users.

#### Scenario: Tourist views own booking detail
- **WHEN** tourist sends GET request to /api/v1/hotel-bookings/{id} for own booking
- **THEN** response returns booking with user, room, hotel relationships

#### Scenario: Hotel owner views booking for their hotel
- **WHEN** hotel_owner sends GET request to /api/v1/hotel-bookings/{id} for booking in their hotel
- **THEN** response returns booking with user, room, hotel relationships

#### Scenario: Unauthorized user cannot view booking detail
- **WHEN** user sends GET request to /api/v1/hotel-bookings/{id} for booking they don't own or manage
- **THEN** response returns 403 Forbidden

### Requirement: Tourist or hotel owner can cancel booking
The system SHALL allow cancellation of pending or confirmed bookings by authorized users.

#### Scenario: Tourist cancels own pending booking
- **WHEN** tourist sends PATCH request to /api/v1/hotel-bookings/{id}/cancel for own pending booking
- **THEN** response returns 200 with booking status updated to cancelled

#### Scenario: Hotel owner cancels booking for their hotel
- **WHEN** hotel_owner sends PATCH request to /api/v1/hotel-bookings/{id}/cancel for booking in their hotel
- **THEN** response returns 200 with booking status updated to cancelled

#### Scenario: Cannot cancel completed booking
- **WHEN** user sends PATCH request to cancel a completed booking
- **THEN** response returns 422 with error message about invalid status transition

### Requirement: Hotel owner can update booking status
The system SHALL allow hotel owners to confirm or complete bookings for their hotels.

#### Scenario: Hotel owner confirms pending booking
- **WHEN** hotel_owner sends PATCH request to /api/v1/hotel-bookings/{id}/status with status "confirmed" for pending booking in their hotel
- **THEN** response returns 200 with booking status updated to confirmed

#### Scenario: Hotel owner completes confirmed booking
- **WHEN** hotel_owner sends PATCH request to /api/v1/hotel-bookings/{id}/status with status "completed" for confirmed booking in their hotel
- **THEN** response returns 200 with booking status updated to completed

#### Scenario: Hotel owner cannot confirm completed booking
- **WHEN** hotel_owner sends PATCH request to confirm a completed booking
- **THEN** response returns 422 with error message about invalid status transition

### Requirement: Price is computed by service
The system SHALL compute total_price using HotelBookingService and ignore any client-provided total_price.

#### Scenario: Price computed server-side
- **WHEN** tourist creates booking with valid data
- **THEN** total_price in response equals price_per_night x nights computed by service

#### Scenario: Client-provided price is ignored
- **WHEN** tourist includes total_price in booking creation request
- **THEN** system ignores client value and computes correct price server-side

### Requirement: Booking responses include relationships
The system SHALL return booking data with user, room, and hotel relationships.

#### Scenario: Booking resource includes relationships
- **WHEN** booking is returned in any endpoint
- **THEN** response includes user, room, and hotel relationships with appropriate data
