## Why

Users need to bookmark favorite attractions and hotels for quick access. Currently there's no way to save preferred items, forcing users to search repeatedly. This improves user engagement and personalization.

## What Changes

- Create FavoriteController with index, toggle, and destroy endpoints
- Create FavoriteResource for API responses
- Add Favorite model with morphTo relationships
- Add unique constraint to prevent duplicate favorites
- Toggle behavior: POST adds if not exists, removes if exists

## Capabilities

### New Capabilities

- `favorite-management`: Favorite/bookmark CRUD with toggle behavior and type filtering

### Modified Capabilities

(none)

## Impact

- New files: `app/Http/Controllers/Api/V1/FavoriteController.php`, `app/Http/Resources/FavoriteResource.php`, `app/Models/Favorite.php`
- New migration for favorites table
- New routes in `api.php`
- New tests: `tests/Feature/Api/V1/FavoriteControllerTest.php`
