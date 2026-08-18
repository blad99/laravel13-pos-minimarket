import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Asumsi Anda memiliki rute khusus untuk products
import productsRoutes from '@/routes/products';

type Category = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    category_id: string;
    barcode: string | null;
    name: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    stock: number;
    is_active: boolean;
    category: Category; // Berasal dari relasi with('category')
};

type Props = {
    products: Product[];
    categories: Category[];
    filters: { search?: string };
};

export default function Index({ products, categories, filters }: Props) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        barcode: '',
        name: '',
        description: '',
        cost_price: 0,
        selling_price: 0,
        stock: 0,
    });

    // --- FUNGSI SUBMIT ---
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            put(productsRoutes.update(editingProduct.id).url, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(productsRoutes.store().url, {
                onSuccess: () => reset(),
            });
        }
    };

    // --- FUNGSI EDIT & CANCEL ---
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setData({
            category_id: product.category_id,
            barcode: product.barcode || '',
            name: product.name,
            description: product.description || '',
            cost_price: product.cost_price,
            selling_price: product.selling_price,
            stock: product.stock,
        });
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        reset();
        clearErrors();
    };

    // --- FUNGSI DELETE ---
    const handleDelete = (id: string, name: string) => {
        if (confirm(`Hapus produk "${name}"?`)) {
            router.delete(productsRoutes.destroy(id).url);
        }
    };

    // --- FUNGSI SEARCH ---
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Menggunakan router.get untuk pencarian dengan mempertahankan state
        router.get(productsRoutes.index().url, { search: e.target.value }, {
            preserveState: true,
            replace: true, // Tidak menumpuk history browser
        });
    };

    return (
        <>
            <Head title="Kelola Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:flex-row md:p-6">

                {/* KIRI: Form Tambah / Edit */}
                <div className="w-full md:w-1/3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h3>

                        <form onSubmit={submit} className="flex flex-col gap-4">

                            {/* Pilihan Kategori */}
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                                    required
                                >
                                    <option value="" disabled>-- Pilih Kategori --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <span className="text-sm text-red-500">{errors.category_id}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="barcode">Barcode / SKU (Opsional)</Label>
                                <Input
                                    id="barcode"
                                    type="text"
                                    value={data.barcode}
                                    onChange={(e) => setData('barcode', e.target.value)}
                                />
                            </div>

                            {/* Grid 2 Kolom untuk Harga */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cost_price">Harga Modal</Label>
                                    <Input
                                        id="cost_price"
                                        type="number"
                                        min="0"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', Number(e.target.value))}
                                        required
                                    />
                                    {errors.cost_price && <span className="text-sm text-red-500">{errors.cost_price}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="selling_price">Harga Jual</Label>
                                    <Input
                                        id="selling_price"
                                        type="number"
                                        min="0"
                                        value={data.selling_price}
                                        onChange={(e) => setData('selling_price', Number(e.target.value))}
                                        required
                                    />
                                    {errors.selling_price && <span className="text-sm text-red-500">{errors.selling_price}</span>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stok Awal</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Menyimpan...' : (editingProduct ? 'Update' : 'Simpan')}
                                </Button>

                                {editingProduct && (
                                    <Button type="button" variant="outline" onClick={cancelEdit} disabled={processing}>
                                        Batal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* KANAN: Tabel Produk */}
                <div className="w-full md:w-2/3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                Daftar Produk
                            </h3>

                            {/* Input Pencarian */}
                            <Input
                                type="search"
                                placeholder="Cari nama atau barcode..."
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="max-w-xs"
                            />
                        </div>

                        {products.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-sidebar-border/70 p-8 text-center text-neutral-500 dark:border-sidebar-border dark:text-neutral-400">
                                {filters.search ? 'Produk tidak ditemukan.' : 'Belum ada produk. Silakan buat kategori dan produk pertama Anda.'}
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-4 py-3">Barang</th>
                                            <th className="px-4 py-3">Kategori</th>
                                            <th className="px-4 py-3 text-right">Harga Beli</th>
                                            <th className="px-4 py-3 text-right">Harga Jual</th>
                                            <th className="px-4 py-3 text-right">Stok</th>
                                            <th className="px-4 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-neutral-900 dark:text-white">{product.name}</div>
                                                    <div className="text-xs text-neutral-400">{product.barcode || '-'}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800">
                                                        {product.category?.name || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">Rp {product.cost_price.toLocaleString('id-ID')}</td>
                                                <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">
                                                    Rp {product.selling_price.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : ''}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id, product.name)}>
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Kelola Produk',
            href: '/products',
        },
    ],
};