<?php

namespace App\Enums;

/**
 * Token abilities for role-based access control.
 * 
 * Each role has specific abilities that can be assigned to API tokens.
 */
enum TokenAbility: string
{
    // Tourist abilities
    case VIEW_ATTRACTIONS = 'view-attractions';
    case VIEW_HOTELS = 'view-hotels';
    case BOOK_HOTELS = 'book-hotels';
    case BOOK_TRANSPORT = 'book-transport';
    case VIEW_BOOKINGS = 'view-bookings';
    case CANCEL_BOOKINGS = 'cancel-bookings';
    case WRITE_REVIEWS = 'write-reviews';
    case MANAGE_FAVORITES = 'manage-favorites';
    case VIEW_PROFILE = 'view-profile';
    case EDIT_PROFILE = 'edit-profile';

    // Driver abilities
    case MANAGE_VEHICLE = 'manage-vehicle';
    case VIEW_TRANSPORT_BOOKINGS = 'view-transport-bookings';
    case UPDATE_BOOKING_STATUS = 'update-booking-status';
    case VIEW_EARNINGS = 'earnings';

    // Hotel Manager abilities
    case MANAGE_HOTEL = 'manage-hotel';
    case MANAGE_ROOMS = 'manage-rooms';
    case VIEW_HOTEL_BOOKINGS = 'view-hotel-bookings';
    case MANAGE_HOTEL_BOOKINGS = 'manage-hotel-bookings';

    // Administrator abilities
    case MANAGE_USERS = 'manage-users';
    case APPROVE_USERS = 'approve-users';
    case SUSPEND_USERS = 'suspend-users';
    case MANAGE_ALL_BOOKINGS = 'manage-all-bookings';
    case VIEW_ANALYTICS = 'view-analytics';
    case MANAGE_SYSTEM = 'manage-system';

    /**
     * Get all abilities for a specific role.
     */
    public static function forRole(string $role): array
    {
        return match ($role) {
            'Tourist' => [
                self::VIEW_ATTRACTIONS,
                self::VIEW_HOTELS,
                self::BOOK_HOTELS,
                self::BOOK_TRANSPORT,
                self::VIEW_BOOKINGS,
                self::CANCEL_BOOKINGS,
                self::WRITE_REVIEWS,
                self::MANAGE_FAVORITES,
                self::VIEW_PROFILE,
                self::EDIT_PROFILE,
            ],
            'Driver' => [
                self::MANAGE_VEHICLE,
                self::VIEW_TRANSPORT_BOOKINGS,
                self::UPDATE_BOOKING_STATUS,
                self::VIEW_EARNINGS,
                self::VIEW_PROFILE,
                self::EDIT_PROFILE,
            ],
            'Hotel Manager' => [
                self::MANAGE_HOTEL,
                self::MANAGE_ROOMS,
                self::VIEW_HOTEL_BOOKINGS,
                self::MANAGE_HOTEL_BOOKINGS,
                self::VIEW_PROFILE,
                self::EDIT_PROFILE,
            ],
            'Administrator' => [
                self::MANAGE_USERS,
                self::APPROVE_USERS,
                self::SUSPEND_USERS,
                self::MANAGE_ALL_BOOKINGS,
                self::VIEW_ANALYTICS,
                self::MANAGE_SYSTEM,
                self::VIEW_PROFILE,
                self::EDIT_PROFILE,
            ],
            default => [],
        };
    }

    /**
     * Get all available abilities as an array of strings.
     */
    public static function all(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
