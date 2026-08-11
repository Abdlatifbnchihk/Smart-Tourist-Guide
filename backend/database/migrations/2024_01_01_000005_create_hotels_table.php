<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('city_id');
            $table->string('name', 150);
            $table->string('address', 255);
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->text('description')->nullable();
            $table->tinyInteger('stars')->unsigned()->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE hotels ADD CONSTRAINT fk_hotels_city_id FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE RESTRICT');
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
