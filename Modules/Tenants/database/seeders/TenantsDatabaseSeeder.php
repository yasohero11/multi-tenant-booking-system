<?php

namespace Modules\Tenants\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Tenants\App\Models\Tenant;

class TenantsDatabaseSeeder extends Seeder
{
    public function run()
    {
        Tenant::factory()->count(3)->create();
    }
}
