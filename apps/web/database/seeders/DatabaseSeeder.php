<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users first
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@govdo.local',
        ]);

        User::factory()->create([
            'name' => 'Mike Rodriguez',
            'email' => 'mike@govdo.local',
        ]);

        // Seed tasks after users exist
        $this->call([
            TaskSeeder::class,
        ]);
    }
}
