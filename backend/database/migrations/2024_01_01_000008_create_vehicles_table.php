<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            $table->unsignedBigInteger('driver_id');
            $table->string('brand', 100);
            $table->string('model', 100);
            $table->string('type', 50);
            $table->unsignedTinyInteger('seats');
            $table->string('registration_number', 50)->unique();
            $table->boolean('air_conditioning')->default(false);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_driver_id FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
