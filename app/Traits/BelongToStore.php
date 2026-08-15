<?php

namespace App\Traits;

use App\Models\Store;
use Illuminate\Database\Eloquent\Builder;

trait BelongToStore
{
    /**
     * "boot" function akan otomatis dijalankan oleh Laravel
     * saat model (yang menggunakan trait ini) pertama kali dipanggil.
     */
    protected static function bootBelongToStore(): void
    {
        // 1. GLOBAL SCOPE: Otomatis mem-filter data yang dibaca berdasarkan toko yang aktif di Session
        static::addGlobalScope('store', function(Builder $builder) {
            $currentStoreId = session('current_store_id');

            // Filter hanya berlaku jika user sedang login dan punya current_store_id
            if($currentStoreId) {
                $builder->where('store_id', $currentStoreId);
            }
        });

        // 2. MODEL EVENT: Otomatis mengisi kolom 'store_id' saat data baru di-save/di-insert
        static::creating(function ($model) {
            $currentStoreId = session('current_store_id');

            if($currentStoreId && empty($model->store_id)){
                $model->store_id = $currentStoreId;
            }
        });
    }

    /**
     * Relasi ke model Store
     * Menandakan bahwa setiap data (produk/kategori/transaksi) itu adalah milik 1 toko.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
