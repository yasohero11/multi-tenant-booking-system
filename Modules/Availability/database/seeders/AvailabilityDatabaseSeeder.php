<?php

namespace Modules\Availability\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Teams\App\Models\Team;
use Modules\Availability\App\Models\TeamAvailability;

class AvailabilityDatabaseSeeder extends Seeder
{
    public function run()
    {
        $teams = Team::all();
        foreach ($teams as $team) {
            foreach (range(1, 5) as $weekday) {
                TeamAvailability::create([
                    'tenant_id' => $team->tenant_id,
                    'team_id' => $team->id,
                    'weekday' => $weekday,
                    'start_time' => '09:00',
                    'end_time' => '17:00',
                ]);
            }
        }
    }
}
