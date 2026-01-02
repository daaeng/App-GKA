import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Undo2, Loader2, FileSignature, Info, AlertCircle } from 'lucide-react';
import Heading from '../../components/heading';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import AppLayout from '../../layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { cn } from '../../lib/utils';
import { type BreadcrumbItem } from '../../types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: route('kasbons.index') },
    { title: 'Tambah Kasbon Pegawai', href: route('kasbons.create_pegawai') },
];

interface EmployeeOption {
    id: number;
    label: string;
    salary: number;
}

interface PageProps {
    employees: EmployeeOption[];
    statuses: string[];
    flash: {
        message?: string;
        error?: string;
    };
    errors: Partial<Record<'employee_id' | 'gaji' | 'kasbon' | 'status' | 'reason' | 'transaction_date', string>>; // Tambahkan transaction_date
}

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const SummaryRow: React.FC<{ label: string; value: string; isLoading: boolean; className?: string }> = ({ label, value, isLoading, className }) => (
    <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {isLoading ? (
            <div className="h-6 w-32 bg-slate-700 rounded-md animate-pulse"></div>
        ) : (
            <p className={cn("font-bold text-xl text-white", className)}>{value}</p>
        )}
    </div>
);

export default function CreateKasbonPegawai({ employees, statuses, flash, errors: pageErrors }: PageProps) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        employee_id: '',
        gaji: 0,
        kasbon: 0,
        status: 'Pending',
        reason: '',
        // [MODIFIKASI] Tambahkan transaction_date ke state form, default hari ini
        transaction_date: new Date().toISOString().split('T')[0],
    });

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);

    useEffect(() => {
        if (wasSuccessful && flash.message) {
            reset();
            setSelectedEmployee(null);
        }
    }, [wasSuccessful, flash.message]);

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find(e => String(e.id) === employeeId) || null;
        setSelectedEmployee(employee);
        setData(prevData => ({
            ...prevData,
            employee_id: employeeId,
            gaji: employee?.salary || 0,
            kasbon: 0
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kasbons.store_pegawai'), {
            preserveScroll: true,
        });
    };

    const allErrors = { ...errors, ...pageErrors };
    const hasErrors = Object.keys(allErrors).length > 0 || flash.error;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kasbon Pegawai" />
            <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Buat Kasbon Pegawai" description="Isi formulir untuk membuat pengajuan kasbon baru." />
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {hasErrors && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>
                            {flash.error || "Harap periksa kembali isian formulir Anda."}
                            <ul className="list-disc pl-5 mt-2">
                                {Object.values(allErrors).map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {flash.message && !hasErrors && (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-200">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="employee_id">Pilih Pegawai</Label>
                                    <Select onValueChange={handleEmployeeChange} value={data.employee_id} disabled={processing}>
                                        <SelectTrigger id="employee_id"><SelectValue placeholder="Pilih Pegawai..." /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={String(employee.id)}>{employee.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && <p className="text-sm text-destructive mt-1">{errors.employee_id}</p>}
                                </div>

                                {/* [MODIFIKASI] Tambahkan input tanggal transaksi */}
                                <div>
                                    <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                                    <Input
                                        id="transaction_date"
                                        type="date"
                                        name="transaction_date"
                                        value={data.transaction_date}
                                        onChange={(e) => setData('transaction_date', e.target.value)}
                                        required
                                        disabled={processing}
                                    />
                                    {errors.transaction_date && <p className="text-sm text-destructive mt-1">{errors.transaction_date}</p>}
                                </div>

                                {/* <div className={cn(!data.employee_id && "opacity-50 pointer-events-none")}>
                                    <Label htmlFor="gaji">Gaji</Label>
                                    <Input
                                        id="gaji"
                                        type="number"
                                        name="gaji"
                                        value={data.gaji}
                                        onChange={(e) => setData('gaji', parseFloat(e.target.value) || 0)}
                                        required
                                        disabled={processing}
                                        readOnly // Gaji seharusnya tidak bisa diubah manual
                                    />
                                    {errors.gaji && <p className="text-sm text-destructive mt-1">{errors.gaji}</p>}
                                </div> */}

                                <div className={cn(!data.employee_id && "opacity-50 pointer-events-none")}>
                                    <Label htmlFor="kasbon">Jumlah Kasbon (IDR)</Label>
                                    <Input
                                        id="kasbon"
                                        type="number"
                                        placeholder="0"
                                        value={data.kasbon}
                                        onChange={(e) => setData('kasbon', parseFloat(e.target.value) || 0)}
                                        disabled={!data.employee_id || processing}
                                        className="text-2xl font-bold h-14"
                                    />
                                    {errors.kasbon && <p className="text-sm text-destructive mt-1">{errors.kasbon}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={(value) => setData('status', value)} value={data.status} disabled={processing}>
                                        <SelectTrigger id="status"><SelectValue placeholder="Pilih Status..." /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="reason">Alasan (Opsional)</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Contoh: Untuk kebutuhan mendesak..."
                                        value={data.reason || ''}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card className="bg-slate-800 text-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle className="text-white">Informasi Gaji</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">Gaji Pokok</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(selectedEmployee?.salary)}
                                        </p>
                                        <p className="text-xs text-slate-400">Ini adalah batas maksimal kasbon.</p>
                                        <SummaryRow label="Kasbon Diambil" value={formatCurrency(data.kasbon)} className="text-yellow-400" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Button type="submit" disabled={processing || !data.employee_id} className="w-full text-lg py-6">
                                {processing ? <Loader2 className="animate-spin mr-2" /> : <FileSignature className="mr-2" />}
                                {processing ? 'Menyimpan...' : 'Ajukan Kasbon'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
