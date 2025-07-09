<?php

namespace Modules\Users\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Users\App\Models\User;
use Modules\Tenants\App\Models\Tenant;
use Illuminate\Support\Facades\Hash;

class UsersDatabaseSeeder extends Seeder
{
    public function run()
    {
        $tenants = Tenant::all();
        foreach ($tenants as $tenant) {
            User::factory()->count(3)->create([
                'tenant_id' => $tenant->id,
                'password' => Hash::make('12345678'),
            ]);
        }
    }
}
