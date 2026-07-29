<?php

namespace Tests\Unit\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use App\Services\HotelBookingService;
use Carbon\Carbon;
use DomainException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\TestCase;

class HotelBookingServiceTest extends TestCase
{
    use RefreshDatabase;

    private HotelBookingService $service;

    private int $userId;

    private int $roomId;

    protected function setUp(): void
    {
        parent::setUp();
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared('PRAGMA foreign_keys = OFF');
        }
        $this->service = new HotelBookingService;

        // Create user directly
        $this->userId = DB::table('users')->insertGetId([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create city
        $cityId = DB::table('cities')->insertGetId([
            'name' => 'Test City',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create hotel
        $hotelId = DB::table('hotels')->insertGetId([
            'name' => 'Test Hotel',
            'address' => '123 Test St',
            'city_id' => $cityId,
            'created_by' => $this->userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create room
        $this->roomId = DB::table('rooms')->insertGetId([
            'hotel_id' => $hotelId,
            'number' => '101',
            'type' => 'Single',
            'capacity' => 2,
            'price_per_night' => 100,
            'quantity_available' => 2,
            'available' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_create_booking_when_room_is_available(): void
    {
        $data = [
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
        ];

        $booking = $this->service->create($data);

        $this->assertInstanceOf(Booking::class, $booking);
        $this->assertEquals(BookingStatus::Pending, $booking->status);
        $this->assertEquals($this->roomId, $booking->room_id);
    }

    public function test_create_booking_when_room_is_unavailable(): void
    {
        DB::table('bookings')->insert([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK123',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(5)->toDateString(),
            'total_price' => 500,
            'status' => 'Confirmed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('bookings')->insert([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK124',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->addDays(1)->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(4)->toDateString(),
            'total_price' => 300,
            'status' => 'Confirmed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Room is not available for the selected dates');

        $this->service->create([
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->addDays(2)->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
        ]);
    }

    public function test_price_computed_correctly(): void
    {
        $data = [
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
        ];

        $booking = $this->service->create($data);

        $this->assertEquals(300, $booking->total_price);
    }

    public function test_client_provided_total_price_is_ignored(): void
    {
        $data = [
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 999,
        ];

        $booking = $this->service->create($data);

        $this->assertEquals(300, $booking->total_price);
    }

    public function test_rejects_end_date_before_start_date(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('End date must be after start date');

        $this->service->create([
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'end_date' => Carbon::tomorrow()->toDateString(),
        ]);
    }

    public function test_rejects_same_day_booking(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('End date must be after start date');

        $this->service->create([
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->toDateString(),
        ]);
    }

    public function test_confirm_pending_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK001',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);
        $result = $this->service->confirm($booking);

        $this->assertEquals(BookingStatus::Confirmed, $result->status);
    }

    public function test_complete_confirmed_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK002',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Confirmed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);
        $result = $this->service->complete($booking);

        $this->assertEquals(BookingStatus::Completed, $result->status);
    }

    public function test_cancel_pending_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK003',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);
        $result = $this->service->cancel($booking);

        $this->assertEquals(BookingStatus::Cancelled, $result->status);
    }

    public function test_cancel_confirmed_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK004',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Confirmed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);
        $result = $this->service->cancel($booking);

        $this->assertEquals(BookingStatus::Cancelled, $result->status);
    }

    public function test_cannot_confirm_completed_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK005',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Cannot transition from Completed to Confirmed');

        $this->service->confirm($booking);
    }

    public function test_cannot_cancel_completed_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK006',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Cannot transition from Completed to Cancelled');

        $this->service->cancel($booking);
    }

    public function test_cannot_transition_cancelled_booking(): void
    {
        $bookingId = DB::table('bookings')->insertGetId([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK007',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
            'total_price' => 300,
            'status' => 'Cancelled',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $booking = Booking::find($bookingId);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Cannot transition from Cancelled');

        $this->service->confirm($booking);
    }

    public function test_overlapping_bookings_rejected_at_capacity(): void
    {
        Booking::create([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK100',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(5)->toDateString(),
            'total_price' => 500,
            'status' => BookingStatus::Confirmed,
        ]);
        Booking::create([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK101',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => Carbon::tomorrow()->addDays(1)->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(4)->toDateString(),
            'total_price' => 300,
            'status' => BookingStatus::Pending,
        ]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Room is not available for the selected dates');

        $this->service->create([
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => Carbon::tomorrow()->addDays(2)->toDateString(),
            'end_date' => Carbon::tomorrow()->addDays(3)->toDateString(),
        ]);
    }

    public function test_boundary_dates_not_overlapping(): void
    {
        Booking::create([
            'room_id' => $this->roomId,
            'user_id' => $this->userId,
            'booking_number' => 'BK200',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-03',
            'total_price' => 200,
            'status' => BookingStatus::Confirmed,
        ]);

        $booking = $this->service->create([
            'user_id' => $this->userId,
            'room_id' => $this->roomId,
            'start_date' => '2026-08-03',
            'end_date' => '2026-08-05',
        ]);

        $this->assertInstanceOf(Booking::class, $booking);
    }
}
