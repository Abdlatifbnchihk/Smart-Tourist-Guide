<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'tourist'");
        }

        DB::table('users')->where('role', 'Tourist')->update(['role' => 'tourist']);
        DB::table('users')->where('role', 'Driver')->update(['role' => 'driver']);
        DB::table('users')->where('role', 'Hotel Manager')->update(['role' => 'hotel_manager']);
        DB::table('users')->where('role', 'Administrator')->update(['role' => 'administrator']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('tourist', 'driver', 'hotel_manager', 'administrator') NOT NULL DEFAULT 'tourist'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'Tourist'");
        }

        DB::table('users')->where('role', 'tourist')->update(['role' => 'Tourist']);
        DB::table('users')->where('role', 'driver')->update(['role' => 'Driver']);
        DB::table('users')->where('role', 'hotel_manager')->update(['role' => 'Hotel Manager']);
        DB::table('users')->where('role', 'administrator')->update(['role' => 'Administrator']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('Tourist', 'Driver', 'Hotel Manager', 'Administrator') NOT NULL DEFAULT 'Tourist'");
        }
    }
};
