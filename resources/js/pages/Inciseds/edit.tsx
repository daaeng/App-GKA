import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save, Calculator } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: '/inciseds',
    },
];

interface NoInvoiceWithName {
    no_invoice: string;
    name: string;
}

// [TAMBAHAN] Interface Master Product
interface MasterProduct {
    id: number;
    name: string;
    code: string;
}

interface Incised {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    lok_kebun: string;
    j_brg: string;
    desk: string | null;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    incisor?: {
        name: string;
    };
}

const FormItem = ({
    label,
    children,
    error,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        {children}
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);

// [UPDATE] Tambahkan masterProducts ke props
export default function EditIncised({
    incised,
    noInvoicesWithNames,
    masterProducts,
}: {
    incised: Incised;
    noInvoicesWithNames: NoInvoiceWithName[];
    masterProducts: MasterProduct[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        product: incised.product,
        date: incised.date,
        no_invoice: incised.no_invoice,
        lok_kebun: incised.lok_kebun,
        j_brg: incised.j_brg,
        desk: incised.desk || '',
        qty_kg: incised.qty_kg,
        price_qty: incised.price_qty,
        amount: incised.amount,
        keping: incised.keping,
        kualitas: incised.kualitas || '',
    });

    const [selectedIncisorName, setSelectedIncisorName] = useState(
        incised.incisor?.name || 'N/A',
    );

    const calculateAmount = () => {
        const qty = Number(data.qty_kg) || 0;
        const price = Number(data.price_qty) || 0;
        const totalAmount = qty * price * 0.4;
        setData('amount', totalAmount);
    };

    useEffect(() => {
        const selected = noInvoicesWithNames.find(
            (item) => item.no_invoice === data.no_invoice,
        );
        setSelectedIncisorName(selected ? selected.name : 'N/A');
    }, [data.no_invoice, noInvoicesWithNames]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('inciseds.update', incised.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Incised" />

            <div className="h-full flex-col p-4 bg-gray-50 dark:bg-black">
                <div className="flex justify-between items-center mb-4">
                    <Heading title="Edit Data Harian Penoreh" />
                    <Link href={route('inciseds.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Errors...!</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* === KOLOM KIRI (Info Utama & Detail) === */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Utama</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* [PERBAIKAN] Pilihan Product dari Database */}
                                        <FormItem label="Product" error={errors.product}>
                                            <Select
                                                value={data.product}
                                                onValueChange={(value) => setData('product', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Jenis Product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {masterProducts.map((mp) => (
                                                        <SelectItem key={mp.id} value={mp.name}>
                                                            {mp.name} {mp.code ? `(${mp.code})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>

                                        <FormItem label="Tanggal" error={errors.date}>
                                            <Input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                            />
                                        </FormItem>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Kode Penoreh" error={errors.no_invoice}>
                                            <Select
                                                value={data.no_invoice}
                                                onValueChange={(value) => setData('no_invoice', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kode Penoreh" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {noInvoicesWithNames.length > 0 ? (
                                                        noInvoicesWithNames.map((item, index) => (
                                                            <SelectItem key={index} value={item.no_invoice}>
                                                                {`${item.no_invoice} - ${item.name}`}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="" disabled>
                                                            Tidak ada data
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>

                                        <FormItem label="Nama Penoreh">
                                            <Input
                                                value={selectedIncisorName}
                                                readOnly
                                                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                            />
                                        </FormItem>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail Barang & Lokasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormItem label="Lokasi Kebun" error={errors.lok_kebun}>
                                        <Select
                                            value={data.lok_kebun}
                                            onValueChange={(value) => setData('lok_kebun', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Lokasi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Temadu">Temadu</SelectItem>
                                                <SelectItem value="Sebayar">Sebayar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>

                                    <FormItem label="Jenis Barang" error={errors.j_brg}>
                                        <Input
                                            placeholder="cth: Karet Mingguan, Kelapa Butir, dll."
                                            value={data.j_brg}
                                            onChange={(e) => setData('j_brg', e.target.value)}
                                        />
                                    </FormItem>

                                    <FormItem label="Description" error={errors.desk}>
                                        <Textarea
                                            placeholder="Deskripsi tambahan jika ada..."
                                            value={data.desk}
                                            onChange={(e) => setData('desk', e.target.value)}
                                        />
                                    </FormItem>
                                </CardContent>
                            </Card>
                        </div>

                        {/* === KOLOM KANAN (Rincian Pemasukan) === */}
                        <div className="lg:col-span-1">
                            <Card className="h-full">
                                <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-emerald-600" />
                                        Rincian Pemasukan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-6">
                                    <FormItem label="Quantity (Kg)" error={errors.qty_kg}>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.qty_kg}
                                                onChange={(e) => setData('qty_kg', Number(e.target.value))}
                                                className="pr-12 text-right font-mono"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Kg</span>
                                        </div>
                                    </FormItem>

                                    <FormItem label="Price /Qty (Rp)" error={errors.price_qty}>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.price_qty}
                                                onChange={(e) => setData('price_qty', Number(e.target.value))}
                                                className="pl-10 text-right font-mono"
                                            />
                                        </div>
                                    </FormItem>

                                    <div className="relative pt-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-dashed" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white dark:bg-black px-2 text-muted-foreground">
                                                Total Pendapatan (Editable)
                                            </span>
                                        </div>
                                    </div>

                                    <FormItem label="Amount (Rp)" error={errors.amount}>
                                        <div className="flex gap-2">
                                            <div className="relative w-full">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-600 font-bold">Rp</span>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', Number(e.target.value))}
                                                    className="pl-10 text-right font-mono font-bold text-emerald-700 bg-emerald-50/50 border-emerald-200 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                onClick={calculateAmount}
                                                title="Hitung Ulang Otomatis (Qty * Price * 0.4)"
                                                className="flex-shrink-0"
                                            >
                                                <Calculator className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 text-right">
                                            *Klik ikon kalkulator untuk hitung otomatis (40%)
                                        </p>
                                    </FormItem>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <FormItem label="Keping" error={errors.keping}>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.keping}
                                                onChange={(e) => setData('keping', Number(e.target.value))}
                                            />
                                        </FormItem>

                                        <FormItem label="Kualitas" error={errors.kualitas}>
                                            <Input
                                                placeholder="A/B/C"
                                                value={data.kualitas}
                                                onChange={(e) => setData('kualitas', e.target.value)}
                                            />
                                        </FormItem>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-4">
                        <Button disabled={processing} type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
