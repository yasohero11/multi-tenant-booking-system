<?php

namespace Modules\Bookings\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Bookings\App\Models\Booking;
use Modules\Users\App\Models\User;
use Modules\Teams\App\Models\Team;

class BookingsDatabaseSeeder extends Seeder
{
    public function run()
    {
        $teams = Team::all();
        foreach ($teams as $team) {
            $users = $team->tenant->users;
            foreach ($users as $user) {
                Booking::create([
                    'tenant_id' => $team->tenant_id,
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'date' => now()->addDays(rand(1, 10))->format('Y-m-d'),
                    'start_time' => '10:00',
                    'end_time' => '11:00',
                ]);
            }
        }
    }
}
