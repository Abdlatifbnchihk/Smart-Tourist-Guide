## 1. Resource

- [x] 1.1 Create `FavoriteResource` in `app/Http/Resources/`

## 2. Controller

- [x] 2.1 Create `FavoriteController` in `app/Http/Controllers/Api/V1/`
- [x] 2.2 Implement `index` method with type filtering (hotel/attraction/restaurant)
- [x] 2.3 Implement `toggle` method with add/remove logic
- [x] 2.4 Implement `destroy` method with ownership check

## 3. Routes

- [x] 3.1 Add favorite routes in api.php (index, toggle, destroy)

## 4. Tests

- [x] 4.1 Write test for listing all favorites
- [x] 4.2 Write test for filtering favorites by hotel type
- [x] 4.3 Write test for filtering favorites by attraction type
- [x] 4.4 Write test for adding new favorite (toggle add)
- [x] 4.5 Write test for removing existing favorite (toggle remove)
- [x] 4.6 Write test for invalid type validation error
- [x] 4.7 Write test for non-existent entity validation error
- [x] 4.8 Write test for deleting favorite by ID
- [x] 4.9 Write test for deleting non-existent favorite (404)
- [x] 4.10 Write test for deleting other user's favorite (404)
