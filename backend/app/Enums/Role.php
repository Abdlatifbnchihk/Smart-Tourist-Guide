<?php

namespace App\Enums;

enum Role: string
{
    case Tourist = 'Tourist';
    case Driver = 'Driver';
    case HotelManager = 'Hotel Manager';
    case Administrator = 'Administrator';

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
