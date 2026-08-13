<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->createUsersIndexes();
        $this->createStoresIndexes();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mongodb')->table('users', function (Blueprint $collection) {
            $collection->dropIndex('username_1');
            $collection->dropIndex('email_1');
        });

        Schema::connection('mongodb')->table('stores', function (Blueprint $collection) {
            $collection->dropIndex('owner_id_1');
        });
    }

    /**
     * Memisahkan logic index untuk koleksi users (Clean Code: Single Responsibility)
     */
    private function createUsersIndexes(): void
    {
        Schema::connection('mongodb')->table('users', function(Blueprint $collection) {
            // Membuat pencarian username dan email sangat cepat, dan memastikan tidak ada duplikat (unique)
            $collection->unique('username');
            $collection->unique('email');
        });
    }

    
    /**
     * Memisahkan logic index untuk koleksi stores
     */
    private function createStoresIndexes(): void
    {
        Schema::connection('mongodb')->table('stores', function(Blueprint $collection) {
            // Pencarian toko berdasarkan owner_id akan menjadi super cepat
            $collection->index('owner_id');
        });
    }
};
