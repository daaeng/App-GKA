import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import Tag from '@/components/ui/tag';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Printer, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';

// Tipe data harus sesuai dengan data dari controller
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
    status: 'pending' | 'approved' | 'rejected';
    items: PpbItem[];
}

interface Props {
    ppb: PpbHeader;
    flash?: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PPB', href: route('ppb.index') },
    { title: 'Detail PPB' },
];

// Komponen untuk format tanda tangan
const SignatureColumn: React.FC<{ title: string; name: string; role: string }> = ({ title, name, role }) => (
    <div className="text-center">
        <p className="mb-16">{title}</p> {/* Jarak tanda tangan diatur disini */}
        <p className="font-bold underline uppercase">{name}</p>
        <p>{role}</p>
    </div>
);

export default function ShowPpb({ ppb, flash }: Props) {
    const [processing, setProcessing] = useState(false);
    // @ts-ignore: Mengambil 'errors' dari 'usePage' yang mungkin tidak memiliki tipe spesifik
    const { errors } = usePage().props;

    const handleApproval = (newStatus: 'approved' | 'rejected') => {
        const confirmationText = newStatus === 'approved' 
            ? 'Apakah Anda yakin ingin MENYETUJUI pengajuan ini?'
            : 'Apakah Anda yakin ingin MENOLAK pengajuan ini?';
        
        if (window.confirm(confirmationText)) {
            router.patch(route('ppb.updateStatus', ppb.id), {
                status: newStatus,
            }, {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        }
    };
    
    // Format tanggal
    const formattedDate = new Date(ppb.tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const displayDate = `Ranai, ${formattedDate}`;

    // Format mata uang
    const formatCurrency = (value: number | undefined | null) => {
        const num = Number(value);
        if (!num || isNaN(num) || num === 0) {
            return '-';
        }
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    // Fungsi print
    const handlePrint = () => {
        window.print();
    };

    // Watermark status
    const StatusWatermark = () => {
        // if (ppb.status === 'pending') return null;
        if (ppb.status === 'pending') {
            const text = 'PROSES';
            const color = 'text-yellow-500';
            return (
                <div className={`absolute inset-0 flex items-center justify-center print:flex hidden print-watermark pointer-events-none`}>
                    <span className={`text-8xl font-black ${color} opacity-20 rotate-[-30deg] border-4 ${color} border-dashed p-8`}>
                        {text}
                    </span>
                </div>
            );
        }

        if (ppb.status === 'approved') {
            return (
                <div className={`absolute inset-0 flex items-center justify-center print:flex hidden print-watermark pointer-events-none`}>
                    <img 
                        src="/TSA.png" 
                        alt="Disetujui" 
                        className="w-[90%] opacity-30" // Ukuran watermark
                    />
                </div>
            );
        }

        if (ppb.status === 'rejected') {
            const text = 'DITOLAK';
            const color = 'text-red-500';
            return (
                <div className={`absolute inset-0 flex items-center justify-center print:flex hidden print-watermark pointer-events-none`}>
                    <span className={`text-8xl font-black ${color} opacity-20 rotate-[-30deg] border-4 ${color} border-dashed p-8`}>
                        {text}
                    </span>
                </div>
            );
        }
        
        return null;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}> 
            <Head title={`Detail PPB ${ppb.nomor}`}>
                <style>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 1cm 1.5cm; /* Margin kertas lebih tipis agar muat 1 halaman */
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            font-size: 12pt; /* Base font size untuk print */
                        }
                        
                        /* Reset visibility */
                        body * { visibility: hidden; }
                        #surat-ppb, #surat-ppb * { visibility: visible; }

                        /* Positioning */
                        #surat-ppb {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            margin: 0;
                            padding: 0;
                            box-shadow: none;
                        }
                        
                        .print-watermark { display: flex !important; }
                    }
                `}</style>
            </Head>

            <div className="p-4 md:p-6"> 
                {/* Panel Approval (Hanya Pending) */}
                {ppb.status === 'pending' && (
                    <div className="mb-6 p-6 rounded-2xl border border-yellow-500 bg-yellow-900/50 print:hidden">
                        <h3 className="text-xl font-bold text-yellow-300 mb-4">Tindakan Persetujuan</h3>
                        <p className="text-yellow-200 mb-6">
                            Pengajuan ini sedang menunggu persetujuan Anda.
                        </p>
                        {/* @ts-ignore */}
                        {errors.status && <p className="text-red-600 mb-4 font-bold">{errors.status}</p>}
                        <div className="flex gap-4">
                            <Button onClick={() => handleApproval('approved')} disabled={processing} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                                <ThumbsUp className="mr-2 h-4 w-4" /> Setujui (ACC)
                            </Button>
                            <Button onClick={() => handleApproval('rejected')} disabled={processing} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                                <ThumbsDown className="mr-2 h-4 w-4" /> Tolak
                            </Button>
                        </div>
                    </div>
                )}

                {/* Flash Message */}
                {flash?.message && (
                    <Alert className="mb-4 bg-green-900/50 border-green-500 text-green-300 print:hidden">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Berhasil!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Header UI (Tombol & Judul) */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <div>
                        <Heading title="Detail Pengajuan Barang" description={`Nomor ${ppb.nomor}`} />
                        <div className="mt-2"><Tag status={ppb.status} /></div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint} className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500">
                            <Printer className="mr-2 h-4 w-4" /> Cetak
                        </Button>
                        <Link href={route('ppb.index')}>
                            <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* --- AREA SURAT (Settingan agar muat 1 Halaman) --- */}
                {/* Gunakan text-sm (approx 14px) untuk seluruh surat agar compact */}
                <div id="surat-ppb" className="relative max-w-4xl mx-auto bg-white text-black p-8 md:p-10 shadow-2xl rounded-lg text-sm leading-tight">
                    
                    {/* Logo Kiri Atas (Hanya Print) - Posisi Absolute agar tidak makan tempat */}
                    <div className="hidden print:block top-8 left-8">
                        <img src="/TSA.png" alt="Logo" className="w-40" />
                    </div>
                    
                    <StatusWatermark />

                    {/* Tanggal Surat */}
                    <div className="flex justify-end mb-6 print:-mt-3">
                        <p>{displayDate}</p>
                    </div>

                    {/* Info Surat - Menggunakan Grid untuk kerapian */}
                    <div className="mb-6 pl-0 print:pl-0 md:pl-0">
                        {/* Padding kiri dikosongkan agar rata dengan logo jika logo absolute, atau sesuaikan layout */}
                        <table className="border-collapse border-none w-auto">
                            <tbody>
                                <tr>
                                    <td className="w-24 py-0.5 align-top">Nomor</td>
                                    <td className="py-0.5 align-top">: {ppb.nomor}</td>
                                </tr>
                                <tr>
                                    <td className="w-24 py-0.5 align-top">Lampiran</td>
                                    <td className="py-0.5 align-top">: {ppb.lampiran}</td>
                                </tr>
                                <tr>
                                    <td className="w-24 py-0.5 align-top">Perihal</td>
                                    <td className="py-0.5 align-top font-bold">: {ppb.perihal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Tujuan */}
                    <div className="mb-6">
                        <p>Kepada Yth.</p>
                        <p className="font-bold ml-8">{ppb.kepada_yth_jabatan}</p>
                        <p className="font-bold ml-8">{ppb.kepada_yth_nama}</p>
                        <p>di -</p>
                        <p className='ml-8'>Tempat</p>
                    </div>

                    {/* Pembuka */}
                    <div className="mb-4">
                        <p className="mb-2">Dengan Hormat,</p>
                        <p className="whitespace-pre-line text-justify leading-relaxed">{ppb.paragraf_pembuka}</p>
                    </div>

                    {/* Tabel Item - Padding cell diperkecil (py-1) */}
                    <div className="my-4">
                        <table className="w-full border-collapse border border-black text-xs md:text-sm">
                            <thead>
                                <tr className="bg-red-300 font-bold text-center">
                                    <th className="border border-black py-1 px-2 w-[5%]">No.</th>
                                    <th className="border border-black py-1 px-2 w-[30%]">Nama Barang</th>
                                    <th className="border border-black py-1 px-2 w-[10%]">Qty</th>
                                    <th className="border border-black py-1 px-2 w-[10%]">Satuan</th>
                                    <th className="border border-black py-1 px-2 w-[15%]">Harga Satuan</th>
                                    <th className="border border-black py-1 px-2 w-[15%]">Total</th>
                                    <th className="border border-black py-1 px-2 w-[15%]">Ket</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ppb.items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-black">
                                        <td className="border border-black py-1 px-2 text-center">{index + 1}</td>
                                        <td className="border border-black py-1 px-2">{item.nama_barang}</td>
                                        <td className="border border-black py-1 px-2 text-center">{item.jumlah}</td>
                                        <td className="border border-black py-1 px-2 text-center">{item.satuan}</td>
                                        <td className="border border-black py-1 px-2 text-right whitespace-nowrap">{formatCurrency(item.harga_satuan)}</td>
                                        <td className="border border-black py-1 px-2 text-right whitespace-nowrap">{formatCurrency(item.harga_total)}</td>
                                        <td className="border border-black py-1 px-2">{item.keterangan}</td>
                                    </tr>
                                ))}
                                <tr className="bg-yellow-300 font-bold">
                                    <td colSpan={5} className="border border-black py-1 px-2 text-center">Grand Total</td>
                                    <td className="border border-black py-1 px-2 text-right whitespace-nowrap">{formatCurrency(ppb.grand_total)}</td>
                                    <td className="border border-black py-1 px-2 bg-yellow-300"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mb-8">
                        Demikian surat permohonan ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
                    </p>

                    {/* Tanda Tangan - Grid Layout */}
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <SignatureColumn title="Dibuat Oleh," name={ppb.dibuat_oleh_nama} role={ppb.dibuat_oleh_jabatan} />
                        <SignatureColumn title="Mengetahui," name={ppb.menyetujui_1_nama} role={ppb.menyetujui_1_jabatan} />
                        <SignatureColumn title="Menyetujui," name={ppb.menyetujui_2_nama} role={ppb.menyetujui_2_jabatan} />
                    </div>

                    {/* Footer Alamat */}
                    <div className="print:block hidden pt-4 mt-8 border-t border-gray-400 text-center text-[10px] text-gray-600">
                        <p className="font-bold text-black">Office Address</p>
                        <p>Jl. Sudirman, No. 59, Ranai Kota, Kab. Natuna, Kep. Riau - Indonesia</p>
                        <p>(Ruko Kuning, Lt 2)</p>
                        <p className="font-bold text-black">Contact. 0857 8894 0801</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}