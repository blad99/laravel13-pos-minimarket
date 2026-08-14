<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class ensureHasStore
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Lewati pengecekan jika rutenya adalah halaman pembuatan toko,
        // supaya tidak terjadi error infinite redirect (pengalihan berulang).
        if($request->routeIs('stores.create', 'stores.store', 'logout')) return $next($request);

        /** @var User $user */
        $user = Auth::user();

        // 2. Jika sesi sudah punya data toko, silakan lanjut.
        if(session()->has('current_store_id')) return $next($request);

        // 3. Jika sesi kosong, tapi database user punya current_store_id,
        // selamatkan dengan memindahkannya ke sesi.
        if(!empty($user->current_store_id)) {
            session(['current_store_id' => $user->current_store_id]);
            return $next($request);
        }

        // 4. Jika dua-duanya kosong, coba pilih toko pertama dari daftar toko yang di-assign.
        if(!empty($user->assigned_store_ids) && count($user->assigned_store_ids) > 0) {
            $firstStoreId = $user->assigned_store_ids[0];

            // Simpan ke database dan sesi
            $user->update(['current_store_id' => $firstStoreId]);
            session(['current_store_id' => $firstStoreId]);

            return $next($request);
        }

        // 5. Kondisi Terburuk: User sama sekali tidak memiliki toko.
        // Jika dia admin, paksa buat toko.
        if($user->isAdmin()) {
            return redirect()->route('stores.create')->with('warning', 'Anda harus membuat toko terlebih dahulu sebelum menggunakan aplikasi.');
        }

        // Jika dia kasir, berarti admin lupa meng-assign kasir ini ke toko mana.
        abort(403, 'Akses ditolak: Akun Anda belum ditugaskan ke toko mana pun. Hubungi Administrator.');
    }
}
