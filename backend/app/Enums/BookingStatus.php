<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'Pending';
    case Confirmed = 'Confirmed';
    case InProgress = 'InProgress';
    case Cancelled = 'Cancelled';
    case Completed = 'Completed';

    /**
     * Get the label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Confirmed => 'Confirmed',
            self::InProgress => 'In Progress',
            self::Cancelled => 'Cancelled',
            self::Completed => 'Completed',
        };
    }
}
