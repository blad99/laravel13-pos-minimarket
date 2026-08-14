import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Form, Head } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";
import { store } from "@/routes/stores";

export default function Create() {
    return (
        <>
            <Head title="Toko Baru" />

            <div className="flex h-full flex-1 gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-xl">
                    <h3 className="text-3xl font-bold mb-1">Toko Baru</h3>
                    <p className="text-muted-foreground mb-8">Silahkan isi form di bawah ini</p>
                    <Form {...store.form()} className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name_toko">Nama Toko</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Nama Toko"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Alamat Toko</Label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            required
                                            className="block border"
                                            placeholder="Alamat Lengkap Toko"
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">No.Telephone Toko</Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            placeholder="081234567890"
                                            maxLength={12}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_rate">Pajak Toko (%)</Label>
                                        <Input
                                            id="tax_rate"
                                            type="number"
                                            name="tax_rate"
                                            required
                                            placeholder="10"
                                        />
                                        <InputError message={errors.tax_rate} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="receipt_prefix">Kode Awal Nota (Struk)</Label>
                                        <Input
                                            id="receipt_prefix"
                                            type="text"
                                            name="receipt_prefix"
                                            placeholder="BDG"
                                        />
                                        <InputError message={errors.receipt_prefix} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Metode Pembayaran</Label>
                                        <div className="flex gap-4 mt-1">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="pm_cash" name="active_payment_methods[]" value="cash" defaultChecked />
                                                <Label htmlFor="pm_cash" className="font-normal cursor-pointer">Cash</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="pm_qris" name="active_payment_methods[]" value="qris" />
                                                <Label htmlFor="pm_qris" className="font-normal cursor-pointer">QRIS</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="pm_transfer" name="active_payment_methods[]" value="transfer" />
                                                <Label htmlFor="pm_transfer" className="font-normal cursor-pointer">Transfer</Label>
                                            </div>
                                        </div>
                                        <InputError message={errors.active_payment_methods} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Simpan
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

            </div>

        </>
    )
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Tambah Toko',
        },
    ],
}