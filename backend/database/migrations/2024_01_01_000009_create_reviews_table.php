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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->index();
            $table->foreignId('hotel_id')->nullable()->constrained('hotels')->cascadeOnDelete()->index();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->cascadeOnDelete()->index();
            $table->foreignId('attraction_id')->nullable()->constrained('attractions')->cascadeOnDelete()->index();
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->check('CHECK (hotel_id IS NOT NULL OR driver_id IS NOT NULL OR attraction_id IS NOT NULL)');
            $table->check('CHECK (rating >= 1 AND rating <= 5)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
