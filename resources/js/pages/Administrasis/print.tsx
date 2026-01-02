import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

// --- Interface Data (Sama dengan index.tsx) ---
interface FinancialReport {
    bank: {
        in_penjualan: number; in_lainnya: number; out_gaji: number; out_kapal: number; out_truck: number; out_hutang: number; out_penarikan: number; total_in: number; total_out: number; balance: number;
    };
    kas: {
        in_penarikan: number; out_lapangan: number; out_kantor: number; out_bpjs: number; out_belikaret: number; out_kasbon_pegawai: number; out_kasbon_penoreh: number; total_in: number; total_out: number; balance: number;
    };
    profit_loss: { revenue: number; cogs: number; gross_profit: number; opex: number; net_profit: number; };
    neraca: { assets: { kas_period: number; bank_period: number; piutang: number; inventory_value: number; }; liabilities: { hutang_dagang: number; } }
}

interface PageProps {
    summary: { reports: FinancialReport };
    printType: 'all' | 'bank' | 'kas' | 'profit_loss' | 'neraca';
    currentMonth: number;
    currentYear: number;
}

// Helper Format
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const PrintPage = ({ summary, printType, currentMonth, currentYear }: PageProps) => {
    
    useEffect(() => {
        // Otomatis trigger print saat halaman dimuat
        setTimeout(() => window.print(), 500);
    }, []);

    const ReportRow = ({ label, value, isMinus = false, isBold = false }: { label: string, value: number, isMinus?: boolean, isBold?: boolean }) => (
        <div className={`flex justify-between items-center text-sm py-1 border-b border-dashed border-gray-300 ${isBold ? 'font-bold' : ''}`}>
            <span>{label}</span>
            <span className={isMinus ? 'text-red-600' : ''}>
                {isMinus ? '-' : ''} {formatCurrency(value || 0)}
            </span>
        </div>
    );

    const getMonthName = (month: number) => new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' });

    const Header = ({ title }: { title: string }) => (
        <div className="text-center mb-6">
            <h1 className="text-xl font-bold uppercase">{title}</h1>
            <p className="text-sm text-gray-600">Periode: {getMonthName(currentMonth)} {currentYear}</p>
        </div>
    );

    return (
        <div className="bg-white text-black p-8 min-h-screen font-sans">
            <Head title="Cetak Laporan" />
            
            {/* Kop Surat Sederhana */}
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">GARUDA KARYA AMANAT</h2>
                    <p className="text-sm">Laporan Keuangan & Administrasi</p>
                </div>
                <div className="text-right text-xs">
                    <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. LAPORAN BANK */}
                {(printType === 'all' || printType === 'bank') && (
                    <section className="break-inside-avoid">
                        <Header title="Laporan Arus Bank" />
                        <div className="border border-gray-400 p-4 rounded-sm">
                            <h3 className="font-bold border-b border-gray-400 pb-2 mb-2">PEMASUKAN</h3>
                            <ReportRow label="Penjualan Karet (Buyer)" value={summary.reports.bank.in_penjualan} />
                            <ReportRow label="Pemasukan Lain (Investasi/Modal)" value={summary.reports.bank.in_lainnya} />
                            <div className="flex justify-between font-bold mt-2"><span>Total Masuk</span><span>{formatCurrency(summary.reports.bank.total_in)}</span></div>

                            <h3 className="font-bold border-b border-gray-400 pb-2 mb-2 mt-6">PENGELUARAN</h3>
                            <ReportRow label="Pembayaran Gaji (Payroll)" value={summary.reports.bank.out_gaji} isMinus />
                            <ReportRow label="Pembayaran Kapal" value={summary.reports.bank.out_kapal} isMinus />
                            <ReportRow label="Pembayaran Truck" value={summary.reports.bank.out_truck} isMinus />
                            <ReportRow label="Bayar Hutang" value={summary.reports.bank.out_hutang} isMinus />
                            <ReportRow label="Penarikan Tunai (Ke Kas)" value={summary.reports.bank.out_penarikan} isMinus />
                            <div className="flex justify-between font-bold mt-2"><span>Total Keluar</span><span>{formatCurrency(summary.reports.bank.total_out)}</span></div>

                            <div className="bg-gray-100 p-2 mt-4 flex justify-between font-bold text-lg border-t-2 border-black">
                                <span>SALDO AKHIR (Periode Ini)</span>
                                <span>{formatCurrency(summary.reports.bank.balance)}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. LAPORAN KAS */}
                {(printType === 'all' || printType === 'kas') && (
                    <section className="break-inside-avoid">
                        <Header title="Laporan Arus Kas Tunai" />
                        <div className="border border-gray-400 p-4 rounded-sm">
                            <h3 className="font-bold border-b border-gray-400 pb-2 mb-2">PEMASUKAN</h3>
                            <ReportRow label="Penarikan dari Bank" value={summary.reports.kas.in_penarikan} />
                            <div className="flex justify-between font-bold mt-2"><span>Total Masuk</span><span>{formatCurrency(summary.reports.kas.total_in)}</span></div>

                            <h3 className="font-bold border-b border-gray-400 pb-2 mb-2 mt-6">PENGELUARAN</h3>
                            <ReportRow label="Operasional Lapangan" value={summary.reports.kas.out_lapangan} isMinus />
                            <ReportRow label="Operasional Kantor" value={summary.reports.kas.out_kantor} isMinus />
                            <ReportRow label="BPJS Ketenagakerjaan" value={summary.reports.kas.out_bpjs} isMinus />
                            <ReportRow label="Pembelian Karet (Tunai)" value={summary.reports.kas.out_belikaret} isMinus />
                            <ReportRow label="Kasbon Pegawai Kantor" value={summary.reports.kas.out_kasbon_pegawai} isMinus />
                            <ReportRow label="Kasbon Penoreh" value={summary.reports.kas.out_kasbon_penoreh} isMinus />
                            <div className="flex justify-between font-bold mt-2"><span>Total Keluar</span><span>{formatCurrency(summary.reports.kas.total_out)}</span></div>

                            <div className="bg-gray-100 p-2 mt-4 flex justify-between font-bold text-lg border-t-2 border-black">
                                <span>SISA KAS (Periode Ini)</span>
                                <span>{formatCurrency(summary.reports.kas.balance)}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. LABA RUGI */}
                {(printType === 'all' || printType === 'profit_loss') && (
                    <section className="break-inside-avoid">
                        <Header title="Laporan Laba Rugi" />
                        <div className="border border-gray-400 p-4 rounded-sm space-y-2">
                            <ReportRow label="Total Pendapatan (Revenue)" value={summary.reports.profit_loss.revenue} />
                            <ReportRow label="Harga Pokok Penjualan (HPP)" value={summary.reports.profit_loss.cogs} isMinus />
                            <div className="flex justify-between font-bold border-t border-black pt-2"><span>LABA KOTOR</span><span>{formatCurrency(summary.reports.profit_loss.gross_profit)}</span></div>
                            
                            <div className="my-4"></div>
                            <ReportRow label="Biaya Operasional (OpEx)" value={summary.reports.profit_loss.opex} isMinus />
                            
                            <div className="bg-gray-100 p-2 mt-4 flex justify-between font-bold text-lg border-t-2 border-black">
                                <span>LABA BERSIH (Net Profit)</span>
                                <span>{formatCurrency(summary.reports.profit_loss.net_profit)}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. NERACA */}
                {(printType === 'all' || printType === 'neraca') && (
                    <section className="break-inside-avoid">
                        <Header title="Neraca (Posisi Keuangan)" />
                        <div className="border border-gray-400 p-4 rounded-sm">
                            <h3 className="font-bold border-b border-gray-400 pb-2 mb-2">ASET (HARTA)</h3>
                            <ReportRow label="Saldo Kas (Akumulasi)" value={summary.reports.neraca.assets.kas_period} />
                            <ReportRow label="Saldo Bank (Akumulasi)" value={summary.reports.neraca.assets.bank_period} />
                            <ReportRow label="Piutang Pegawai" value={summary.reports.neraca.assets.piutang} />
                            <div className="bg-gray-100 p-2 mt-4 flex justify-between font-bold text-lg border-t-2 border-black">
                                <span>TOTAL ASET</span>
                                <span>{formatCurrency(summary.reports.neraca.assets.kas_period + summary.reports.neraca.assets.bank_period + summary.reports.neraca.assets.piutang)}</span>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Footer Tanda Tangan */}
            <div className="mt-12 flex justify-between text-center break-inside-avoid">
                <div className="w-1/3">
                    <p className="mb-20">Dibuat Oleh,</p>
                    <p className="font-bold underline">( Admin Keuangan )</p>
                </div>
                <div className="w-1/3">
                    <p className="mb-20">Disetujui Oleh,</p>
                    <p className="font-bold underline">( Pimpinan )</p>
                </div>
            </div>
        </div>
    );
};

export default PrintPage;