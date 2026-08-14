<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use MongoDB\Laravel\Eloquent\Model;

#[Connection("mongodb")]
#[Fillable(
    "name",
    "address",
    "phone",
    "logo_path",
    "tax_rate",
    "receipt_prefix",
    "active_payment_methods",
    "is_active",
    "owner_id", //ID admin pemilik toko
)]

class Store extends Model
{
    protected $collection = 'stores';

    protected function casts(): array
    {
        return [
            'tax_rate' => 'float',
            'is_active' => 'boolean',
            'active_payment_methods' => 'array',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
