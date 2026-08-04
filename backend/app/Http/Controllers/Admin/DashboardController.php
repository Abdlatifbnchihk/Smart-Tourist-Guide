<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\City;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalCities = City::count();
        $totalHotels = Hotel::count();
        $totalBookings = Booking::count();

        $averageRating = Hotel::whereNotNull('average_rating')->avg('average_rating') ?? 0;

        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ]);

        $recentBookings = Booking::with(['user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                $hotelName = 'N/A';
                if ($booking->room_id && $booking->room && $booking->room->hotel) {
                    $hotelName = $booking->room->hotel->name;
                }

                return [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number,
                    'tourist_name' => $booking->user->first_name . ' ' . $booking->user->last_name,
                    'hotel_name' => $hotelName,
                    'start_date' => $booking->start_date,
                    'end_date' => $booking->end_date,
                    'status' => $booking->status,
                    'total_price' => $booking->total_price,
                ];
            });

        return response()->json([
            'data' => [
                'total_users' => $totalUsers,
                'total_cities' => $totalCities,
                'total_hotels' => $totalHotels,
                'total_bookings' => $totalBookings,
                'average_rating' => round($averageRating, 1),
                'recent_users' => $recentUsers,
                'recent_bookings' => $recentBookings,
            ],
        ]);
    }
}
