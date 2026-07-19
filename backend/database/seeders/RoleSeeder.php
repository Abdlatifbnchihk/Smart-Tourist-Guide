<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Admin', 'slug' => 'admin', 'description' => 'Platform administrator with full access.'],
            ['name' => 'Tourist', 'slug' => 'tourist', 'description' => 'Standard platform visitor who books hotels and transport.'],
            ['name' => 'Hotel Owner', 'slug' => 'hotel_owner', 'description' => 'Manages hotel listings, rooms, and bookings.'],
            ['name' => 'Driver', 'slug' => 'driver', 'description' => 'Provides transport services for tourists.'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
