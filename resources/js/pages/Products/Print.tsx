import React, { useEffect } from 'react';
// Jika di local error, ganti Head dengan useEffect untuk document.title
// import { Head } from '@inertiajs/react';

// [UPDATED] Interface disamakan persis dengan show.tsx
interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    no_po?: string; // [BARU] Tambahkan field No PO
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
    status: string;
    tgl_kirim: string;
    tgl_sampai: string;
    qty_sampai: number;
    // Field baru dari show.tsx
    customer_name: string;
    pph_value: number;
    ob_cost: number;
    extra_cost: number;
    shipping_method: string;
    person_in_charge: string;
    due_date: string;
}

interface Props {
    product: Product;
    susut_value: number;
}

// Helpers Format
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

export default function PrintProduct({ product, susut_value }: Props) {

    useEffect(() => {
        // Set judul halaman manual untuk browser yang tidak support Head Inertia di preview
        document.title = `Cetak Invoice ${product.no_invoice}`;

        // Otomatis print saat halaman selesai dimuat
        const timer = setTimeout(() => window.print(), 800);
        return () => clearTimeout(timer);
    }, [product.no_invoice]);

    return (
        <div className="bg-white min-h-screen p-8 font-sans text-xs text-black max-w-[210mm] mx-auto print:max-w-full print:p-0 leading-snug">
            {/* Komponen Head Inertia (Opsional jika error di preview) */}
            {/* <Head title={`Cetak Invoice ${product.no_invoice}`} /> */}

            <style>{`
                @media print {
                    @page { margin: 10mm; size: auto; }
                    body { margin: 0; box-shadow: none; }
                    .no-print { display: none; }
                }
            `}</style>

            {/* --- KOP SURAT --- */}
            <div className="text-center border-b-2 border-black pb-3 mb-4">
                <img
                    src="/assets/GKA_no_Tag.png"
                    className="h-16 w-auto mx-auto mb-2 object-contain"
                    alt="Logo GKA"
                />
                <h1 className="text-xl font-bold uppercase tracking-widest text-gray-900">PT. Garuda Karya Amanat</h1>
                <p className="text-xs uppercase tracking-wide mt-1 text-gray-600">Laporan Transaksi Penjualan</p>
            </div>

            {/* --- INFO UTAMA --- */}
            <div className="flex justify-between items-start mb-4 text-xs border-b border-gray-300 pb-4">
                <div className="w-1/2">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-bold text-gray-600 w-24">No. Invoice</td>
                                <td className="font-bold">: {product.no_invoice}</td>
                            </tr>
                            {/* [BARU] Menampilkan No PO */}
                            <tr>
                                <td className="font-bold text-gray-600">No. PO</td>
                                <td className="font-bold uppercase text-blue-900 print:text-black">: {product.no_po || '-'}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-gray-600">Tanggal Nota</td>
                                <td>: {formatDate(product.date)}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-gray-600">Jenis Produk</td>
                                <td className="capitalize">: {product.product}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 text-right">
                    <table className="w-full">
                        <tbody>
                             <tr>
                                <td className="font-bold text-gray-600 text-right">Customer :</td>
                                <td className="font-bold uppercase text-right w-40">{product.customer_name || '-'}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-gray-600 text-right">Supplier Asal :</td>
                                <td className="uppercase text-right">{product.nm_supplier}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- KOLOM DETAIL ITEM & PENGIRIMAN (GRID) --- */}
            <div className="grid grid-cols-2 gap-6 mb-4">

                {/* Kiri: Detail Fisik Barang */}
                <div className="border border-black rounded-sm">
                    <div className="bg-gray-200 border-b border-black p-2 font-bold text-center print:bg-gray-300">
                        DETAIL FISIK BARANG
                    </div>
                    <div className="p-3 space-y-2">
                        <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                            <span className="text-gray-600">Jenis Barang</span>
                            <span className="font-bold">{product.j_brg}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Qty Kirim (Out)</span>
                            <span className="font-medium">{new Intl.NumberFormat('id-ID').format(product.qty_out)} Kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Qty Sampai (Factory)</span>
                            <span className="font-medium">{product.qty_sampai > 0 ? new Intl.NumberFormat('id-ID').format(product.qty_sampai) + ' Kg' : '-'}</span>
                        </div>
                        {susut_value > 0 && (
                            <div className="flex justify-between text-red-600 font-bold print:text-black">
                                <span>Susut</span>
                                <span>({new Intl.NumberFormat('id-ID').format(susut_value)} Kg)</span>
                            </div>
                        )}
                         <div className="flex justify-between border-t border-dashed border-gray-300 pt-1 mt-1">
                            <span className="text-gray-600">Fisik / Kualitas</span>
                            <span className="font-medium">{product.keping_out} Kpg / {product.kualitas_out}</span>
                        </div>
                    </div>
                </div>

                {/* Kanan: Data Pengantaran */}
                <div className="border border-black rounded-sm">
                     <div className="bg-gray-200 border-b border-black p-2 font-bold text-center print:bg-gray-300">
                        DATA PENGANTARAN
                    </div>
                    <div className="p-3 space-y-2">
                         <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                            <span className="text-gray-600">Via Armada</span>
                            <span className="font-bold uppercase">{product.shipping_method || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tgl. Kirim</span>
                            <span>{formatDate(product.tgl_kirim)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-600">Tgl. Sampai</span>
                            <span>{formatDate(product.tgl_sampai)}</span>
                        </div>
                         <div className="flex justify-between border-t border-dashed border-gray-300 pt-1 mt-1">
                            <span className="text-gray-600">Penanggung Jawab</span>
                            <span className="font-bold uppercase">{product.person_in_charge || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RINCIAN KEUANGAN (FULL WIDTH) --- */}
            <div className="border border-black rounded-sm mb-4">
                <div className="bg-gray-200 border-b border-black p-2 font-bold text-center print:bg-gray-300">
                    RINCIAN KEUANGAN
                </div>
                <div className="p-0">
                    <table className="w-full text-xs">
                        <tbody className="divide-y divide-gray-300">
                            <tr>
                                <td className="p-2 pl-4 text-gray-600 w-1/2">Harga Satuan / Kg</td>
                                <td className="p-2 pr-4 text-right font-medium">{formatCurrency(product.price_out)}</td>
                            </tr>
                            <tr>
                                <td className="p-2 pl-4 text-gray-600">PPH 0.25%</td>
                                <td className="p-2 pr-4 text-right text-gray-800">({formatCurrency(product.pph_value || 0)})</td>
                            </tr>
                            <tr>
                                <td className="p-2 pl-4 text-gray-600">Biaya OB</td>
                                <td className="p-2 pr-4 text-right text-gray-800">({formatCurrency(product.ob_cost || 0)})</td>
                            </tr>
                            <tr>
                                <td className="p-2 pl-4 text-gray-600">Biaya Tambahan Lainnya</td>
                                <td className="p-2 pr-4 text-right text-gray-800">({formatCurrency(product.extra_cost || 0)})</td>
                            </tr>
                            <tr className="bg-gray-100 print:bg-gray-200 border-t border-black">
                                <td className="p-3 pl-4 font-bold text-sm uppercase">Total Penjualan (Net)</td>
                                <td className="p-3 pr-4 text-right font-bold text-lg">{formatCurrency(product.amount_out)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- JATUH TEMPO & CATATAN --- */}
            <div className="flex gap-4 mb-6">
                 {product.due_date && (
                    <div className="border border-gray-300 p-2 rounded bg-gray-50 flex-none">
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">Jatuh Tempo Pembayaran</span>
                        <span className="font-bold text-sm text-red-600 print:text-black">{formatDate(product.due_date)}</span>
                    </div>
                 )}
                 {product.desk && (
                    <div className="border border-gray-300 p-2 rounded bg-gray-50 flex-grow">
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">Catatan:</span>
                        <p className="italic text-gray-700">{product.desk}</p>
                    </div>
                 )}
            </div>

            {/* --- AREA TANDA TANGAN --- */}
            <div className="flex justify-between mt-8 pt-4 break-inside-avoid text-xs">
                <div className="text-center w-1/4">
                    <p className="text-[10px] text-gray-500 mb-16 uppercase tracking-wide">Dibuat Oleh,</p>
                    <p className="font-bold border-t border-black pt-1">Admin Gudang</p>
                </div>
                <div className="text-center w-1/4">
                    <p className="text-[10px] text-gray-500 mb-16 uppercase tracking-wide">Pengirim / Driver,</p>
                    <p className="font-bold border-t border-black pt-1">.........................</p>
                </div>
                <div className="text-center w-1/4">
                    <p className="text-[10px] text-gray-500 mb-16 uppercase tracking-wide">Penerima,</p>
                    <p className="font-bold border-t border-black pt-1">{product.customer_name || '.........................'}</p>
                </div>
                <div className="text-center w-1/4">
                    <p className="text-[10px] text-gray-500 mb-16 uppercase tracking-wide">Disetujui Oleh,</p>
                    <p className="font-bold border-t border-black pt-1">Manager Operasional</p>
                </div>
            </div>

            <div className="text-center text-[8px] text-gray-400 mt-8 print:fixed print:bottom-4 print:left-0 print:w-full">
                Dicetak otomatis oleh sistem GKA pada {new Date().toLocaleString('id-ID')} | ID Dokumen: #{product.id}
            </div>
        </div>
    );
}
