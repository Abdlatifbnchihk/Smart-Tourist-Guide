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
                'country' => 'Morocco',
                'description' => 'The Red City, famed for its medina, souks, and Jemaa el-Fnaa square.',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
            ],
            [
                'name' => 'Fes',
                'region' => 'Fes-Meknes',
                'country' => 'Morocco',
                'description' => 'Cultural capital with the world\'s oldest university and a sprawling medina.',
                'latitude' => 34.0181,
                'longitude' => -5.0078,
            ],
            [
                'name' => 'Chefchaouen',
                'region' => 'Tangier-Tetouan-Al Hoceima',
                'country' => 'Morocco',
                'description' => 'The Blue Pearl, a picturesque mountain town with blue-washed buildings.',
                'latitude' => 35.1688,
                'longitude' => -5.2636,
            ],
            [
                'name' => 'Essaouira',
                'region' => 'Marrakech-Safi',
                'country' => 'Morocco',
                'description' => 'A windy coastal city with a historic medina and beautiful beaches.',
                'latitude' => 31.5085,
                'longitude' => -9.7595,
            ],
            [
                'name' => 'Rabat',
                'region' => 'Rabat-Salé-Kenitra',
                'country' => 'Morocco',
                'description' => 'The capital city with the Hassan Tower and Kasbah of the Udayas.',
                'latitude' => 34.0209,
                'longitude' => -6.8416,
            ],
            [
                'name' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'country' => 'Morocco',
                'description' => 'Economic hub with the iconic Hassan II Mosque and Art Deco architecture.',
                'latitude' => 33.5731,
                'longitude' => -7.5898,
            ],
            [
                'name' => 'Tangier',
                'region' => 'Tangier-Tetouan-Al Hoceima',
                'country' => 'Morocco',
                'description' => 'Gateway to Africa with a rich history and Mediterranean views.',
                'latitude' => 35.7595,
                'longitude' => -5.8340,
            ],
            [
                'name' => 'Agadir',
                'region' => 'Souss-Massa',
                'country' => 'Morocco',
                'description' => 'A modern beach resort city with a reconstructed kasbah.',
                'latitude' => 30.4278,
                'longitude' => -9.5981,
            ],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
