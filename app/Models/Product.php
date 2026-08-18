<?php

namespace App\Models;

use App\Traits\BelongToStore;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use MongoDB\Laravel\Eloquent\Model as MongoModel;

#[Connection('mongodb')]
#[Fillable([
    'store_id',
    'category_id',
    'barcode',
    'name',
    'description',
    'cost_price',
    'selling_price',
    'stock',
    'is_active'
])]

class Product extends MongoModel
{
    // Filter otomatis berdasar toko aktif!
    use BelongToStore;

    protected $collection = 'products';

    /**
     * Konversi tipe data otomatis (Casting).
     * Sangat penting untuk harga dan stok agar selalu berupa angka (bukan string).
     */
    protected function casts(): array
    {
        return [
            'cost_price'    => 'float',
            'selling_price' => 'float',
            'stock'         => 'integer',
            'is_active'     => 'boolean'
        ];
    }

    /**
     * Relasi: Produk ini milik Kategori apa?
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
