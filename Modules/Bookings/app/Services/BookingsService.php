<?php

namespace Modules\Bookings\App\Services;

use Modules\Bookings\App\Models\Booking;
use Modules\Teams\App\Models\Team;
use Modules\Availability\App\Models\TeamAvailability;
use Illuminate\Support\Facades\Validator;

class BookingsService
{
    public function createBooking($user, array $data)
    {
        $validator = Validator::make($data, [
            'team_id' => 'required|exists:teams,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team = Team::findOrFail($data['team_id']);
        $weekday = (int)date('w', strtotime($data['date']));
        $availability = $team->availabilities()->where('weekday', $weekday)
            ->where('start_time', '<=', $data['start_time'])
            ->where('end_time', '>=', $data['end_time'])
            ->first();
        if (!$availability) {
            return response()->json(['message' => 'Requested time is outside team availability.'], 409);
        }

        // Check for booking conflicts for the team
        $conflict = $team->bookings()
            ->where('date', $data['date'])
            ->where(function ($q) use ($data) {
                $q->where(function ($q2) use ($data) {
                    $q2->where('start_time', '<', $data['end_time'])
                       ->where('end_time', '>', $data['start_time']);
                });
            })
            ->exists();
        if ($conflict) {
            return response()->json(['message' => 'This slot is already booked for the team.'], 409);
        }

        // Check for booking conflicts for the user
        $userConflict = $user->bookings()
            ->where('date', $data['date'])
            ->where(function ($q) use ($data) {
                $q->where(function ($q2) use ($data) {
                    $q2->where('start_time', '<', $data['end_time'])
                       ->where('end_time', '>', $data['start_time']);
                });
            })
            ->exists();
        if ($userConflict) {
            return response()->json(['message' => 'You already have a booking that conflicts with this slot.'], 409);
        }

        $booking = $user->bookings()->create([
            'team_id' => $team->id,
            'date' => $data['date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
        ]);

        return response()->json(['message' => 'Booking created successfully.', 'booking' => $booking], 201);
    }

    public function getUserBookings($user)
    {
        $bookings = $user->bookings()->orderBy('date', 'desc')->get();
        return response()->json($bookings);
    }
} 