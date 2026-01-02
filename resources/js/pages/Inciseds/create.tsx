import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Calendar,
    CircleAlert,
    DollarSign,
    FileText,
    MapPin,
    Package,
    Tag,
    TrendingUp,
    Undo2,
    User,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: route('inciseds.index'),
    },
    {
        title: 'Input Data Harian',
        href: '#',
    }
];

interface NoInvoiceWithName {
    no_invoice: string;
    name: string;
}

// [TAMBAHAN] Interface untuk Master Product
interface MasterProduct {
    id: number;
    name: string;
    code: string;
}

// Komponen helper untuk Input Form
const FormInput = ({
    id,
    label,
    icon: Icon,
    error,
    children,
}: {
    id: string;
    label: string;
    icon: React.ElementType;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Icon className="w-4 h-4 mr-2 text-gray-500" />
            {label}
        </Label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

// [UPDATE] Tambahkan masterProducts ke props
export default function CreateIncised({ noInvoicesWithNames, masterProducts }: { noInvoicesWithNames: NoInvoiceWithName[], masterProducts: MasterProduct[] }) {
    const { data, setData, post, processing, errors } = useForm({
        product: '',
        date: '',
        no_invoice: '',
        lok_kebun: '',
        j_brg: '',
        desk: '',
        qty_kg: '',
        price_qty: '',
        amount: '',
        keping: '',
        kualitas: '',
    });

    // Perhitungan otomatis untuk 'amount'
    useEffect(() => {
        const qty = parseFloat(data.qty_kg);
        const price = parseFloat(data.price_qty);

        if (!isNaN(qty) && !isNaN(price)) {
            const calculatedAmount = qty * price * 0.40; // Rumus: qty * price * 40%
            setData('amount', calculatedAmount.toFixed(2));
        } else {
            setData('amount', '');
        }
    }, [data.qty_kg, data.price_qty]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('inciseds.store'));
    };

    const inputClassName = "w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Data Harian" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">

                <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <Heading
                            title="Input Data Harian Penoreh"
                            description="Masukkan detail transaksi harian."
                            className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
                        />
                        <div className='flex-shrink-0 flex gap-2'>
                             <Link href={route('inciseds.index')}>
                                <Button type="button" variant="outline" className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200 rounded-lg shadow-sm flex items-center w-full sm:w-auto">
                                    <Undo2 className="h-4 w-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <Button disabled={processing} type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md px-6 py-2">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200">
                            <CircleAlert className="h-4 w-4 text-red-500 dark:text-red-300" />
                            <AlertTitle className='font-bold text-red-700 dark:text-red-100'>Ada Kesalahan!</AlertTitle>
                            <AlertDescription>Mohon periksa kembali data yang Anda masukkan.</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Detail Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* [PERBAIKAN] Menggunakan Data Master Product */}
                                    <FormInput id="product" label="Produk" icon={Box} error={errors.product}>
                                        <select
                                            id="product"
                                            value={data.product}
                                            onChange={(e) => setData('product', e.target.value)}
                                            className={inputClassName}
                                            required
                                        >
                                            <option value="" disabled>Pilih Jenis Produk</option>
                                            {masterProducts.map((mp) => (
                                                <option key={mp.id} value={mp.name}>
                                                    {mp.name} {mp.code ? `(${mp.code})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </FormInput>

                                    <FormInput id="date" label="Tanggal" icon={Calendar} error={errors.date}>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className={inputClassName}
                                            required
                                        />
                                    </FormInput>

                                    <FormInput id="no_invoice" label="Kode Penoreh" icon={User} error={errors.no_invoice}>
                                        <select
                                            id="no_invoice"
                                            value={data.no_invoice}
                                            onChange={(e) => setData('no_invoice', e.target.value)}
                                            className={inputClassName}
                                            required
                                        >
                                            <option value="" disabled>Pilih Kode Penoreh</option>
                                            {noInvoicesWithNames.length > 0 ? (
                                                noInvoicesWithNames.map((item, index) => (
                                                    <option key={index} value={item.no_invoice}>
                                                        {`${item.no_invoice} - ${item.name}`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Tidak ada data</option>
                                            )}
                                        </select>
                                    </FormInput>

                                    <FormInput id="lok_kebun" label="Lokasi Kebun" icon={MapPin} error={errors.lok_kebun}>
                                        <select
                                            id="lok_kebun"
                                            value={data.lok_kebun}
                                            onChange={(e) => setData('lok_kebun', e.target.value)}
                                            className={inputClassName}
                                            required
                                        >
                                            <option value="" disabled>Pilih Lokasi</option>
                                            <option value="Temadu">Temadu</option>
                                            <option value="Sebayar">Sebayar</option>
                                        </select>
                                    </FormInput>

                                    <FormInput id="j_brg" label="Jenis Barang" icon={Tag} error={errors.j_brg}>
                                        <Input
                                            id="j_brg"
                                            placeholder="Contoh: Karet Keping"
                                            value={data.j_brg}
                                            onChange={(e) => setData('j_brg', e.target.value)}
                                            className={inputClassName}
                                        />
                                    </FormInput>
                                </div>

                                <FormInput id="desk" label="Deskripsi (Opsional)" icon={FileText} error={errors.desk}>
                                    <Textarea
                                        id="desk"
                                        placeholder="Catatan tambahan..."
                                        value={data.desk}
                                        onChange={(e) => setData('desk', e.target.value)}
                                        className={`${inputClassName} min-h-[100px]`}
                                    />
                                </FormInput>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-1 shadow-lg dark:bg-gray-800 h-fit">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Rincian Finansial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput id="qty_kg" label="Quantity (Kg)" icon={Box} error={errors.qty_kg}>
                                    <Input
                                        id="qty_kg"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.qty_kg}
                                        onChange={(e) => setData('qty_kg', e.target.value)}
                                        className={inputClassName}
                                        required
                                    />
                                </FormInput>

                                <FormInput id="price_qty" label="Harga /Qty" icon={DollarSign} error={errors.price_qty}>
                                    <Input
                                        id="price_qty"
                                        type="number"
                                        placeholder="0"
                                        value={data.price_qty}
                                        onChange={(e) => setData('price_qty', e.target.value)}
                                        className={inputClassName}
                                        required
                                    />
                                </FormInput>

                                <FormInput id="amount" label="Amount (40%)" icon={DollarSign} error={errors.amount}>
                                    <Input
                                        id="amount"
                                        placeholder="Akan terisi otomatis"
                                        value={data.amount}
                                        readOnly
                                        className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md shadow-sm"
                                    />
                                </FormInput>

                                <FormInput id="keping" label="Keping" icon={Package} error={errors.keping}>
                                    <Input
                                        id="keping"
                                        type="number"
                                        placeholder="0"
                                        value={data.keping}
                                        onChange={(e) => setData('keping', e.target.value)}
                                        className={inputClassName}
                                        required
                                    />
                                </FormInput>

                                <FormInput id="kualitas" label="Kualitas" icon={TrendingUp} error={errors.kualitas}>
                                    <Input
                                        id="kualitas"
                                        placeholder="Contoh: A, B, C"
                                        value={data.kualitas}
                                        onChange={(e) => setData('kualitas', e.target.value)}
                                        className={inputClassName}
                                        required
                                    />
                                </FormInput>
                            </CardContent>
                        </Card>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
