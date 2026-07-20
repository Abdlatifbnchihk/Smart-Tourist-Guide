<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'region',
        'description',
    ];

    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }

    public function restaurants(): HasMany
    {
        return $this->hasMany(Restaurant::class);
    }

    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class);
    }

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }
}
