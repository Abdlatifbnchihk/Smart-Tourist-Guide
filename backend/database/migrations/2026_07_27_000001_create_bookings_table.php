<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('room_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->string('booking_number', 50)->unique();
            $table->string('booking_type', 50);
            $table->date('booking_date');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_price', 10, 2)->default(0);
            $table->string('status', 20)->default('Pending');
            $table->timestamps();
        });

        DB::statement('ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE bookings ADD CONSTRAINT fk_bookings_room_id FOREIGN KEY (room_id) REFERENCES rooms (room_id) ON DELETE SET NULL');
        DB::statement('ALTER TABLE bookings ADD CONSTRAINT fk_bookings_driver_id FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE SET NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
