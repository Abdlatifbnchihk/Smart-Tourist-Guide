<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            [
                'name' => 'Marrakech',
                'region' => 'Marrakech-Safi',
                'description' => 'The Red City, famed for its medina, souks, and Jemaa el-Fnaa square.',
            ],
            [
                'name' => 'Fes',
                'region' => 'Fes-Meknes',
                'description' => 'Cultural capital with the world\'s oldest university and a sprawling medina.',
            ],
            [
                'name' => 'Chefchaouen',
                'region' => 'Tangier-Tetouan-Al Hoceima',
                'description' => 'The Blue Pearl, a picturesque mountain town with blue-washed buildings.',
            ],
            [
                'name' => 'Essaouira',
                'region' => 'Marrakech-Safi',
                'description' => 'A windy coastal city with a historic medina and beautiful beaches.',
            ],
            [
                'name' => 'Rabat',
                'region' => 'Rabat-Salé-Kenitra',
                'description' => 'The capital city with the Hassan Tower and Kasbah of the Udayas.',
            ],
            [
                'name' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'description' => 'Economic hub with the iconic Hassan II Mosque and Art Deco architecture.',
            ],
            [
                'name' => 'Tangier',
                'region' => 'Tangier-Tetouan-Al Hoceima',
                'description' => 'Gateway to Africa with a rich history and Mediterranean views.',
            ],
            [
                'name' => 'Agadir',
                'region' => 'Souss-Massa',
                'description' => 'A modern beach resort city with a reconstructed kasbah.',
            ],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
