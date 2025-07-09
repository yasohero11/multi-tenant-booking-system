<?php

namespace Modules\Teams\App\Services;

use Modules\Teams\App\Models\Team;
use Modules\Availability\App\Models\TeamAvailability;

class TeamsService
{
    public function listTeams()
    {
        return response()->json(Team::with('availabilities')->get());
    }

    public function createTeam(array $data)
    {
        $team = Team::create([
            'name' => $data['name'],
        ]);
        return response()->json($team, 201);
    }

    public function setAvailability($teamId, array $data)
    {
        $validator = \Validator::make($data, [
            'availabilities' => 'required|array|min:1',
            'availabilities.*.weekday' => 'required|integer|min:0|max:6',
            'availabilities.*.start_time' => 'required|date_format:H:i',
            'availabilities.*.end_time' => 'required|date_format:H:i|after:availabilities.*.start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team = Team::findOrFail($teamId);

        $team->availabilities()->delete();

        foreach ($data['availabilities'] as $slot) {
            $team->availabilities()->create([
                'weekday' => $slot['weekday'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
            ]);
        }

        $updatedAvailabilities = $team->availabilities()->get(['weekday', 'start_time', 'end_time']);
        return response()->json([
            'message' => 'Availability updated successfully.',
            'availabilities' => $updatedAvailabilities
        ]);
    }

    public function getAvailability($teamId)
    {
        $team = Team::findOrFail($teamId);
        $availabilities = $team->availabilities()->get(['weekday', 'start_time', 'end_time']);
        return response()->json($availabilities);
    }

    public function generateSlots($teamId, $from, $to)
    {
        $team = Team::findOrFail($teamId);
        $availabilities = $team->availabilities()->get();
        $bookings = $team->bookings()->whereBetween('date', [$from, $to])->get();

        $slots = [];
        $startDate = new \DateTime($from);
        $endDate = new \DateTime($to);
        $interval = new \DateInterval('P1D');
        $period = new \DatePeriod($startDate, $interval, $endDate->modify('+1 day'));

        foreach ($period as $date) {
            $weekday = (int)$date->format('w');
            $dayAvailabilities = $availabilities->where('weekday', $weekday);
            foreach ($dayAvailabilities as $availability) {
                $slotStart = new \DateTime($date->format('Y-m-d') . ' ' . $availability->start_time);
                $slotEnd = new \DateTime($date->format('Y-m-d') . ' ' . $availability->end_time);
                while ($slotStart < $slotEnd) {
                    $nextSlot = (clone $slotStart)->modify('+1 hour');
                    if ($nextSlot > $slotEnd) break;

                    $conflict = $bookings->first(function ($booking) use ($date, $slotStart, $nextSlot) {
                        if ($booking->date !== $date->format('Y-m-d')) {
                            return false;
                        }

                        $bookingStart = new \DateTime($date->format('Y-m-d') . ' ' . $booking->start_time);
                        $bookingEnd = new \DateTime($date->format('Y-m-d') . ' ' . $booking->end_time);
                        return !($nextSlot <= $bookingStart || $slotStart >= $bookingEnd);
                    });
                    if (!$conflict) {
                        $slots[] = [
                            'date' => $date->format('Y-m-d'),
                            'start_time' => $slotStart->format('H:i'),
                            'end_time' => $nextSlot->format('H:i'),
                            'available' => true,
                        ];
                    }
                    $slotStart = $nextSlot;
                }
            }
        }
        return response()->json($slots);
    }
}
