import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Asumsi rute kustom Anda seperti ini:
import categoriesRoutes from '@/routes/categories';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { Category } from '@/types/category';

export default function Index({ categories }: { categories: Category[] }) {
    // State untuk melacak kategori mana yang sedang diedit. Jika null, berarti mode Tambah.
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    // --- FUNGSI SUBMIT (Bisa Tambah, Bisa Update) ---
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            // Mode EDIT: Gunakan PUT
            put(categoriesRoutes.update(editingCategory.id).url, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            // Mode TAMBAH: Gunakan POST
            post(categoriesRoutes.store().url, {
                onSuccess: () => reset(),
            });
        }
    };

    // --- FUNGSI EDIT & CANCEL ---
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
        });
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
    };

    // --- FUNGSI DELETE ---
    const handleDelete = (id: string, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
            // Gunakan route kustom Anda untuk delete
            router.delete(categoriesRoutes.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:flex-row md:p-6">

                {/* KIRI: Form Tambah / Edit */}
                <div className="w-full md:w-1/3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h3>

                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Kategori</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Makanan Ringan"
                                    required
                                />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Snack dan biskuit"
                                />
                                {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
                            </div>

                            <div className="mt-2 flex gap-2">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Menyimpan...' : (editingCategory ? 'Update' : 'Simpan')}
                                </Button>

                                {/* Tombol Batal hanya muncul saat mode Edit */}
                                {editingCategory && (
                                    <Button type="button" variant="outline" onClick={cancelEdit} disabled={processing}>
                                        Batal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* KANAN: Tabel Kategori */}
                <div className="w-full md:w-2/3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            Daftar Kategori
                        </h3>

                        {categories.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-sidebar-border/70 p-8 text-center text-neutral-500 dark:border-sidebar-border dark:text-neutral-400">
                                Belum ada kategori di toko ini.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-4 py-3">Nama Kategori</th>
                                            <th className="px-4 py-3">Deskripsi</th>
                                            <th className="px-4 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {category.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(category)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(category.id, category.name)}
                                                        >
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
            title: 'Daftar Kategori',
            href: categoriesRoutes.index().url,
        }
    ]
}