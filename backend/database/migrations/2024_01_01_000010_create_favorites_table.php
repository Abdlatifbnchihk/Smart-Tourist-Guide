<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('hotel_id')->nullable();
            $table->unsignedBigInteger('restaurant_id')->nullable();
            $table->unsignedBigInteger('attraction_id')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'hotel_id'], 'favorites_user_hotel_unique');
            $table->unique(['user_id', 'restaurant_id'], 'favorites_user_restaurant_unique');
            $table->unique(['user_id', 'attraction_id'], 'favorites_user_attraction_unique');
        });

        DB::statement('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_attraction_id FOREIGN KEY (attraction_id) REFERENCES attractions (id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
