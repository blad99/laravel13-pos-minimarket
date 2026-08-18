<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // 🪄 AJAIB: Kita TIDAK PERLU menulis ->where('store_id', session('current_store_id'))
        // Trait BelongsToStore sudah mengurusnya! Kita cukup panggil ::all() atau ::get().
        $categories = Category::orderBy('name', 'asc')->get();


        if($categories->isEmpty()) {
            $categories = [];
        }

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        // 🪄 AJAIB LAGI: Kita tidak perlu mengisi 'store_id'. 
        // Trait otomatis menyisipkannya saat proses "creating".
        Category::create($validated);

        // Karena Anda sudah mengatur 'sonner' toast, flash 'success' ini akan memunculkan popup!
        return redirect()->route('categories.index')->with('success', 'Kategory berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Kategori berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // TODO: Buka komen ini nanti setelah model Product dibuat
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'Gagal menghapus: Masih ada produk di dalam kategori ini.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }

    // --- Private Helpers ---

    private function validateCategory(Request $request, string $ignoreId = null): array
    {
        // Validasi 'unique' di MongoDB perlu perlakuan khusus jika ada store_id,
        // tapi untuk MVP ini kita buat nama kategori required saja.
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);
    }
}
