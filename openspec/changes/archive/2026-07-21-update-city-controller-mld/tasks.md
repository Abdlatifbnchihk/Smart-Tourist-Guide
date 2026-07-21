## 1. CityController Updates

- [x] 1.1 Update `index()` method to include `restaurants_count` using `withCount('restaurants')`
- [x] 1.2 Update `show()` method to load `restaurants` relationship using `load('restaurants')`
- [x] 1.3 Ensure `index()` already includes `hotels_count` and `attractions_count` (verify existing code)

## 2. CityResource Updates

- [x] 2.1 Remove `country`, `image`, `latitude`, `longitude` from resource output
- [x] 2.2 Add `restaurants_count` to resource output
- [x] 2.3 Verify `hotels_count` and `attractions_count` are already included (keep existing)

## 3. StoreCityRequest Updates

- [x] 3.1 Remove validation rules for `country`, `image`, `latitude`, `longitude`
- [x] 3.2 Keep validation rules for `name` (required|string|max:100|unique:cities,name)
- [x] 3.3 Keep validation rules for `description` (nullable|string)
- [x] 3.4 Add optional validation for `region` (nullable|string|max:100) if not present

## 4. UpdateCityRequest Updates

- [x] 4.1 Remove validation rules for `country`, `image`, `latitude`, `longitude`
- [x] 4.2 Keep validation rules for `name` (required|string|max:100|unique:cities,name,except:city_id)
- [x] 4.3 Keep validation rules for `description` (nullable|string)
- [x] 4.4 Add optional validation for `region` (nullable|string|max:100) if not present

## 5. Testing & Verification

- [ ] 5.1 Test `GET /api/v1/cities` returns list with `hotels_count`, `attractions_count`, `restaurants_count`
- [ ] 5.2 Test `GET /api/v1/cities/{id}` returns city with `hotels`, `attractions`, `restaurants` relationships
- [ ] 5.3 Test `POST /api/v1/cities` validates only `name`, `description`, `region`
- [ ] 5.4 Test `PUT /api/v1/cities/{id}` validates only `name`, `description`, `region`
- [ ] 5.5 Verify no references to `country`, `image`, `latitude`, `longitude` remain in codebase