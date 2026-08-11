<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('city_id');
            $table->string('license_number', 20);
            $table->tinyInteger('years_of_experience')->unsigned()->nullable();
            $table->string('languages', 255)->nullable();
            $table->boolean('available')->default(true)->index();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE drivers ADD CONSTRAINT fk_drivers_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE drivers ADD CONSTRAINT fk_drivers_city_id FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE RESTRICT');
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
