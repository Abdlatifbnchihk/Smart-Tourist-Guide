<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\Rule;

class Room extends Model
{
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'room_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'hotel_id',
        'number',
        'type',
        'capacity',
        'price_per_night',
        'available',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'capacity' => 'integer',
        'price_per_night' => 'decimal:2',
        'available' => 'boolean',
    ];

    /**
     * Get the validation rules for the model.
     *
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'hotel_id' => 'required|exists:hotels,hotel_id',
            'number' => 'required|string|max:20',
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => ['required', 'numeric', Rule::gt(0)],
            'available' => 'boolean',
        ];
    }

    /**
     * Get the hotel that owns the room.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Get the bookings for the room.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
