## 1. Create Enum Files

- [x] 1.1 Create app/Enums/Role.php with Tourist, Driver, Hotel Manager, Administrator values
- [x] 1.2 Create app/Enums/UserStatus.php with Pending, Approved, Rejected, Suspended values
- [x] 1.3 Create app/Enums/BookingStatus.php with Pending, Confirmed, Cancelled, Completed values
- [x] 1.4 Create app/Enums/BookingType.php with Hotel, Hotel + Driver, Airport Transfer values

## 2. Add Label Methods

- [x] 2.1 Add label() method to Role enum
- [x] 2.2 Add label() method to UserStatus enum
- [x] 2.3 Add label() method to BookingStatus enum
- [x] 2.4 Add label() method to BookingType enum

## 3. Update Models

- [x] 3.1 Update User model to cast role to Role enum
- [x] 3.2 Update User model to cast status to UserStatus enum
- [x] 3.3 Create Booking model with status and booking_type casts
- [x] 3.4 Create Booking model with booking_type cast to BookingType enum
