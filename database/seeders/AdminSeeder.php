<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $existingAdmin = User::where('username', 'admin')->first();

        if($existingAdmin) {
            $this->command->info('Admin user already exists, skipping...');
            return;
        }

        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@pos.com',
            'password' => 'admin123',
            'role' => 'admin',
            'is_active' => true,
            'assigned_store_ids' => [],
            'current_store_id' => null,
        ]);

        $this->command->info("Admin user created successfully!");
        $this->command->info("Username: admin");
        $this->command->info("Password: password");
    }
}
