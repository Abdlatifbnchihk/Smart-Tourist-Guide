<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Restaurant extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'city_id',
        'name',
        'description',
        'address',
        'cuisine',
        'phone',
        'price_range',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price_range' => 'integer',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
