import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save, Calculator, Truck, FileText, DollarSign, User } from 'lucide-react';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
    { title: 'Input Penjualan', href: '#' }
];

// Helper Components UI
const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="text-lg font-semibold border-b pb-3 mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <Icon className="h-5 w-5 text-indigo-500" /> {title}
    </h3>
);

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className='space-y-1'>
        <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</Label>
        <div>{children}</div>
    </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-indigo-500 h-10" />
);

const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md h-10 px-3 text-sm focus:ring-2 focus:ring-indigo-500">
        {props.children}
    </select>
);

interface Props {
    master_products: { id: number; name: string; code: string }[];
    customers: { id: number; name: string }[];
}

export default function CreateOutgoing({ master_products, customers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        // Informasi Dasar
        product_id: '',
        date: new Date().toISOString().split('T')[0], // Tanggal Nota
        no_invoice: '',
        no_po: '',
        customer_id: '',

        // Logistik
        shipping_method: 'Trucking',
        tgl_kirim: new Date().toISOString().split('T')[0],
        tgl_sampai: '', // Estimasi Jatuh Tempo / Sampai
        person_in_charge: '', // PIC

        // Kuantitas & Harga
        qty_out: '',
        selling_price: '',
        keping_out: '',
        kualitas_out: '',

        // Biaya & Total (Keuangan)
        pph_value: 0,
        ob_cost: 0,
        extra_cost: 0,
        grand_total: 0, // Net Amount

        status: 'shipped', // Default
        notes: '' // Catatan tambahan
    });

    // --- LOGIC HITUNG OTOMATIS (Kalkulator) ---
    useEffect(() => {
        const qty = parseFloat(String(data.qty_out)) || 0;
        const price = parseFloat(String(data.selling_price)) || 0;

        // 1. Hitung Bruto (Kotor)
        const grossTotal = qty * price;

        // 2. Hitung PPH (Otomatis 0.25% jika harga diisi)
        // Rumus: Bruto * 0.25 / 100
        const pph = Math.round(grossTotal * 0.0025);

        // 3. Ambil Biaya Lain (Input Manual)
        const ob = parseFloat(String(data.ob_cost)) || 0;
        const extra = parseFloat(String(data.extra_cost)) || 0;

        // 4. Hitung Net Amount (Total Akhir)
        // Rumus: Bruto - PPH - Biaya2
        const netAmount = grossTotal - pph - ob - extra;

        // Update State (Hanya update PPH jika user belum edit manual/atau mau auto terus)
        setData(prev => ({
            ...prev,
            pph_value: pph,
            grand_total: netAmount
        }));

    }, [data.qty_out, data.selling_price, data.ob_cost, data.extra_cost]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('outgoing.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Penjualan" />

            <div className="bg-gray-100 dark:bg-black py-8 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Input Penjualan</h1>
                            <p className="text-gray-500 mt-1">Buat transaksi penjualan baru ke customer.</p>
                        </div>
                        <Link href={route('products.gka')}>
                            <Button variant="outline" className='gap-2'><Undo2 size={16} /> Batal</Button>
                        </Link>
                    </div>

                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6 animate-pulse">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Ada kesalahan input!</AlertTitle>
                            <AlertDescription>Mohon periksa kolom yang berwarna merah.</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>

                        {/* CARD 1: INFORMASI DASAR */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <SectionTitle icon={FileText} title="INFORMASI DASAR" />

                            {/* Baris 1: Produk & Tanggal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormField label="Jenis Produk">
                                    <StyledSelect value={data.product_id} onChange={e => setData('product_id', e.target.value)} required>
                                        <option value="" disabled>Pilih Produk...</option>
                                        {master_products.map((p) => (<option key={p.id} value={p.id}>{p.name} {p.code}</option>))}
                                    </StyledSelect>
                                </FormField>
                                <FormField label="Tanggal Nota">
                                    <StyledInput type='date' value={data.date} onChange={e => setData('date', e.target.value)} required />
                                </FormField>
                            </div>

                            {/* Baris 2: Invoice, PO, Customer */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="No. Invoice">
                                    <StyledInput placeholder='INV-XXXX' value={data.no_invoice} onChange={e => setData('no_invoice', e.target.value)} required />
                                    {errors.no_invoice && <p className="text-red-500 text-xs mt-1">{errors.no_invoice}</p>}
                                </FormField>

                                {/* [KOLOM BARU] NO PO */}
                                <FormField label="No. PO Customer">
                                    <StyledInput placeholder='PO-XXXX' value={data.no_po} onChange={e => setData('no_po', e.target.value)} />
                                </FormField>

                                <FormField label="Customer / Pembeli">
                                    <StyledSelect value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} required>
                                        <option value="" disabled>Pilih Customer...</option>
                                        {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </StyledSelect>
                                </FormField>
                            </div>
                        </div>

                        {/* CARD 2: LOGISTIK */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <SectionTitle icon={Truck} title="LOGISTIK & PENGIRIMAN" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="Via Armada">
                                    <StyledSelect value={data.shipping_method} onChange={e => setData('shipping_method', e.target.value)}>
                                        <option value="Trucking">Trucking (Darat)</option>
                                        <option value="Kapal barang">Kapal Barang (Laut)</option>
                                        <option value="Pick-up">Pick-up Sendiri</option>
                                    </StyledSelect>
                                </FormField>
                                <FormField label="Tanggal Kirim">
                                    <StyledInput type='date' value={data.tgl_kirim} onChange={e => setData('tgl_kirim', e.target.value)} />
                                </FormField>
                                <FormField label="Estimasi Jatuh Tempo">
                                    <StyledInput type='date' value={data.tgl_sampai} onChange={e => setData('tgl_sampai', e.target.value)} />
                                </FormField>
                                <div className="md:col-span-3">
                                    <FormField label="Penanggung Jawab (PIC)">
                                        <StyledInput placeholder='Nama Supir / PIC Lapangan' value={data.person_in_charge} onChange={e => setData('person_in_charge', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* CARD 3: KUANTITAS & HARGA */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <SectionTitle icon={Calculator} title="KUANTITAS & HARGA" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="Berat Kirim (Qty Out)">
                                    <div className="relative">
                                        <StyledInput type='number' step="0.01" placeholder='0' value={data.qty_out} onChange={e => setData('qty_out', e.target.value)} required />
                                        <span className="absolute right-3 top-2 text-gray-400 text-sm font-bold">Kg</span>
                                    </div>
                                    {errors.qty_out && <p className="text-red-500 text-xs mt-1">{errors.qty_out}</p>}
                                </FormField>
                                <FormField label="Harga Satuan (Rp)">
                                    <StyledInput type='number' placeholder='0' value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} required />
                                </FormField>
                                <FormField label="Keping / Colly">
                                    <div className="relative">
                                        <StyledInput type='number' placeholder='0' value={data.keping_out} onChange={e => setData('keping_out', e.target.value)} />
                                    </div>
                                    {errors.keping_out && <p className="text-red-500 text-xs mt-1">{errors.keping_out}</p>}
                                </FormField>
                                <div className="md:col-span-3">
                                    <FormField label="Kualitas (%)">
                                        <StyledInput placeholder='Contoh: Kering 70% / Basah' value={data.kualitas_out} onChange={e => setData('kualitas_out', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* CARD 4: BIAYA & TOTAL (KEUANGAN) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <SectionTitle icon={DollarSign} title="BIAYA & TOTAL" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormField label="PPH 0.25% (Otomatis)">
                                    <StyledInput type='number' value={data.pph_value} onChange={e => setData('pph_value', parseFloat(e.target.value))} className="bg-gray-50" />
                                    <p className="text-[10px] text-gray-400 mt-1 italic">*Dihitung dari Bruto (Qty x Harga)</p>
                                </FormField>
                                {/* <FormField label="Biaya OB">
                                    <StyledInput type='number' placeholder='0' value={data.ob_cost} onChange={e => setData('ob_cost', parseFloat(e.target.value))} />
                                </FormField>
                                <FormField label="Biaya Tambahan">
                                    <StyledInput type='number' placeholder='0' value={data.extra_cost} onChange={e => setData('extra_cost', parseFloat(e.target.value))} />
                                </FormField> */}
                            </div>

                            {/* GRAND TOTAL BIG DISPLAY */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                <FormField label="TOTAL AKHIR (NET AMOUNT)">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xl">Rp</span>
                                        <Input
                                            value={new Intl.NumberFormat('id-ID').format(Number(data.grand_total))}
                                            readOnly
                                            className="pl-12 text-2xl font-bold text-indigo-700 bg-transparent border-none shadow-none focus:ring-0 h-auto py-2"
                                        />
                                    </div>
                                </FormField>
                            </div>
                        </div>

                        {/* CATATAN */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <FormField label="Catatan Tambahan">
                                <Textarea placeholder="Tulis keterangan tambahan di sini..." value={data.notes} onChange={e => setData('notes', e.target.value)} />
                            </FormField>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="flex justify-end pt-4 pb-12">
                            <Button type='submit' disabled={processing} className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-lg'>
                                <Save size={20} />
                                {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
