import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface PayrollItem {
    id: number;
    deskripsi: string;
    tipe: 'pendapatan' | 'potongan';
    jumlah: number;
}

interface PayrollData {
    id: number;
    payroll_period: string;
    total_pendapatan: number;
    total_potongan: number;
    gaji_bersih: number;
    status: string;
    employee: {
        name: string;
        employee_id: string;
        position: string;
    };
    items: PayrollItem[]; // Rincian item gaji
}

export default function Show({ payroll }: { payroll: PayrollData }) {
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    
    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const handlePrint = () => window.print();

    const pendapatanItems = payroll.items.filter(item => item.tipe === 'pendapatan');
    const potonganItems = payroll.items.filter(item => item.tipe === 'potongan');

    return (
        <AppLayout>
            <Head title={`Slip Gaji - ${payroll.employee.name}`} />

            <div className="mt-2 max-w-2xl mx-auto bg-white dark:bg-transparent dark:border-2 p-8 rounded-lg shadow-lg print:shadow-none">
                <div className='grid grid-cols-4 border-b pb-4 mb-4'>
                    <img src="/assets/GKA_no_Tag.png" alt="GKA Logo" className="w-25 h-25 object-contain" />
                    <div className="text-center col-span-3">
                        <h1 className="text-2xl font-bold">SLIP GAJI</h1>
                        <h2>PT. Garuda Karya Amanat</h2>
                        <p className="text-gray-600">Periode: {formatPeriod(payroll.payroll_period)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="font-semibold">{payroll.employee.name}</p>
                        <p className="text-sm text-gray-500">{payroll.employee.position}</p>
                        <p className="text-sm text-gray-500">NIP: {payroll.employee.employee_id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tanggal Cetak</p>
                        <p className="font-semibold">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Pendapatan */}
                    <div>
                        <h3 className="font-semibold border-b mb-2 pb-1">Pendapatan</h3>
                        {pendapatanItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <p>{item.deskripsi}</p>
                                <p>{formatCurrency(item.jumlah)}</p>
                            </div>
                        ))}
                        <div className="flex justify-between font-semibold border-t mt-2 pt-1">
                            <p>Total Pendapatan</p>
                            <p>{formatCurrency(payroll.total_pendapatan)}</p>
                        </div>
                    </div>

                    {/* Potongan */}
                    <div>
                        <h3 className="font-semibold border-b mb-2 pb-1">Potongan</h3>
                        {potonganItems.map(item => (
                             <div key={item.id} className="flex justify-between text-sm">
                                <p>{item.deskripsi}</p>
                                <p className="text-red-600">- {formatCurrency(item.jumlah)}</p>
                            </div>
                        ))}
                        <div className="flex justify-between font-semibold border-t mt-2 pt-1">
                            <p>Total Potongan</p>
                            <p className="text-red-600">- {formatCurrency(payroll.total_potongan)}</p>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <p>GAJI BERSIH (Take Home Pay)</p>
                            <p>{formatCurrency(payroll.gaji_bersih)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 text-center print:hidden">
                    <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                        Cetak Slip Gaji
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
