<?php

use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'ensureHasStore'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Switch toko
    Route::post('stores/{storeId}/switch', [StoreController::class, 'switchStore'])->name('stores.switch');

    Route::middleware(['role:admin'])->group(function() {
        Route::resource('stores', StoreController::class)->only('index', 'create', 'store');
    });
});

require __DIR__.'/settings.php';
