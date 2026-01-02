import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { type PageProps as InertiaPageProps } from '@inertiajs/core';

// Tipe data yang dibutuhkan
interface Employee {
    id: number;
    name: string;
}

interface Attendance {
    id: number;
    employee_id: number;
    clock_in_time: string;
    clock_out_time: string | null;
    status: string;
    notes: string | null;
    employee: Employee;
}

interface PageProps extends InertiaPageProps {
    attendance: Attendance;
    employees: Employee[];
}

export default function EditAttendancePage({ attendance, employees }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Laporan Rekap', href: route('attendances.index') },
        { title: 'Edit Absensi', href: '#' },
    ];
    
    // Inisialisasi useForm dengan data yang ada
    const { data, setData, put, processing, errors } = useForm({
        employee_id: attendance.employee_id,
        attendance_date: format(new Date(attendance.clock_in_time), 'yyyy-MM-dd'),
        clock_in_time: format(new Date(attendance.clock_in_time), 'HH:mm'),
        clock_out_time: attendance.clock_out_time ? format(new Date(attendance.clock_out_time), 'HH:mm') : '',
        status: attendance.status,
        notes: attendance.notes || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Kirim data menggunakan method PUT ke route update
        put(route('attendances.update', attendance.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Absensi - ${attendance.employee.name}`} />
            <div className="p-4 md:p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Data Absensi</CardTitle>
                        <CardDescription>
                            Perbarui detail absensi untuk karyawan <span className="font-semibold">{attendance.employee.name}</span> pada tanggal <span className="font-semibold">{format(new Date(attendance.clock_in_time), 'dd MMMM yyyy')}</span>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="employee_id">Karyawan</Label>
                                    <Select 
                                        name="employee_id" 
                                        value={String(data.employee_id)}
                                        onValueChange={(value) => setData('employee_id', Number(value))}
                                    >
                                        <SelectTrigger>{employees.find(e => e.id === data.employee_id)?.name || 'Pilih Karyawan'}</SelectTrigger>
                                        <SelectContent>
                                            {employees.map(emp => (
                                                <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && <p className="text-sm text-red-500 mt-1">{errors.employee_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="attendance_date">Tanggal Absensi</Label>
                                    <Input
                                        id="attendance_date"
                                        type="date"
                                        value={data.attendance_date}
                                        onChange={(e) => setData('attendance_date', e.target.value)}
                                        required
                                    />
                                    {errors.attendance_date && <p className="text-sm text-red-500 mt-1">{errors.attendance_date}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="clock_in_time">Jam Masuk</Label>
                                    <Input
                                        id="clock_in_time"
                                        type="time"
                                        value={data.clock_in_time}
                                        onChange={(e) => setData('clock_in_time', e.target.value)}
                                        required
                                    />
                                    {errors.clock_in_time && <p className="text-sm text-red-500 mt-1">{errors.clock_in_time}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="clock_out_time">Jam Pulang</Label>
                                    <Input
                                        id="clock_out_time"
                                        type="time"
                                        value={data.clock_out_time}
                                        onChange={(e) => setData('clock_out_time', e.target.value)}
                                    />
                                    {errors.clock_out_time && <p className="text-sm text-red-500 mt-1">{errors.clock_out_time}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select 
                                        name="status"
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>{data.status || 'Pilih Status'}</SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hadir">Hadir</SelectItem>
                                            <SelectItem value="Izin">Izin</SelectItem>
                                            <SelectItem value="Sakit">Sakit</SelectItem>
                                            <SelectItem value="Alpha">Alpha</SelectItem>
                                            <SelectItem value="Cuti">Cuti</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Tambahkan catatan jika perlu..."
                                    />
                                    {errors.notes && <p className="text-sm text-red-500 mt-1">{errors.notes}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href={route('attendances.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

