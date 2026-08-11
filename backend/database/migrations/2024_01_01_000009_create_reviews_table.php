<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('hotel_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('attraction_id')->nullable();
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('hotel_id');
            $table->index('driver_id');
            $table->index('attraction_id');
        });

        DB::statement('ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT fk_reviews_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT fk_reviews_driver_id FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT fk_reviews_attraction_id FOREIGN KEY (attraction_id) REFERENCES attractions (id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
