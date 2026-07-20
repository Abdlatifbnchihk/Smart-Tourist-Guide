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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            $table->foreignId('driver_id')->constrained('drivers', 'driver_id')->cascadeOnDelete()->index();
            $table->string('brand', 100);
            $table->string('model', 100);
            $table->string('type', 50);
            $table->unsignedTinyInteger('seats');
            $table->string('registration_number', 50)->unique();
            $table->boolean('air_conditioning')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
