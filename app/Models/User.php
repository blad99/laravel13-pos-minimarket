<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use MongoDB\Laravel\Auth\User as MongoUser;


#[Connection("mongodb")]
#[Fillable([
    'name',
    'username',
    'email',
    'password',
    'role',
    'assigned_store_ids',
    'current_store_id',
    'is_active',
])]
#[Hidden([
    'password',
    'remember_token'
])]


class User extends MongoUser
{
    protected $collection = "users";

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'assigned_store_ids' => 'array'
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCashier(): bool
    {
        return $this->role === 'cashier';
    }

    public function ownedStores()
    {
        return $this->hasMany(store::class, 'owner_id');
    }

    public function hasAccessToStore(string $storeId): bool
    {
        if($this->isAdmin()) return true;

        return in_array($storeId, $this->assigned_store_ids ?? []);
    }
}