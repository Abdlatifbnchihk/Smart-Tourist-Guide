<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItineraryJob extends Model
{
    protected $fillable = [
        'user_id',
        'request_data',
        'status',
        'result',
        'error',
    ];

    protected $casts = [
        'request_data' => 'array',
        'result' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
