import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Definisikan tipe data untuk props
interface Employee {
    id: number;
    name: string;
}

interface PageProps {
    employees: Employee[];
    errors: any; 
}

export default function CreateAttendancePage({ employees, errors }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Input Manual', href: route('attendances.create') },
    ];

    const { data, setData, post, processing } = useForm({
        employee_id: '',
        attendance_date: new Date().toISOString().split('T')[0], // Default hari ini
        clock_in_time: '08:00',
        clock_out_time: '17:00',
        status: 'Hadir',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('attendances.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Absensi Manual" />
            <div className="p-4 md:p-6 min-h-screen">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Input Absensi</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Formulir Absensi Manual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                            <div>
                                <Label htmlFor="employee_id">Karyawan</Label>
                                <Select onValueChange={(value) => setData('employee_id', value)} value={data.employee_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Karyawan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="attendance_date">Tanggal Absensi</Label>
                                <Input
                                    type="date"
                                    id="attendance_date"
                                    value={data.attendance_date}
                                    onChange={(e) => setData('attendance_date', e.target.value)}
                                />
                                {errors.attendance_date && <p className="text-red-500 text-xs mt-1">{errors.attendance_date}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="clock_in_time">Jam Masuk</Label>
                                    <Input
                                        type="time"
                                        id="clock_in_time"
                                        value={data.clock_in_time}
                                        onChange={(e) => setData('clock_in_time', e.target.value)}
                                    />
                                    {errors.clock_in_time && <p className="text-red-500 text-xs mt-1">{errors.clock_in_time}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="clock_out_time">Jam Pulang</Label>
                                    <Input
                                        type="time"
                                        id="clock_out_time"
                                        value={data.clock_out_time}
                                        onChange={(e) => setData('clock_out_time', e.target.value)}
                                    />
                                    {errors.clock_out_time && <p className="text-red-500 text-xs mt-1">{errors.clock_out_time}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Status Kehadiran</Label>
                                <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hadir">Hadir</SelectItem>
                                        <SelectItem value="Izin">Izin</SelectItem>
                                        <SelectItem value="Sakit">Sakit</SelectItem>
                                        <SelectItem value="Alpha">Alpha</SelectItem>
                                        <SelectItem value="Cuti">Cuti</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>

                            <div>
                                <Label htmlFor="notes">Catatan (Opsional)</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Link href={route('attendances.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

