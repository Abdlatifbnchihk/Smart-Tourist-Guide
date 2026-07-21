## Why

The CityController currently includes columns that don't exist in the MLD schema (country, image, latitude, longitude) and lacks the restaurants count relationship. This misalignment causes API responses to include non-existent fields and miss required data, breaking frontend integration and violating the database design.

## What Changes

- Remove `country`, `image`, `latitude`, `longitude` references from CityController, CityResource, StoreCityRequest, UpdateCityRequest
- Add `restaurants_count` to CityResource and include restaurants relationship in `show()`
- Include restaurants count alongside hotels/attractions in `index()`
- Align validation rules with MLD schema (keep `name`, `description` only)

## Capabilities

### New Capabilities
- `cities`: City API endpoints, resources, and request validation aligned with MLD schema

### Modified Capabilities
<!-- None - no existing spec for cities -->

## Impact

- **Affected files**:
  - `app/Http/Controllers/Api/CityController.php`
  - `app/Http/Resources/CityResource.php`
  - `app/Http/Requests/StoreCityRequest.php`
  - `app/Http/Requests/UpdateCityRequest.php`
- **API responses**: Removed fields (`country`, `image`, `latitude`, `longitude`), added `restaurants_count`
- **Validation**: Removed field validation for non-existent columns
- **Frontend**: May need updates to handle new response structure