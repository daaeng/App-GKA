import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    ArrowLeft, CheckCircle, XCircle, Printer, Pencil,
    Calendar, User, MapPin, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// --- Interfaces ---
interface PpbItem {
    id: number;
    nama_barang: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    harga_total: number;
    keterangan: string;
}

interface PpbHeader {
    id: number;
    tanggal: string;
    nomor: string;
    lampiran: string;
    perihal: string;
    kepada_yth_jabatan: string;
    kepada_yth_nama: string;
    kepada_yth_lokasi: string;
    paragraf_pembuka: string;
    dibuat_oleh_nama: string;
    dibuat_oleh_jabatan: string;
    menyetujui_1_nama: string;
    menyetujui_1_jabatan: string;
    menyetujui_2_nama: string;
    menyetujui_2_jabatan: string;
    grand_total: number;
    grand_total_formatted: string;
    status: 'pending' | 'approved' | 'rejected';
    items: PpbItem[];
}

interface Props {
    ppb: PpbHeader;
    flash?: { message?: string };
}

// --- Helper Components ---
const DetailRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 py-2 border-b border-dashed border-emerald-100 last:border-0">
        <div className="mt-1 p-1.5 bg-emerald-50 rounded text-emerald-600">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</p>
            <p className="text-sm font-medium text-slate-800">{value}</p>
        </div>
    </div>
);

const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

export default function ShowPpb({ ppb }: Props) {
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'PPB', href: route('ppb.index') },
        { title: 'Detail', href: '#' },
    ];

    const handleApproval = (newStatus: 'approved' | 'rejected') => {
        const action = newStatus === 'approved' ? 'MENYETUJUI' : 'MENOLAK';
        if (confirm(`Konfirmasi: Anda yakin ingin mengubah status menjadi ${action}?`)) {
            router.patch(route('ppb.updateStatus', ppb.id), { status: newStatus }, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PPB ${ppb.nomor}`} />

            {/* CSS PRINT FIX - MENGGUNAKAN TEKNIK VISIBILITY */}
            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body {
                        background-color: white !important;
                        visibility: hidden !important;
                    }
                    /* Sembunyikan elemen layout */
                    nav, header, aside, .no-print { display: none !important; }

                    /* Tampilkan hanya area print */
                    .print-area {
                        visibility: visible !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        min-height: 297mm !important;
                        margin: 0 !important;
                        padding: 20mm !important;
                        background: white !important;
                        z-index: 9999 !important;
                        box-shadow: none !important;
                    }
                    /* Pastikan elemen di dalam print-area terlihat */
                    .print-area * {
                        visibility: visible !important;
                    }
                    /* Paksa cetak warna background/gambar */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-emerald-50/30 p-4 md:p-8 font-sans">

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* === LEFT COLUMN: CONTROL PANEL (Sticky) === */}
                    <div className="lg:col-span-1 space-y-6 no-print">

                        {/* Status & Actions Card */}
                        <Card className="border-t-4 border-t-emerald-600 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className={`
                                        ${ppb.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                                        ${ppb.status === 'approved' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''}
                                        ${ppb.status === 'rejected' ? 'bg-rose-100 text-rose-800 hover:bg-rose-100' : ''}
                                        text-xs px-3 py-1 uppercase tracking-wide
                                    `}>
                                        {ppb.status === 'pending' && 'Menunggu Persetujuan'}
                                        {ppb.status === 'approved' && 'Disetujui (Approved)'}
                                        {ppb.status === 'rejected' && 'Ditolak (Rejected)'}
                                    </Badge>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Estimasi</p>
                                        <p className="text-lg font-bold text-emerald-700">{ppb.grand_total_formatted}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {/* TOMBOL AKSI: Selalu Muncul (Revisi Request) */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={() => handleApproval('approved')}
                                        disabled={processing || ppb.status === 'approved'}
                                        size="sm"
                                        className={`w-full ${ppb.status === 'approved' ? 'bg-emerald-800 opacity-50' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2"/> {ppb.status === 'approved' ? 'Sudah ACC' : 'ACC'}
                                    </Button>
                                    <Button
                                        onClick={() => handleApproval('rejected')}
                                        disabled={processing || ppb.status === 'rejected'}
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <XCircle className="w-4 h-4 mr-2"/> {ppb.status === 'rejected' ? 'Ditolak' : 'Tolak'}
                                    </Button>
                                </div>

                                <Separator className="my-2"/>

                                {/* TOMBOL EDIT: Selalu Muncul (Revisi Request) */}
                                <Link href={route('ppb.edit', ppb.id)} className="w-full block">
                                    <Button variant="secondary" className="w-full text-slate-600 bg-slate-100 hover:bg-slate-200">
                                        <Pencil className="w-4 h-4 mr-2"/> Edit Dokumen / Revisi
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Metadata Details */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Informasi Surat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <DetailRow icon={Hash} label="Nomor Surat" value={ppb.nomor} />
                                <DetailRow icon={Calendar} label="Tanggal" value={new Date(ppb.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                <DetailRow icon={User} label="Dibuat Oleh" value={ppb.dibuat_oleh_nama} />
                                <DetailRow icon={MapPin} label="Tujuan" value={ppb.kepada_yth_lokasi} />
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Link href={route('ppb.index')} className="w-full">
                                <Button variant="outline" className="w-full border-slate-300 text-slate-600">
                                    <ArrowLeft className="w-4 h-4 mr-2"/> Kembali
                                </Button>
                            </Link>
                            <Button onClick={() => window.print()} className="w-full bg-emerald-900 text-white hover:bg-emerald-800">
                                <Printer className="w-4 h-4 mr-2"/> Cetak PDF
                            </Button>
                        </div>
                    </div>

                    {/* === RIGHT COLUMN: DOCUMENT PREVIEW (A4) === */}
                    <div className="lg:col-span-2">
                        {/* Container Dokumen A4 */}
                        <div className="print-area bg-white shadow-xl rounded-sm p-[20mm] min-h-[297mm] text-slate-900 relative mx-auto w-full max-w-[210mm] overflow-hidden">

                            {/* --- WATERMARK LOGIC (LAYER 0) --- */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                {/* PENDING */}
                                {ppb.status === 'pending' && (
                                    <div className="border-[10px] border-emerald-100/50 text-emerald-100/50 p-8 rounded-3xl -rotate-45 select-none opacity-60">
                                        <span className="text-[100px] md:text-[120px] font-black tracking-widest uppercase leading-none">
                                            PROSES
                                        </span>
                                    </div>
                                )}

                                {/* REJECTED */}
                                {ppb.status === 'rejected' && (
                                    <div className="border-[10px] border-red-100 text-red-100 p-8 rounded-3xl -rotate-45 select-none opacity-60">
                                        <span className="text-[100px] md:text-[120px] font-black tracking-widest uppercase leading-none">
                                            REJECT
                                        </span>
                                    </div>
                                )}

                                {/* APPROVED (TSA LOGO - TEGAK & BERWARNA) */}
                                {ppb.status === 'approved' && (
                                    <img
                                        src="/assets/TSA.png"
                                        alt="Approved Watermark"
                                        className="w-3/4 opacity-25 select-none"
                                    />
                                )}
                            </div>

                            {/* --- KONTEN SURAT (LAYER 10) --- */}
                            <div className="relative z-10 bg-transparent">

                                {/* KOP SURAT */}
                                <div className="border-b-4 border-emerald-600 pb-4 mb-8 flex justify-between items-end">
                                    <div className="flex items-center gap-4">
                                        <img src="/assets/TSA_polos.png" alt="TSA Logo" className="h-20 w-auto" />
                                        <div>
                                            <h1 className="text-2xl font-black tracking-tighter text-emerald-900 leading-none">TEMADU SEBAYAR AGRO</h1>
                                            {/* <p className="text-xs font-bold tracking-widest text-emerald-600 mt-1 uppercase">General Contractor & Supplier</p> */}
                                        </div>
                                    </div>
                                    <div className="text-right text-[10px] text-slate-600 leading-tight">
                                        <p>Jl. Sudirman No. 59, Ranai Kota</p>
                                        <p>Kab. Natuna, Kep. Riau</p>
                                        <p className="font-mono mt-1 text-emerald-700">ptgarudakaryaamanat@gmail.com</p>
                                    </div>
                                </div>

                                {/* JUDUL */}
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold uppercase underline decoration-2 decoration-emerald-500 underline-offset-4 mb-1 text-emerald-900">Permohonan Pembelian Barang</h2>
                                    <p className="text-sm font-bold text-slate-500">No. {ppb.nomor}</p>
                                </div>

                                {/* HEADER INFO */}
                                <div className="grid grid-cols-2 gap-12 mb-8 text-sm">
                                    <div>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="w-20 font-bold text-slate-500">Lampiran</td>
                                                    <td>: {ppb.lampiran}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-bold text-slate-500">Perihal</td>
                                                    <td className="font-bold text-emerald-800">: {ppb.perihal}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-500 mb-1">Kepada Yth:</p>
                                        <p className="font-bold">{ppb.kepada_yth_nama}</p>
                                        <p>{ppb.kepada_yth_jabatan}</p>
                                        <p className="text-slate-500">{ppb.kepada_yth_lokasi}</p>
                                    </div>
                                </div>

                                {/* PARAGRAF PEMBUKA */}
                                <div className="mb-6 text-sm leading-relaxed text-justify">
                                    {ppb.paragraf_pembuka || "Dengan hormat, sehubungan dengan kebutuhan operasional perusahaan, bersama ini kami mengajukan permohonan pembelian barang/jasa dengan rincian sebagai berikut:"}
                                </div>

                                {/* TABEL BARANG */}
                                <div className="mb-8">
                                    <table className="w-full text-sm border-collapse border border-emerald-600">
                                        <thead>
                                            <tr className="bg-emerald-700 text-white text-xs uppercase tracking-wider">
                                                <th className="py-2 px-3 border border-emerald-600 w-10 text-center">No</th>
                                                <th className="py-2 px-3 border border-emerald-600 text-left">Nama Barang / Jasa</th>
                                                <th className="py-2 px-3 border border-emerald-600 w-16 text-center">Qty</th>
                                                <th className="py-2 px-3 border border-emerald-600 w-16 text-center">Sat</th>
                                                <th className="py-2 px-3 border border-emerald-600 text-right w-28">Harga</th>
                                                <th className="py-2 px-3 border border-emerald-600 text-right w-32">Total</th>
                                            </tr>
                                        </thead>
                                        {/* BG TRANSPARENT AGAR WATERMARK TERLIHAT */}
                                        <tbody className="bg-transparent">
                                            {ppb.items.map((item, idx) => (
                                                <tr key={item.id} className="border-b border-emerald-200">
                                                    <td className="py-2 px-3 border-r border-emerald-200 text-center">{idx + 1}</td>
                                                    <td className="py-2 px-3 border-r border-emerald-200 font-medium">
                                                        {item.nama_barang}
                                                        {item.keterangan && item.keterangan !== '-' && (
                                                            <div className="text-[10px] text-emerald-600 italic mt-0.5">{item.keterangan}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-3 border-r border-emerald-200 text-center">{item.jumlah}</td>
                                                    <td className="py-2 px-3 border-r border-emerald-200 text-center uppercase text-xs">{item.satuan}</td>
                                                    <td className="py-2 px-3 border-r border-emerald-200 text-right whitespace-nowrap">{formatCurrency(item.harga_satuan)}</td>
                                                    <td className="py-2 px-3 text-right font-bold whitespace-nowrap text-emerald-800">{formatCurrency(item.harga_total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-emerald-50/50 font-bold border-t-2 border-emerald-600">
                                                <td colSpan={5} className="py-2 px-3 border-r border-emerald-600 text-right uppercase text-xs text-emerald-900">Total Estimasi</td>
                                                <td className="py-2 px-3 text-right text-emerald-900">{ppb.grand_total_formatted}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="mb-8 text-sm">
                                    Demikian surat permohonan ini kami sampaikan. Atas perhatian dan persetujuannya, kami ucapkan terima kasih.
                                </div>

                                {/* TANDA TANGAN */}
                                <div className="flex justify-end mb-4 pr-12 text-sm text-slate-700">
                                    <p>Natuna, {new Date(ppb.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                    <div>
                                        <p className="mb-16 font-medium text-slate-600">Dibuat Oleh,</p>
                                        <p className="font-bold underline uppercase text-slate-900">{ppb.dibuat_oleh_nama}</p>
                                        <p className="text-xs text-slate-500">{ppb.dibuat_oleh_jabatan}</p>
                                    </div>
                                    <div>
                                        <p className="mb-16 font-medium text-slate-600">Mengetahui,</p>
                                        <p className="font-bold underline uppercase text-slate-900">{ppb.menyetujui_1_nama || '(....................)'}</p>
                                        <p className="text-xs text-slate-500">{ppb.menyetujui_1_jabatan}</p>
                                    </div>
                                    <div>
                                        <p className="mb-16 font-medium text-slate-600">Menyetujui,</p>
                                        <p className="font-bold underline uppercase text-slate-900">{ppb.menyetujui_2_nama || '(....................)'}</p>
                                        <p className="text-xs text-slate-500">{ppb.menyetujui_2_jabatan}</p>
                                    </div>
                                </div>

                                {/* PRINT FOOTER */}
                                <div className="absolute -bottom-5 left-0 w-full text-center hidden print:block">
                                    <p className="text-[7px] text-emerald-600 uppercase tracking-widest font-semibold">Dokumen ini sah dan dicetak oleh sistem TEMADU SEBAYAR AGRO</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
