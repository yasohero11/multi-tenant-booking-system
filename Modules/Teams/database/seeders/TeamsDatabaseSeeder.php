<?php

namespace Modules\Teams\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Teams\App\Models\Team;
use Modules\Tenants\App\Models\Tenant;

class TeamsDatabaseSeeder extends Seeder
{
    public function run()
    {
        $tenants = Tenant::all();
        foreach ($tenants as $tenant) {
            Team::factory()->count(2)->create([
                'tenant_id' => $tenant->id,
            ]);
        }
    }
}
