import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Undo2, Pencil, Printer, Calendar,
    Scale, FileText, CheckCircle2,
    Building2, User, Box, ArrowDownLeft
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'Stok Masuk', href: '/products/tsa' },
    { title: 'Detail Transaksi', href: '#' }
];

export default function ShowIncoming({ stock }: { stock: any }) {
    // --- FORMATTER ---
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    const formatKg = (val: number) => new Intl.NumberFormat('id-ID').format(val) + ' Kg';
    const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Masuk #${stock.id}`} />

            <div className="min-h-screen bg-gray-50/50 dark:bg-black py-8">
                {/* [FULL WIDTH] Menggunakan max-w-7xl agar tampilan lebar dan lega */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HEADER SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Bukti Barang Masuk
                                </h1>
                                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    DITERIMA
                                </span>
                            </div>
                            <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                                <span className="font-mono">ID: #{stock.id}</span>
                                <span className="text-gray-300">|</span>
                                <Calendar size={14} /> {formatDate(stock.date)}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link href={route('products.tsa')}>
                                <Button variant="secondary" className="shadow-sm bg-white dark:bg-zinc-900 hover:bg-gray-100">
                                    <Undo2 size={16} className="mr-2"/> Kembali
                                </Button>
                            </Link>
                            <Button variant="outline" className="shadow-sm bg-white dark:bg-zinc-900 hover:bg-gray-100" onClick={() => window.print()}>
                                <Printer size={16} className="mr-2"/> Print
                            </Button>
                            <Link href={route('incoming.edit', stock.id)}>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                                    <Pencil size={16} className="mr-2"/> Edit Data
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN (2/3) - DOCUMENT LOOK */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* MAIN CARD */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">

                                {/* Supplier Info */}
                                <div className="p-8 border-b border-gray-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <User size={14} /> Diterima Dari (Supplier)
                                        </h3>
                                        <div>
                                            <p className="font-bold text-2xl text-emerald-700 dark:text-emerald-400">{stock.nm_supplier}</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                No. PO / Ref: <span className="font-mono font-medium text-gray-900 dark:text-gray-200">{stock.no_po || '-'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:text-right">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-start md:justify-end gap-2">
                                            <Building2 size={14} /> Gudang Penerima
                                        </h3>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900 dark:text-white">PT. Garuda Karya Amanat</p>
                                            <p className="text-gray-500 text-sm mt-1">Warehouse Division</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Line Item */}
                                <div className="p-8">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Rincian Barang</h3>
                                    <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-6 border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <Box size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-gray-900 dark:text-white">{stock.product?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Kualitas: {stock.kualitas || 'Standar'} | {stock.keping || 0} Keping
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatKg(stock.qty_net)}</p>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                                Berat Bersih (Netto)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Calculations */}
                                <div className="p-8 pt-0">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Harga Beli Satuan</span>
                                            <span className="font-mono">{formatRp(stock.price_per_kg || 0)} / Kg</span>
                                        </div>

                                        <div className="border-b border-dashed border-gray-200 dark:border-zinc-700 my-2"></div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Kalkulasi ({stock.qty_net} x {stock.price_per_kg})
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatRp((stock.qty_net * stock.price_per_kg))}
                                            </span>
                                        </div>

                                        {/* Grand Total */}
                                        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900 flex justify-between items-center">
                                            <span className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">Total Pembayaran</span>
                                            <span className="font-bold text-3xl text-emerald-700 dark:text-emerald-400">{formatRp(stock.total_amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (1/3) - SUMMARY & STATS */}
                        <div className="space-y-6">

                            {/* Card: Status Check */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Status Penerimaan
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <ArrowDownLeft size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Stok Masuk Gudang</p>
                                            <p className="text-xs text-gray-500">Barang telah ditambahkan ke inventaris.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Physical Details */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Scale size={14} /> Data Fisik
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Berat (Kg)</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{formatKg(stock.qty_net)}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah Keping</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{stock.keping}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Kualitas</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{stock.kualitas || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes/PO Section */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl">
                                <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <FileText size={14} /> Referensi
                                </h4>
                                <div className="text-yellow-900 dark:text-yellow-200 text-sm">
                                    <p className="mb-1"><span className="font-semibold">No. PO:</span> {stock.no_po || 'Tidak ada'}</p>
                                    <p><span className="font-semibold">Supplier:</span> {stock.nm_supplier}</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
