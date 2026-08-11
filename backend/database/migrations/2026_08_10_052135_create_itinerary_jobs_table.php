<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itinerary_jobs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->json('request_data');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->json('result')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE itinerary_jobs ADD CONSTRAINT fk_itinerary_jobs_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::dropIfExists('itinerary_jobs');
    }
};
