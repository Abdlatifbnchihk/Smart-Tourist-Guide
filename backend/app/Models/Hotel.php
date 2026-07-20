<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'city_id',
        'name',
        'address',
        'phone',
        'email',
        'description',
        'stars',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stars' => 'integer',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
