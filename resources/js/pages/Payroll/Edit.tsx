import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

// Tipe data yang diterima dari controller
interface PayrollEditData {
    id: number;
    status: 'draft' | 'final' | 'paid';
    payroll_period: string;
    employee_name: string;
    gaji_pokok: number;
    hari_hadir: number;
    insentif: number;
    potongan_kasbon: number;
}

interface EditPageProps {
    payroll: PayrollEditData;
    uang_makan_harian: number;
}

const formatCurrency = (value: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export default function Edit({ payroll, uang_makan_harian }: EditPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        // { title: 'Dashboard', href: route('dashboard') },
        { title: 'Penggajian', href: route('payroll.index') },
        { title: 'Edit Rincian Gaji', href: '#' },
    ];
    
    const { data, setData, put, processing} = useForm({
        status: payroll.status,
        gaji_pokok: payroll.gaji_pokok,
        hari_hadir: payroll.hari_hadir,
        insentif: payroll.insentif,
        potongan_kasbon: payroll.potongan_kasbon,
        uang_makan_harian: uang_makan_harian,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('payroll.update', payroll.id));
    };

    // Kalkulasi otomatis untuk tampilan
    const calculated = useMemo(() => {
        const subtotalGajiPokok = Number(data.gaji_pokok);
        const subtotalUangMakan = Number(data.hari_hadir) * Number(data.uang_makan_harian);
        const subtotalInsentif = Number(data.insentif);
        const totalPendapatan = subtotalGajiPokok + subtotalUangMakan + subtotalInsentif;
        const totalPotongan = Number(data.potongan_kasbon);
        const gajiBersih = totalPendapatan - totalPotongan;
        return { subtotalGajiPokok, subtotalUangMakan, totalPendapatan, totalPotongan, gajiBersih };
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Gaji - ${payroll.employee_name}`} />
            <div className="flex justify-center items-start p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Rincian Gaji</CardTitle>
                            <CardDescription>
                                Untuk karyawan: <span className="font-semibold">{payroll.employee_name}</span> | 
                                Periode: <span className="font-semibold">{new Date(payroll.payroll_period + '-02').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kolom Kiri: Input Form */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Komponen Pendapatan</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 items-center">
                                            <Label htmlFor="gaji_pokok">Gaji Pokok</Label>
                                            <Input id="gaji_pokok" type="number" value={data.gaji_pokok} onChange={e => setData('gaji_pokok', Number(e.target.value))} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 items-center">
                                            <Label htmlFor="hari_hadir">Hari Hadir</Label>
                                            <Input id="hari_hadir" type="number" value={data.hari_hadir} onChange={e => setData('hari_hadir', Number(e.target.value))} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 items-center">
                                            <Label htmlFor="insentif">Insentif / Bonus</Label>
                                            <Input id="insentif" type="number" value={data.insentif} onChange={e => setData('insentif', Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Komponen Potongan</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 items-center">
                                            <Label htmlFor="potongan_kasbon">Potongan Kasbon</Label>
                                            <Input id="potongan_kasbon" type="number" value={data.potongan_kasbon} onChange={e => setData('potongan_kasbon', Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Status Pembayaran</h3>
                                    <Select value={data.status} onValueChange={(value: 'draft' | 'final' | 'paid') => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="final">Final</SelectItem>
                                            <SelectItem value="paid">Dibayar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Kolom Kanan: Rincian Kalkulasi */}
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
                                <h3 className="text-lg font-medium text-center mb-4">Rincian Gaji</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Subtotal Gaji Pokok</span>
                                        <span className="font-medium">{formatCurrency(calculated.subtotalGajiPokok)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Subtotal Uang Makan ({data.hari_hadir} hari)</span>
                                        <span className="font-medium">{formatCurrency(calculated.subtotalUangMakan)}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Insentif / Bonus</span>
                                        <span className="font-medium">{formatCurrency(data.insentif)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total Pendapatan</span>
                                        <span>{formatCurrency(calculated.totalPendapatan)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm pt-4">
                                     <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Potongan Kasbon</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(calculated.totalPotongan)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total Potongan</span>
                                        <span className="text-red-600">-{formatCurrency(calculated.totalPotongan)}</span>
                                    </div>
                                </div>
                                <div className="border-t-2 border-dashed pt-4 mt-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Gaji Bersih</span>
                                        <span className="text-indigo-600 dark:text-emerald-500">{formatCurrency(calculated.gajiBersih)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 mt-4">
                            <Link href={route('payroll.index')}>
                                <Button variant="outline" type="button">Batal</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
