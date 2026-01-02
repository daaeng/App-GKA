import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CircleAlert, Undo2, Save, Calculator,
    Calendar, User, Package, FileText,
    Scale, Coins, Layers
} from 'lucide-react';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'Stok Masuk', href: '/products/tsa' },
    { title: 'Edit Data', href: '#' }
];

// --- COMPONENTS UI ---

const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
    <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <Icon size={20} />
            </div>
            {title}
        </h3>
        {subtitle && <p className="text-sm text-gray-500 ml-11 mt-1">{subtitle}</p>}
    </div>
);

const FormField = ({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div>{children}</div>
    </div>
);

// StyledInput yang diperbarui agar menerima className (untuk padding icon)
const StyledInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input
        {...props}
        className={`w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 rounded-lg h-11 transition-all text-base ${className || ''}`}
    />
);

const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="relative">
        <select
            {...props}
            className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
            {props.children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);

export default function EditIncoming({ master_products, stock }: { master_products: any[], stock: any }) {
    const { data, setData, put, processing, errors } = useForm({
        date: stock.date,
        product_id: stock.product_id,
        nm_supplier: stock.nm_supplier,
        no_po: stock.no_po || '',
        qty_net: stock.qty_net,
        price_per_kg: stock.price_per_kg || '',
        total_amount: stock.total_amount || '',
        keping: stock.keping || '',
        kualitas: stock.kualitas || '',
    });

    // Hitung ulang otomatis (Kalkulator)
    useEffect(() => {
        const qty = parseFloat(String(data.qty_net)) || 0;
        const price = parseFloat(String(data.price_per_kg)) || 0;

        // Hanya hitung otomatis jika user mengubah qty atau harga
        if (qty > 0 && price > 0) {
            const total = qty * price;
            setData('total_amount', total.toFixed(0));
        }
    }, [data.qty_net, data.price_per_kg]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('incoming.update', stock.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Stok Masuk" />

            <div className="bg-gray-50/50 dark:bg-black py-8 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Header Page */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Edit Stok Masuk</h1>
                            <p className="text-gray-500 mt-1">Perbarui data penerimaan barang dari Supplier.</p>
                        </div>
                        <Link href={route('products.tsa')}>
                            <Button variant="outline" className="bg-white dark:bg-zinc-900 shadow-sm hover:bg-gray-100">
                                <Undo2 size={16} className="mr-2"/> Batalkan
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* KOLOM KIRI (2/3): Form Utama */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* SECTION 1: Informasi Transaksi */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
                                    <SectionTitle
                                        icon={FileText}
                                        title="Informasi Transaksi"
                                        subtitle="Detail dokumen dan sumber barang."
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField label="Tanggal Masuk" required>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                                <StyledInput
                                                    type="date"
                                                    value={data.date}
                                                    onChange={e => setData('date', e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </FormField>

                                        <FormField label="Produk / Barang" required>
                                            <StyledSelect value={data.product_id} onChange={e => setData('product_id', e.target.value)} required>
                                                <option value="" disabled>-- Pilih Produk --</option>
                                                {master_products.map((mp) => (
                                                    <option key={mp.id} value={mp.id}>{mp.name} {mp.code ? `(${mp.code})` : ''}</option>
                                                ))}
                                            </StyledSelect>
                                        </FormField>

                                        <FormField label="Supplier / Asal" required>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                                <StyledSelect
                                                    value={data.nm_supplier}
                                                    onChange={e => setData('nm_supplier', e.target.value)}
                                                    style={{ paddingLeft: '2.5rem' }} // Custom padding for select with icon
                                                    required
                                                >
                                                    <option value="Sebayar">Sebayar</option>
                                                    <option value="Temadu">Temadu</option>
                                                    <option value="Agro">GK Agro</option>
                                                    <option value="GKA">GKA</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </StyledSelect>
                                            </div>
                                        </FormField>

                                        <FormField label="No. Referensi / PO">
                                            <StyledInput
                                                placeholder="Contoh: PO-001"
                                                value={data.no_po}
                                                onChange={e => setData('no_po', e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {/* SECTION 2: Detail Fisik */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
                                    <SectionTitle
                                        icon={Package}
                                        title="Detail Fisik Barang"
                                        subtitle="Spesifikasi berat, jumlah, dan kualitas."
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField label="Berat Bersih (Netto)" required>
                                            <div className="relative">
                                                <StyledInput
                                                    type="number"
                                                    step="0.01"
                                                    value={data.qty_net}
                                                    onChange={e => setData('qty_net', e.target.value)}
                                                    className="pr-10 font-medium"
                                                    placeholder="0.00"
                                                    required
                                                />
                                                <span className="absolute right-3 top-3 text-sm font-bold text-gray-400 pointer-events-none">Kg</span>
                                            </div>
                                        </FormField>

                                        <FormField label="Jumlah Keping / Sak">
                                            <div className="relative">
                                                <StyledInput
                                                    type="number"
                                                    value={data.keping}
                                                    onChange={e => setData('keping', e.target.value)}
                                                    className="pr-10"
                                                    placeholder="0"
                                                />
                                                <Layers className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </FormField>

                                        <FormField label="Kualitas / Grade">
                                            <StyledInput
                                                value={data.kualitas}
                                                onChange={e => setData('kualitas', e.target.value)}
                                                placeholder="Contoh: 50%, Kering"
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN (1/3): Kalkulasi Harga (Sticky) */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 p-6 sticky top-6">
                                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-6">
                                        <Coins className="h-5 w-5" /> Kalkulasi Harga
                                    </h3>

                                    <div className="space-y-6">
                                        <FormField label="Harga Satuan (Per Kg)">
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-500 font-semibold text-sm">Rp</span>
                                                <StyledInput
                                                    type="number"
                                                    value={data.price_per_kg}
                                                    onChange={e => setData('price_per_kg', e.target.value)}
                                                    className="pl-10 bg-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </FormField>

                                        <div className="border-t border-emerald-200 dark:border-emerald-800 my-2"></div>

                                        <FormField label="Total Pembayaran (Rp)">
                                            <div className="relative">
                                                <Calculator className="absolute left-3 top-3.5 h-5 w-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                                                <StyledInput
                                                    type="number"
                                                    value={data.total_amount}
                                                    onChange={e => setData('total_amount', e.target.value)}
                                                    // Class pl-10 memberi padding kiri agar teks tidak menabrak ikon
                                                    className="pl-10 h-14 text-xl font-bold text-emerald-700 bg-white border-emerald-300 focus:ring-emerald-500 shadow-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <p className="text-[11px] text-emerald-600/70 mt-2 text-right italic">
                                                *Dihitung otomatis (Qty x Harga), namun dapat diedit manual.
                                            </p>
                                        </FormField>
                                    </div>

                                    <div className="mt-8">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-base"
                                        >
                                            <Save size={20} />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
