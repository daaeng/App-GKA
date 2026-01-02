// ./resources/js/Pages/Incisors/show.tsx

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Banknote, CalendarCheck, CreditCard, MapPin, Scale, Undo2, Wallet } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Penoreh', href: route('incisors.index') },
    { title: 'Detail', href: '#' },
];

// Helper Format
const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

export default function ShowIncisor({ incisor, totalQtyKg, totalQtyKgThisMonth, pendapatanBulanIni, sisaKasbon, dailyData }: any) {
    if (!incisor) return <div className="p-8">Data tidak ditemukan.</div>;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Info: ${incisor.name}`} />
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-50 dark:bg-black min-h-screen">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <Heading title="Detail Profil Penoreh" description="Statistik dan riwayat kerja." />
                    <Link href={route('incisors.index')}><Button variant="outline"><Undo2 className="mr-2 h-4 w-4" /> Kembali</Button></Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Pendapatan Bulan Ini', val: formatCurrency(pendapatanBulanIni || 0), icon: Banknote, color: 'bg-emerald-50 text-emerald-600' },
                        { title: 'Sisa Kasbon', val: formatCurrency(sisaKasbon || 0), icon: Wallet, color: 'bg-red-50 text-red-600' },
                        { title: 'Toreh Bulan Ini', val: `${totalQtyKgThisMonth || 0} Kg`, icon: CalendarCheck, color: 'bg-blue-50 text-blue-600' },
                        { title: 'Total Toreh (Semua)', val: `${totalQtyKg || 0} Kg`, icon: Scale, color: 'bg-purple-50 text-purple-600' }
                    ].map((s, i) => (
                        <Card key={i} className="shadow-sm border-0"><CardContent className="p-6 flex items-center gap-4"><div className={`p-3 rounded-xl ${s.color}`}><s.icon className="w-6 h-6"/></div><div><p className="text-sm text-gray-500">{s.title}</p><p className="text-xl font-bold">{s.val}</p></div></CardContent></Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profil Card */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-0 overflow-hidden h-fit">
                        <div className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-b">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold">{incisor.name.charAt(0)}</div>
                                <span className={`absolute bottom-1 right-1 px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${incisor.is_active ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                                    {incisor.is_active ? 'AKTIF' : 'NON-AKTIF'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold mt-3">{incisor.name}</h2>
                            <p className="text-sm text-gray-500 font-mono">{incisor.no_invoice}</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"><MapPin className="w-3 h-3 mr-1"/> {incisor.lok_toreh}</div>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">NIK</span><span className="font-medium text-sm">{incisor.nik}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Tgl Lahir</span><span className="font-medium text-sm">{formatDate(incisor.ttl)}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Gender</span><span className="font-medium text-sm">{incisor.gender}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Agama</span><span className="font-medium text-sm">{incisor.agama}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Status</span><span className="font-medium text-sm">{incisor.status}</span></div>
                            <div><span className="text-gray-500 text-sm block mb-1">Alamat</span><span className="font-medium text-sm">{incisor.address}</span></div>
                        </div>
                    </div>

                    {/* Table Riwayat */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-5 border-b font-bold text-lg">Riwayat Toreh Harian</div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead><TableHead>Produk</TableHead><TableHead>Kebun</TableHead><TableHead className="text-right">Qty (Kg)</TableHead><TableHead className="text-right">Total (Rp)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dailyData.length > 0 ? dailyData.map((d: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{formatDate(d.tanggal)}</TableCell>
                                            <TableCell>{d.product}</TableCell>
                                            <TableCell><span className="bg-gray-100 px-2 py-1 rounded text-xs">{d.kebun}</span></TableCell>
                                            <TableCell className="text-right font-mono">{d.qty_kg}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(d.total_harga)}</TableCell>
                                        </TableRow>
                                    )) : <TableRow><TableCell colSpan={5} className="text-center h-24 text-gray-500">Belum ada data.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}