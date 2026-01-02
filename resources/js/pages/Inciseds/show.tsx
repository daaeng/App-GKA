import Heading from '../../components/heading';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Impor komponen Card
import AppLayout from '../../layouts/app-layout';
import { type BreadcrumbItem } from '../../types';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Calendar,
    CircleAlert,
    DollarSign,
    Leaf,
    Rss,
    Tag,
    Undo2,
    User, // Mengganti Leaf dengan User untuk Penoreh
    MapPin, // Mengganti Leaf dengan MapPin untuk Lokasi
    FileText, // Untuk Deskripsi
    TrendingUp, // Untuk Kualitas
    Package, // Untuk Keping
    Printer // [BARU] Icon Printer
} from 'lucide-react';
import React from 'react'; // Impor React

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: route('inciseds.index'), // Pastikan route 'inciseds.index' ada
    },
    {
        title: 'Detail Transaksi',
        href: '#',
    }
];

// Helper format mata uang
const formatCurrency = (value: number) => {
    if (isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Helper format tanggal
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch (e) {
        return dateString;
    }
};

// Interface dari file Anda
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
    incisor_name?: string | null;
}

// Komponen helper untuk menampilkan item detail (Label di atas, Data di bawah)
const InfoItem = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | undefined | null;
}) => (
    <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </label>
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
);

// Komponen helper untuk menampilkan item finansial (Label kiri, Data kanan)
const FinancialItem = ({
    icon: Icon,
    label,
    value,
    highlight = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <div className={`flex items-center justify-between py-3 ${highlight ? 'px-3 -mx-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg' : 'border-b dark:border-gray-700'}`}>
        <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
            <Icon className={`w-4 h-4 mr-2 ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
            {label}
        </dt>
        <dd className={`text-sm font-semibold ${highlight ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {value}
        </dd>
    </div>
);


export default function ShowIncised({ incised }: { incised: Incised }) {

    // [BARU] Fungsi untuk membuka halaman cetak di tab baru
    const handlePrint = () => {
        const printUrl = route('inciseds.print', incised.id);
        window.open(printUrl, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Data Harian" />

            <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8">
                {/* Header Halaman */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <Heading
                        title="Detail Data Harian Penoreh"
                        description={`Dicatat pada ${formatDate(incised.date)}`}
                        className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
                    />
                    
                    {/* [UPDATED] Grup Tombol Aksi */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            onClick={handlePrint}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 rounded-lg shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Cetak
                        </Button>

                        <Link href={route('inciseds.index')} className="flex-1 sm:flex-none">
                            <Button className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200 rounded-lg shadow-sm flex items-center justify-center">
                                <Undo2 className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Peringatan jika penoreh tidak ada */}
                {incised.incisor === undefined && incised.incisor_name === null && (
                    <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200">
                        <CircleAlert className="h-4 w-4 text-red-500 dark:text-red-300" />
                        <AlertTitle className='font-bold text-red-700 dark:text-red-100'>Peringatan</AlertTitle>
                        <AlertDescription>
                            Data penoreh (Incisor) untuk no. invoice ini tidak ditemukan.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Layout Grid Utama */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Kolom Kiri (Lebar) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Kartu Detail Transaksi */}
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Detail Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <InfoItem
                                        icon={User}
                                        label="Nama Penoreh"
                                        value={incised.incisor?.name || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={Rss}
                                        label="No. Invoice"
                                        value={incised.no_invoice}
                                    />
                                    <InfoItem
                                        icon={Box}
                                        label="Produk"
                                        value={incised.product}
                                    />
                                    <InfoItem
                                        icon={Tag}
                                        label="Jenis Barang"
                                        value={incised.j_brg}
                                    />
                                    <InfoItem
                                        icon={MapPin}
                                        label="Lokasi Kebun"
                                        value={incised.lok_kebun}
                                    />
                                    <InfoItem
                                        icon={Calendar}
                                        label="Tanggal"
                                        value={formatDate(incised.date)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kartu Deskripsi */}
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                    Deskripsi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-base text-gray-700 dark:text-gray-300 min-h-[80px] prose dark:prose-invert">
                                    {incised.desk || 'Tidak ada deskripsi.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan (Sempit) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Kartu Rincian Finansial */}
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Rincian Finansial
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="divide-y dark:divide-gray-700">
                                    <FinancialItem
                                        icon={Box}
                                        label="QTY (Kg)"
                                        value={`${incised.qty_kg.toString()} kg`}
                                    />
                                    <FinancialItem
                                        icon={DollarSign}
                                        label="Harga per Kg"
                                        value={formatCurrency(incised.price_qty)}
                                    />
                                    
                                    {/* Total Jumlah Diberi Highlight */}
                                    <FinancialItem
                                        icon={DollarSign}
                                        label="Total Jumlah"
                                        value={formatCurrency(incised.amount)}
                                        highlight={true}
                                    />

                                    <FinancialItem
                                        icon={Package}
                                        label="Keping"
                                        value={incised.keping.toString()}
                                    />
                                    <FinancialItem
                                        icon={TrendingUp}
                                        label="Kualitas"
                                        value={incised.kualitas}
                                    />
                                </dl>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}