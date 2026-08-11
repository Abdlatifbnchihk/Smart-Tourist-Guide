<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('city_id');
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('address', 255)->nullable();
            $table->string('cuisine', 100);
            $table->string('phone', 20)->nullable();
            $table->tinyInteger('price_range')->unsigned()->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE restaurants ADD CONSTRAINT fk_restaurants_city_id FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE RESTRICT');
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
