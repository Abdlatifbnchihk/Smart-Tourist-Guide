<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->index();
            $table->foreignId('hotel_id')->nullable()->constrained('hotels')->cascadeOnDelete()->index();
            $table->foreignId('restaurant_id')->nullable()->constrained('restaurants')->cascadeOnDelete()->index();
            $table->foreignId('attraction_id')->nullable()->constrained('attractions')->cascadeOnDelete()->index();
            $table->timestamps();

            $table->check('CHECK (hotel_id IS NOT NULL OR restaurant_id IS NOT NULL OR attraction_id IS NOT NULL)');
            $table->unique(['user_id', 'hotel_id'], 'favorites_user_hotel_unique');
            $table->unique(['user_id', 'restaurant_id'], 'favorites_user_restaurant_unique');
            $table->unique(['user_id', 'attraction_id'], 'favorites_user_attraction_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
