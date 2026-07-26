<?php

namespace App\Enums;

enum Role: string
{
    case Tourist = 'tourist';
    case Driver = 'driver';
    case HotelManager = 'hotel_manager';
    case Administrator = 'administrator';

    /**
     * Get the label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Tourist => 'Tourist',
            self::Driver => 'Driver',
            self::HotelManager => 'Hotel Manager',
            self::Administrator => 'Administrator',
        };
    }
}
