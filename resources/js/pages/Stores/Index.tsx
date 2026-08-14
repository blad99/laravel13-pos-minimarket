import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, switchMethod, index as storesIndex } from '@/routes/stores';

// Mendefinisikan tipe data TypeScript untuk Store
type Store = {
    id: string;
    name: string;
    address: string;
    is_active: boolean;
};

export default function Index({ stores }: { stores: Store[] }) {
    const { post } = useForm();

    const handleSwitchStore = (storeId: string) => {
        post(switchMethod(storeId).url);
    };

    return (
        <>
            <Head title="Kelola Toko" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Daftar Cabang Toko</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola cabang minimarket Anda di sini.</p>
                        </div>
                        {/* Tombol ke halaman Create */}
                        <Link href={create().url}>
                            <Button>+ Tambah Toko</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {stores.map((store) => (
                            <div key={store.id} className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{store.name}</h3>
                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{store.address}</p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-sidebar-border/70 dark:border-sidebar-border flex gap-2">
                                    {/* Tombol untuk Switch Store */}
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleSwitchStore(store.id)}
                                    >
                                        Masuk ke Toko Ini
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {stores.length === 0 && (
                            <div className="col-span-full rounded-xl border-2 border-dashed border-sidebar-border/70 p-8 text-center text-neutral-500 dark:border-sidebar-border dark:text-neutral-400">
                                Belum ada toko. Silakan buat toko pertama Anda.
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
            title: 'Kelola Toko',
            href: storesIndex().url,
        },
    ],
};