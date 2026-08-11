<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->bigIncrements('room_id');
            $table->unsignedBigInteger('hotel_id');
            $table->string('number', 20);
            $table->string('type', 50);
            $table->integer('capacity');
            $table->decimal('price_per_night', 10, 2)->index();
            $table->boolean('available')->default(true);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE rooms ADD CONSTRAINT fk_rooms_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
