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
        Schema::create('rooms', function (Blueprint $table) {
            $table->bigIncrements('room_id');
            $table->foreignId('hotel_id')->constrained('hotels', 'hotel_id')->cascadeOnDelete()->index();
            $table->string('number', 20);
            $table->string('type', 50);
            $table->integer('capacity');
            $table->decimal('price_per_night', 10, 2)->index();
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
