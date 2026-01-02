import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
// [UPDATE] Tambahkan DollarSign di sini
import { CircleAlert, Undo2, Save, Calculator, Truck, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
    { title: 'Edit Penjualan', href: '#' }
];

// Helper UI
const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="text-lg font-semibold border-b pb-3 mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <Icon className="h-5 w-5 text-indigo-500" /> {title}
    </h3>
);
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className='space-y-1'><Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</Label><div>{children}</div></div>
);
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-indigo-500 h-10" />
);
const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md h-10 px-3 text-sm focus:ring-2 focus:ring-indigo-500">{props.children}</select>
);

interface Props {
    master_products: any[];
    customers: any[];
    stock: any;
}

export default function EditOutgoing({ master_products, customers, stock }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        // Data Awal
        product_id: stock.product_id,
        date: stock.date,
        no_invoice: stock.no_invoice,
        no_po: stock.no_po || '',
        customer_id: stock.customer_id,
        shipping_method: stock.shipping_method || 'Trucking',
        tgl_kirim: stock.tgl_kirim || '',
        person_in_charge: stock.person_in_charge || '',
        qty_out: stock.qty_out,
        selling_price: stock.selling_price,
        keping_out: stock.keping_out || '',
        kualitas_out: stock.kualitas_out || '',
        pph_value: stock.pph_value || 0,
        ob_cost: stock.ob_cost || 0,
        extra_cost: stock.extra_cost || 0,
        grand_total: stock.grand_total,
        notes: stock.notes || '',

        status: stock.status,
        tgl_sampai: stock.tgl_sampai || '',
        qty_sampai: stock.qty_sampai || '',
    });

    // --- LOGIC PERHITUNGAN (Otomatis Update Total) ---
    useEffect(() => {
        const qtyOut = parseFloat(String(data.qty_out)) || 0;
        const qtySampai = parseFloat(String(data.qty_sampai)) || 0;
        const price = parseFloat(String(data.selling_price)) || 0;

        // Rumus: Jika ada Qty Sampai, gunakan itu. Jika tidak, gunakan Qty Kirim (Estimasi)
        const usedQty = qtySampai > 0 ? qtySampai : qtyOut;

        // 1. Harga Karet (Bruto)
        const grossTotal = usedQty * price;

        // 2. Hitung PPH (0.25% dari Bruto) - Bisa di-override user jika diedit manual
        // Kita hitung otomatis hanya jika user belum mengeditnya secara manual,
        // tapi untuk simplifikasi di edit mode, kita biarkan otomatis update agar sinkron.
        const pph = Math.round(grossTotal * 0.0025);

        // 3. Biaya Lain (Input Manual)
        const ob = parseFloat(String(data.ob_cost)) || 0;
        const extra = parseFloat(String(data.extra_cost)) || 0;

        // 4. Grand Total (Net)
        const netAmount = grossTotal - pph - ob - extra;

        setData(prev => ({ ...prev, pph_value: pph, grand_total: netAmount }));
    }, [data.qty_out, data.qty_sampai, data.selling_price, data.ob_cost, data.extra_cost]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('outgoing.update', stock.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Penjualan" />
            <div className="bg-gray-100 dark:bg-black py-8 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Penjualan</h1>
                            <p className="text-gray-500 mt-1">Update Invoice #{stock.no_invoice}</p>
                        </div>
                        <Link href={route('products.gka')}><Button variant="outline" className='gap-2'><Undo2 size={16} /> Batal</Button></Link>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* 1. INFO DASAR */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
                            <SectionTitle icon={FileText} title="INFORMASI DASAR" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormField label="Jenis Produk">
                                    <StyledSelect value={data.product_id} onChange={e => setData('product_id', e.target.value)} required>
                                        {master_products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                    </StyledSelect>
                                </FormField>
                                <FormField label="Tanggal Nota">
                                    <StyledInput type='date' value={data.date} onChange={e => setData('date', e.target.value)} required />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="No. Invoice">
                                    <StyledInput value={data.no_invoice} onChange={e => setData('no_invoice', e.target.value)} required />
                                </FormField>
                                <FormField label="No. PO Customer">
                                    <StyledInput value={data.no_po} onChange={e => setData('no_po', e.target.value)} />
                                </FormField>
                                <FormField label="Customer">
                                    <StyledSelect value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} required>
                                        {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </StyledSelect>
                                </FormField>
                            </div>
                        </div>

                        {/* 2. PENGIRIMAN & STATUS */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6">
                            <SectionTitle icon={CheckCircle2} title="STATUS & PENERIMAAN BARANG" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <FormField label="Status Pengiriman">
                                    <StyledSelect value={data.status} onChange={e => setData('status', e.target.value)} className="font-bold text-blue-700">
                                        <option value="pending">Pending (Persiapan)</option>
                                        <option value="shipped">Shipped (Sedang Dikirim)</option>
                                        <option value="buyer">Selesai (Diterima Buyer)</option>
                                    </StyledSelect>
                                </FormField>
                                <FormField label="Tanggal Kirim">
                                    <StyledInput type='date' value={data.tgl_kirim} onChange={e => setData('tgl_kirim', e.target.value)} />
                                </FormField>
                                <FormField label="Tanggal Sampai">
                                    <StyledInput type='date' value={data.tgl_sampai} onChange={e => setData('tgl_sampai', e.target.value)} />
                                </FormField>
                                <div className="bg-green-100 p-3 rounded border border-green-300">
                                    <FormField label="Qty Timbangan Pabrik (Sampai)">
                                        <div className="relative">
                                            <StyledInput type='number' step="0.01" placeholder="0.00" value={data.qty_sampai} onChange={e => setData('qty_sampai', e.target.value)} className="border-green-400 focus:ring-green-500 font-bold text-green-800" />
                                            <span className="absolute right-3 top-2 text-xs font-bold text-green-700">KG</span>
                                        </div>
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* 3. KUANTITAS & HARGA */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
                            <SectionTitle icon={Calculator} title="KUANTITAS & HARGA" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="Berat Kirim (Qty Out)">
                                    <StyledInput type='number' step="0.01" value={data.qty_out} onChange={e => setData('qty_out', e.target.value)} required />
                                </FormField>
                                <FormField label="Keping / Colly">
                                    <StyledInput type='number' value={data.keping_out} onChange={e => setData('keping_out', e.target.value)} />
                                </FormField>
                                <FormField label="Harga Satuan (Rp)">
                                    <StyledInput type='number' value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} required />
                                </FormField>
                            </div>
                        </div>

                        {/* 3.b [BARU] BIAYA LAIN-LAIN */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
                            <SectionTitle icon={DollarSign} title="BIAYA LAIN-LAIN" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="PPH 0.25% (Otomatis)">
                                    <div className='bg-blue-100 p-2'>
                                        <StyledInput type='number' value={data.pph_value} onChange={e => setData('pph_value', parseFloat(e.target.value))} className="bg-gray-50" readOnly />
                                        <p className="text-[10px] text-blue-800 mt-1 italic">*Dihitung dari Bruto (Qty x Harga)</p>
                                    </div>
                                </FormField>
                                <FormField label="Biaya OB">
                                    <StyledInput type='number' value={data.ob_cost} onChange={e => setData('ob_cost', parseFloat(e.target.value))} placeholder="0" />
                                </FormField>
                                <FormField label="Biaya Tambahan">
                                    <StyledInput type='number' value={data.extra_cost} onChange={e => setData('extra_cost', parseFloat(e.target.value))} placeholder="0" />
                                </FormField>
                            </div>
                        </div>

                        {/* 4. TOTAL (Read Only) */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-700 dark:text-gray-300">TOTAL AKHIR (NET AMOUNT)</span>
                                <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                    {data.qty_sampai > 0 ? "Berdasarkan Berat Timbangan Pabrik" : "Estimasi Berdasarkan Berat Kirim"}
                                </span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xl">Rp</span>
                                <Input value={new Intl.NumberFormat('id-ID').format(Number(data.grand_total))} readOnly className="pl-12 text-3xl font-bold bg-transparent border-none shadow-none text-indigo-700 h-auto py-2" />
                            </div>

                            {/* Rincian Kecil di Bawah */}
                            <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500 border-t border-indigo-200 pt-3">
                                <div>Harga Karet: Rp {new Intl.NumberFormat('id-ID').format((data.qty_sampai > 0 ? Number(data.qty_sampai) : Number(data.qty_out)) * Number(data.selling_price))}</div>
                                <div>PPH: - Rp {new Intl.NumberFormat('id-ID').format(data.pph_value)}</div>
                                <div>Biaya Lain: - Rp {new Intl.NumberFormat('id-ID').format(Number(data.ob_cost) + Number(data.extra_cost))}</div>
                            </div>
                        </div>

                        {/* 5. LOGISTIK */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
                            <SectionTitle icon={Truck} title="INFO LOGISTIK" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="Metode Kirim">
                                    <StyledSelect value={data.shipping_method} onChange={e => setData('shipping_method', e.target.value)}>
                                        <option value="Trucking">Trucking (Darat)</option>
                                        <option value="Kapal barang">Kapal Barang (Laut)</option>
                                        <option value="Pick-up">Pick-up Sendiri</option>
                                    </StyledSelect>
                                </FormField>
                                <FormField label="PIC / Supir">
                                    <StyledInput value={data.person_in_charge} onChange={e => setData('person_in_charge', e.target.value)} />
                                </FormField>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 pb-12">
                            <Button type='submit' disabled={processing} className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg flex items-center gap-2'>
                                <Save size={20} /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
