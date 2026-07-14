# 🧑‍💻 Coding Standards — Smart Tourist Guide Morocco

## General Principles

- **Readability over cleverness.** Code is read far more often than written.
- **Single Responsibility.** Controllers orchestrate; Services/Actions hold business logic; Models represent data + relationships only.
- **Fail fast, validate early.** All external input is validated via Form Requests before reaching business logic.
- **Consistent naming.** English, descriptive, no abbreviations unless industry-standard (`id`, `url`, `api`).

---

## Backend (Laravel / PHP)

### Standards
- Follow **PSR-12** coding style (enforced via `Laravel Pint`).
- Strict types where practical: `declare(strict_types=1);` in new service/action classes.
- Use **Form Requests** for all validation — never validate inline in controllers.
- Use **API Resources** (`JsonResource`) for all API responses.
- Use **Enums** (PHP 8.1+ backed enums) for fixed value sets like `status`, `payment_status`.

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Class | PascalCase | `HotelBookingService` |
| Method/variable | camelCase | `calculateTotalPrice()` |
| Database table | snake_case, plural | `hotel_bookings` |
| Database column | snake_case | `check_in` |
| Route | kebab-case | `/hotel-bookings` |
| Config key | snake_case | `booking.max_guests` |
| Migration file | timestamped, descriptive | `2026_01_10_000000_create_hotel_bookings_table.php` |

### Folder Conventions

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Services/
├── Actions/
├── Enums/
├── Policies/
└── Providers/
```

### Example — Service Pattern

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\HotelBooking;
use App\Models\Room;
use Illuminate\Support\Carbon;

class HotelBookingService
{
    public function create(array $data): HotelBooking
    {
        $room = Room::findOrFail($data['room_id']);

        $nights = Carbon::parse($data['check_in'])
            ->diffInDays(Carbon::parse($data['check_out']));

        return HotelBooking::create([
            ...$data,
            'total_price' => $room->price_per_night * $nights,
            'status' => 'pending',
        ]);
    }
}
```

### Testing
- **Feature tests** for every API endpoint (happy path + validation failure + auth failure).
- **Unit tests** for service/action classes with business logic.
- Use Laravel's `RefreshDatabase` trait; never test against a shared dev database.
- Target minimum **80% coverage** on `app/Services` and `app/Actions`.

### Static Analysis & Linting
```bash
./vendor/bin/pint          # Auto-format per PSR-12
./vendor/bin/phpstan analyse # Static analysis (level 6+)
php artisan test            # Run test suite
```

---

## Frontend (React / TypeScript)

### Standards
- **TypeScript strict mode** enabled (`"strict": true` in `tsconfig.json`).
- Functional components + hooks only — no class components.
- Co-locate component-specific styles/tests next to the component.
- State management: local state via hooks, server state via **TanStack Query** (React Query).

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component file | PascalCase | `HotelCard.tsx` |
| Hook | camelCase, `use` prefix | `useHotelBookings.ts` |
| Utility function | camelCase | `formatCurrency.ts` |
| Type/Interface | PascalCase | `interface HotelBooking { ... }` |
| CSS class (Tailwind) | utility-first, no custom classes unless necessary | `className="flex items-center gap-2"` |

### Folder Conventions

```
src/
├── components/     # Reusable, dumb UI components
├── pages/          # Route-level components
├── hooks/          # Custom React hooks
├── services/       # API client functions (axios/fetch wrappers)
├── types/          # Shared TypeScript types/interfaces
├── utils/          # Pure helper functions
└── context/        # React context providers
```

### Example — Service + Hook Pattern

```ts
// services/hotelBookingService.ts
export async function createHotelBooking(payload: CreateBookingPayload) {
  const { data } = await apiClient.post<HotelBooking>('/hotel-bookings', payload);
  return data;
}

// hooks/useCreateHotelBooking.ts
export function useCreateHotelBooking() {
  return useMutation({
    mutationFn: createHotelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] }),
  });
}
```

### Linting & Formatting
```bash
npm run lint        # ESLint
npm run format       # Prettier
npm run type-check   # tsc --noEmit
npm run test         # Vitest / React Testing Library
```

---

## Database Conventions

- Every table has `id`, `created_at`, `updated_at` (see `docs/database.md`).
- Foreign keys are always indexed.
- Migrations must include a working `down()` method.
- Use `decimal` (never `float`) for currency fields.
- Enum-like columns should use PHP backed enums cast on the model rather than raw strings.

---

## API Design Conventions

- All endpoints are versioned under `/api/v1`.
- Responses always wrapped in a `data` key (and `meta`/`links` for paginated collections).
- Use plural, kebab-case resource names (`/hotel-bookings`, not `/hotelBooking`).
- Use proper HTTP status codes (`201` for creation, `204` for deletion, `422` for validation errors).

---

## Commit & PR Standards

See [`docs/git-workflow.md`](./git-workflow.md) for Conventional Commits and PR review checklist.