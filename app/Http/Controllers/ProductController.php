<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $productsQuery = Product::with('category')->orderBy('name', 'asc');

        if($search) {
            $productsQuery->where('name', 'like', "%{$search}%")->orWhere('barcode', 'like', "%{$search}%");
        }

        $products = $productsQuery->get();

        // Ambil daftar kategori HANYA untuk toko ini (berkat trait)
        $categories = Category::orderBy('name', 'asc')->get();

        if($products->isEmpty()) {
            $products = [];
        }

        if($categories->isEmpty()) {
            $categories = [];
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => ['search' => $search]
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
        $validated = $this->validatedProduct($request);
        $validated['is_active'] = $request->boolean('is_active', true);

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
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
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validatedProduct($request);
        $validated['is_active'] = $request->boolean('is_active', true);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Nanti: Jangan boleh dihapus jika ada di tabel Transaksi!
        // Sementara kita izinkan hapus langsung.
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }

    // --- Private Helpers ---

    private function validatedProduct(Request $request): array
    {
        return $request->validate([
            'category_id' => ['required', 'string'],
            'barcode' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0', 'gte:cost_price'], // gte = tidak boleh lebih murah dari modal
            'stock' => ['required', 'integer', 'min:0'],
        ]);
    }
}
