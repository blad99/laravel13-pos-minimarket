<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Early return (Clean code): Jika admin sudah ada, hentikan proses untuk mencegah duplikasi.
        if ($this->adminAlreadyExists()) {
            $this->command->info('Admin user already exists, skipping seeding...');
            return;
        }

        $admin = $this->createAdminUser();
        $cashier = $this->createCashierUser();
        $store = $this->createDefaultStore($admin->id);
        
        $this->assignStoreToAdmin($admin, $store->id);
        $this->assignStoreToCashier($cashier, $store->id);
        $this->displaySuccessMessage();
    }

    private function adminAlreadyExists(): bool
    {
        return User::where('username', 'admin')->exists();
    }

    private function createAdminUser(): User
    {
        return User::create([
            'name' => 'Admin Super',
            'username' => 'admin',
            'email' => 'admin@pos.com',
            'password' => 'admin123',
            'role' => 'admin',
            'is_active' => true,
            'assigned_store_ids' => [],
            'current_store_id' => null,
        ]);
    }

    private function createCashierUser(): User
    {
        return User::create([
            'name' => 'Cashier',
            'username' => 'kasir',
            'email' => 'cashier@pos.com',
            'password' => 'kasir123',
            'role' => 'cashier',
            'is_active' => true,
            'assigned_store_ids' => [],
            'current_store_id' => null,
        ]);
    }

    private function createDefaultStore(string $ownerId): Store
    {
        return Store::create([
            'name' => 'MiniMart Pusat',
            'address' => 'Jl. Merdeka No. 123, Bandung',
            'phone' => '021-98765432',
            'tax_rate' => 11.0,
            'receipt_prefix' => 'BDG',
            'active_payment_methods' => ['cash', 'qris', 'transfer'],
            'is_active' => true,
            'owner_id' => $ownerId,
        ]);
    }

    private function assignStoreToAdmin(User $admin, string $storeId): void
    {
        // Memberikan akses toko tersebut ke si admin, dan menjadikannya toko yang sedang aktif (current)
        $admin->update([
            'assigned_store_ids' => [$storeId],
            'current_store_id' => $storeId,
        ]);
    }

    private function assignStoreToCashier(User $cashier, string $storeId): void
    {
        // Memberikan akses toko tersebut ke si kasir, dan menjadikannya toko yang sedang aktif (current)
        $cashier->update([
            'assigned_store_ids' => [$storeId],
            'current_store_id' => $storeId,
        ]);
    }

    private function displaySuccessMessage(): void
    {
        $this->command->info('✅ Default Admin & Store created successfully!');
    }
}
