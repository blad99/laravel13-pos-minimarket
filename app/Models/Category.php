<?php

namespace App\Models;

use App\Traits\BelongToStore;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use MongoDB\Laravel\Eloquent\Model;

#[Connection('mongodb')]
#[Fillable([
    'store_id',
    'name',
    'description'
])]

class Category extends Model
{
    // ✨ Ini adalah "Magic Filter" yang kita buat di Sprint 3!
    // Dengan 1 baris ini, Category otomatis difilter dan di-assign ke toko aktif.
    use BelongToStore;

    protected $collection = 'categories';

    /**
     * Relasi: Satu Kategori memiliki banyak Produk (akan kita buat nanti)
     */
    public function production() {
        return $this->hasMany(Product::class);
    }
}
