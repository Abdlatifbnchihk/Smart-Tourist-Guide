<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained('cities')->restrictOnDelete();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('address', 255)->nullable();
            $table->string('cuisine', 100);
            $table->string('phone', 20)->nullable();
            $table->tinyInteger('price_range')->unsigned()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
