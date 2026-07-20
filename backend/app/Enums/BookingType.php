<?php

namespace App\Enums;

enum BookingType: string
{
    case Hotel = 'Hotel';
    case HotelWithDriver = 'Hotel + Driver';
    case AirportTransfer = 'Airport Transfer';

    /**
     * Get the label for the booking type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Hotel => 'Hotel',
            self::HotelWithDriver => 'Hotel + Driver',
            self::AirportTransfer => 'Airport Transfer',
        };
    }
}
