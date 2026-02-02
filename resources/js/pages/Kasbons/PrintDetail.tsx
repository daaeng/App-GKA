import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';

// --- INTERFACES ---
interface Owner {
    name: string;
    identifier: string;
}

interface Transaction {
    id: string;
    date_formatted: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

interface PageProps {
    owner: Owner;
    history: Transaction[];
    printDate: string;
}

// Helper untuk format mata uang
const formatCurrency = (value: number): string => {
    if (isNaN(value) || value === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function PrintDetail({ owner, history, printDate } : PageProps ) {
    // Trigger dialog print secara otomatis saat komponen dimuat
    useEffect(() => {
        window.print();
    }, []);

    const finalBalance = history && history.length > 0 ? history[history.length - 1].balance : 0;

    return (
        <>
            <Head title={`Cetak Rincian Kasbon - ${owner.name}`} />

            {/* [UBAH] Padding halaman dikurangi sedikit (p-8 -> p-6) */}
            <div className="p-6 font-sans bg-white text-gray-800">

                {/* --- KOP SURAT / HEADER --- */}
                {/* [UBAH] Margin bawah dikurangi (mb-8 -> mb-4) */}
                <header className="mb-4 text-center border-b border-gray-800 pb-2">
                    <img src="/assets/GKA_no_Tag.png" alt="GKA Logo" className="w-20 mx-auto mb-1 h-auto object-contain" />
                    {/* [UBAH] Font Title diperkecil (text-2xl -> text-xl) */}
                    <h1 className="text-xl font-bold uppercase">PT. Garuda Karya Amanat</h1>
                    {/* [UBAH] Font Subtitle diperkecil (text-sm -> text-xs) */}
                    <p className="text-xs">Laporan Rincian Transaksi Kasbon</p>
                </header>

                {/* --- INFORMASI PEMILIK KASBON --- */}
                <section className="mb-4">
                    {/* [UBAH] Font Info diperkecil (text-sm -> text-xs) */}
                    <div className="grid grid-cols-3 gap-x-4 text-xs">
                        <div>
                            <p className="font-bold text-gray-500 uppercase">Nama</p>
                            <p className="font-semibold">{owner.name}</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-500 uppercase">{owner.identifier.split(':')[0]}</p>
                            <p>{owner.identifier.split(':')[1]}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-500 uppercase">Tanggal Cetak</p>
                            <p>{printDate}</p>
                        </div>
                    </div>
                </section>

                {/* --- TABEL TRANSAKSI --- */}
                <main>
                    {/* [UBAH] Font Tabel diperkecil (text-sm -> text-xs) */}
                    <table className="w-full text-xs border-collapse border border-gray-400">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                {/* [UBAH] Padding sel diperkecil (p-2 -> p-1) */}
                                <th className="p-1 border border-gray-300 w-[15%]">Tanggal</th>
                                <th className="p-1 border border-gray-300">Keterangan</th>
                                <th className="p-1 border border-gray-300 text-right w-[15%]">Debit (Pinjaman)</th>
                                <th className="p-1 border border-gray-300 text-right w-[15%]">Kredit (Pembayaran)</th>
                                <th className="p-1 border border-gray-300 text-right w-[15%]">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && history.length > 0 ? history.map((tx) => (
                                <tr key={tx.id} className="border-b border-gray-300">
                                    {/* [UBAH] Padding sel diperkecil (p-2 -> p-1) */}
                                    <td className="p-1 border-r border-gray-300 whitespace-nowrap">{tx.date_formatted}</td>
                                    <td className="p-1 border-r border-gray-300">{tx.description}</td>
                                    <td className="p-1 border-r border-gray-300 text-right">{tx.debit > 0 ? formatCurrency(tx.debit) : '-'}</td>
                                    <td className="p-1 border-r border-gray-300 text-right">{tx.credit > 0 ? formatCurrency(tx.credit) : '-'}</td>
                                    <td className="p-1 text-right font-semibold">{formatCurrency(tx.balance)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">Tidak ada riwayat transaksi.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-gray-50">
                                {/* [UBAH] Padding footer diperkecil (p-2 -> p-1) */}
                                <td colSpan={4} className="p-1 text-right border border-gray-300">Sisa Saldo Akhir:</td>
                                <td className="p-1 text-right border border-gray-300">{formatCurrency(finalBalance)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </main>

                {/* Footer Halaman Cetak */}
                <div className="mt-4 text-[10px] text-gray-400 text-center italic print:fixed print:bottom-4 print:left-0 print:w-full">
                    Dokumen ini dicetak otomatis oleh sistem GKA Management.
                </div>

            </div>
        </>
    );
}
