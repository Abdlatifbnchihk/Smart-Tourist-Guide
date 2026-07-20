<?php

namespace App\Enums;

enum UserStatus: string
{
    case Pending = 'Pending';
    case Approved = 'Approved';
    case Rejected = 'Rejected';
    case Suspended = 'Suspended';

    /**
     * Get the label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
            self::Suspended => 'Suspended',
        };
    }
}
