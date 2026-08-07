## 1. Setup and Infrastructure

- [ ] 1.1 Create page component directory structure under `src/pages/hotel-manager/`
- [x] 1.2 Create API service file `src/services/hotelManagerService.js` with functions for all endpoints
- [x] 1.3 Add route definitions to React Router configuration for `/hotel-manager/*` paths

## 2. Dashboard Overview Page

- [x] 2.1 Create `HotelManagerDashboard.jsx` page component with statistics display
- [x] 2.2 Implement API calls to fetch dashboard statistics (hotels count, rooms count, bookings by status, average rating)
- [x] 2.3 Add navigation links to "My Hotels" and "Bookings" pages
- [x] 2.4 Display recent activity section showing 5 most recent bookings

## 3. Hotel Management - List and Create

- [ ] 3.1 Create `HotelList.jsx` page component with hotels table
- [ ] 3.2 Implement API call to fetch manager's hotels list
- [ ] 3.3 Add "Create New Hotel" button with navigation to create form
- [ ] 3.4 Create `HotelForm.jsx` component with form fields (name, city, address, phone, email, description, stars)
- [ ] 3.5 Implement form validation for required fields and email format
- [ ] 3.6 Create `CreateHotel.jsx` page that uses HotelForm for new hotel creation
- [ ] 3.7 Implement POST API call for hotel creation with success/error feedback

## 4. Hotel Management - Edit

- [ ] 4.1 Create `EditHotel.jsx` page that uses HotelForm for hotel editing
- [ ] 4.2 Implement GET API call to fetch hotel data for pre-populating form
- [ ] 4.3 Implement PUT API call for hotel update with success/error feedback
- [ ] 4.4 Add cancel button with navigation back to hotels list

## 5. Room Management - List and Create

- [ ] 5.1 Create `RoomList.jsx` page component with rooms table for specific hotel
- [ ] 5.2 Implement API call to fetch rooms list by hotel ID
- [ ] 5.3 Add "Add Room" button with navigation to create form
- [ ] 5.4 Create `RoomForm.jsx` component with form fields (number, type, capacity, price_per_night, quantity_available, available toggle)
- [ ] 5.5 Implement form validation for required fields and positive price
- [ ] 5.6 Create `CreateRoom.jsx` page that uses RoomForm for new room creation
- [ ] 5.7 Implement POST API call for room creation with success/error feedback

## 6. Room Management - Edit and Delete

- [ ] 6.1 Create `EditRoom.jsx` page that uses RoomForm for room editing
- [ ] 6.2 Implement GET API call to fetch room data for pre-populating form
- [ ] 6.3 Implement PUT API call for room update with success/error feedback
- [x] 6.4 Add soft-delete functionality with confirmation dialog
- [x] 6.5 Implement DELETE API call for room soft-delete
- [x] 6.6 Display deleted rooms with visual indicator (strikethrough/grayed out)
- [x] 6.7 Add restore functionality for soft-deleted rooms
- [x] 6.8 Implement PUT API call to restore deleted rooms

## 7. Bookings Management

- [x] 7.1 Create `BookingList.jsx` page component with bookings table
- [x] 7.2 Implement API call to fetch bookings list
- [x] 7.3 Add status filter dropdown (All, Pending, Confirmed, Completed, Cancelled)
- [x] 7.4 Implement client-side filtering based on selected status
- [x] 7.5 Add status update buttons (Confirm, Complete, Cancel) with appropriate visibility
- [x] 7.6 Implement confirmation dialog for booking cancellation
- [x] 7.7 Implement PUT API calls for booking status updates
- [x] 7.8 Add visual status indicators (colors) for each booking status

## 8. Testing and Integration

- [ ] 8.1 Test dashboard page displays correct statistics
- [ ] 8.2 Test hotel CRUD operations (create, read, update)
- [ ] 8.3 Test room CRUD operations including soft-delete and restore
- [ ] 8.4 Test booking list filtering and status updates
- [ ] 8.5 Test form validation and error handling
- [ ] 8.6 Verify all routes navigate correctly
