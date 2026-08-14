<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    /**
     * Menampilkan daftar toko yang dimiliki oleh admin yang sedang login.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        // Mengambil semua toko di mana owner_id adala ID admin yang login
        $stores = Store::where('owner_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Stores/Index', [
            'stores' => $stores
        ]);
    }

    
    /**
     * Menyimpan toko baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        // validasi input
        $validated = $this->validatestoreData($request);

        /** @var User $user */
        $user = Auth::user();

        // Tambahkan ID pembuat sebagai owner
        $validated['owner_id'] = $user->id;
        $validated['is_active'] = true;

        $newStore = Store::create($validated);

        // Daftarkan toko baru ke akses admin tersebut
        $this->assignNewStoreToUser($user, $newStore->id);

        return redirect()->back()->with('success', 'Toko berhasil ditambahkan.');
    }

    /**
     * Fitur untuk berpindah (switch) toko aktif di sesi (session) pengguna.
     */
    public function switchStore(Request $request, string $storeId): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if(!$this->canUserAccessStore($user, $storeId)){
            abort(403, 'Akses ditolak: Anda tidak terdaftar di toko ini.');
        }

        // Simpan toko aktif ke database dan ke sesi Laravel
        $this->setActiveStore($user, $storeId);

        return redirect()->back()->with('success', 'berhasil beralih toko');
    }

    // --- Private Helper Methods (Clean Code) ---

    private function validateStoreData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'receipt_prefix' => ['required', 'string', 'max:5'],
            'active_payment_methods' => ['required', 'array', 'min:1'],
            'active_payment_methods.*' => ['in:cash,qris,transfer'],
        ]);
    }

    private function assignNewStoreToUser(User $user, string $storeId): void
    {
        $assignedStores = $user->assigned_store_ids ?? [];
        $assignedStores[] = $storeId;

        $user->update([
            'assigned_store_ids' => array_unique($assignedStores),
            // Jika ini toko pertamanya, otomatis jadikan toko aktif
            'current_store_id' => $user->current_store_id ?? $storeId,
        ]);
    }

    private function canUserAccessStore(User $user, string $storeId): bool
    {
        return $user->hasAccessToStore($storeId);
    }

    private function setActiveStore(User $user, string $storeId): void
    {
        $user->update(['current_store_id' => $storeId]);

        session(['current_store_id' => $storeId]);
    }
}
