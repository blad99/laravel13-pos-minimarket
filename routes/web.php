<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'ensureHasStore'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Switch toko
    Route::post('stores/{storeId}/switch', [StoreController::class, 'switchStore'])->name('stores.switch');

    Route::middleware(['role:admin'])->group(function() {
        Route::resource('stores', StoreController::class)->only('index', 'create', 'store');
        Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('products', ProductController::class)->except([ 'create', 'show', 'edit']);
    });
});

require __DIR__.'/settings.php';
