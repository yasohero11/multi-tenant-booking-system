<?php

namespace Database\Seeders;

use Modules\Teams\app\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            \Modules\Tenants\Database\Seeders\TenantsDatabaseSeeder::class,
            \Modules\Users\Database\Seeders\UsersDatabaseSeeder::class,
            \Modules\Teams\Database\Seeders\TeamsDatabaseSeeder::class,
            \Modules\Availability\Database\Seeders\AvailabilityDatabaseSeeder::class,
            \Modules\Bookings\Database\Seeders\BookingsDatabaseSeeder::class,
        ]);
    }
}
