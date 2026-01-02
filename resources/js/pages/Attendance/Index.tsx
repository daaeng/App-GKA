import React, { useEffect, useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
    CheckCircle2, XCircle, FileText, Briefcase, Plane, UserCheck, UserX, 
    BookUser, CalendarDays, Pencil, Megaphone, Users, CalendarClock, 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { can } from '@/lib/can';

interface Employee {
    id: number;
    name: string;
}
interface AttendanceDetail {
    id: number;
    clock_in_time: string;
    clock_out_time: string | null;
    status: string;
    notes: string | null;
    employee: Employee;
}
interface IndividualReportData {
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
    total_cuti: number;
    total_jam_kerja: number;
    detail_absensi: AttendanceDetail[];
}
interface DaySummary {
    summary: {
        Hadir: number;
        Izin: number;
        Sakit: number;
        Alpha: number;
        Cuti: number;
    };
    details: AttendanceDetail[];
}
type AllReportData = Record<string, DaySummary>;

interface PageProps {
    reportType: 'all' | 'individual';
    reportData: IndividualReportData | AllReportData | null;
    selectedMonth: string;
    selectedEmployeeId: string | null;
    selectedEmployee: Employee | null;
    employees: Employee[];
    flash: {
        success?: string;
    };
}

export default function AttendanceReportPage({ reportType, reportData, selectedMonth, selectedEmployeeId, employees, selectedEmployee, flash }: PageProps) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Laporan Rekap', href: '#' },
    ];

    const [flashMessage, setFlashMessage] = useState<string | undefined>(flash.success);

    useEffect(() => {
        if (flash.success) {
            setFlashMessage(flash.success);
            const timer = setTimeout(() => setFlashMessage(undefined), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const handleFilter = (key: 'month' | 'employee_id', value: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        if (key === 'employee_id' && value === 'all') {
            currentParams.delete('employee_id');
        } else if (value) {
            currentParams.set(key, value);
        } else {
            currentParams.delete(key);
        }

        router.get(route('attendances.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Absensi" />
            <div className="space-y-6 p-4 md:p-6">
                
                {flashMessage && (
                    <div className="fixed top-24 right-6 w-auto max-w-sm z-50 animate-in fade-in-0 slide-in-from-top-5">
                        <Alert variant="default" className="bg-green-50/90 dark:bg-green-900/70 backdrop-blur-sm border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 shadow-lg">
                            <Megaphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                            <AlertDescription>{flashMessage}</AlertDescription>
                        </Alert>
                    </div>
                )}
                
                {can('usermanagements.create') && (
                    <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">Laporan Rekapitulasi Absensi</CardTitle>
                                <CardDescription className="mt-1">Pilih bulan dan karyawan untuk melihat rekap kehadiran.</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                {/* <Link href="#" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full">
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                </Link> */}

                                {can('usermanagements.create') && (
                                    <Link href={route('attendances.create')} className="w-full sm:w-auto">
                                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0">
                                            <CalendarClock className="h-4 w-4 mr-2" />
                                            Input Manual
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                            <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => handleFilter('month', e.target.value)}
                                className="w-full sm:w-auto"
                            />
                            <Select onValueChange={(value) => handleFilter('employee_id', value)} value={selectedEmployeeId ?? 'all'}>
                                <SelectTrigger className="w-full sm:w-[250px]">
                                    <SelectValue placeholder="Semua Karyawan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Semua Karyawan</span>
                                        </div>
                                    </SelectItem>
                                    {employees.map((employee) => (
                                        <SelectItem key={employee.id} value={String(employee.id)}>
                                            {employee.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                )}
                
                {reportType === 'individual' && reportData && (
                    <IndividualReport report={reportData as IndividualReportData} employee={selectedEmployee!} />
                )}

                {reportType === 'all' && reportData && (
                     <AllEmployeesCalendar attendancesByDate={reportData as AllReportData} selectedMonth={selectedMonth} />
                )}
                
                {(!reportData || (reportType === 'all' && Object.keys(reportData).length === 0) || (reportType === 'individual' && (reportData as IndividualReportData).detail_absensi.length === 0)) && (
                    <Card className="mt-6 border-dashed">
                        <CardContent className="pt-6 text-center text-muted-foreground flex flex-col items-center justify-center h-48">
                           <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                            <p className="font-medium">Tidak Ada Data</p>
                            <p className="text-sm">Tidak ada data absensi untuk periode atau karyawan yang dipilih.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

const IndividualReport = ({ report, employee }: { report: IndividualReportData; employee: Employee; }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Rekap Kehadiran: {employee.name}</CardTitle>
                <CardDescription>Detail kehadiran selama periode yang dipilih.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Hadir" value={report.total_hadir} icon={CheckCircle2} color="green" />
                <StatCard title="Sakit" value={report.total_sakit} icon={FileText} color="yellow" />
                <StatCard title="Izin" value={report.total_izin} icon={FileText} color="blue" />
                <StatCard title="Alpha" value={report.total_alpha} icon={XCircle} color="red" />
                <StatCard title="Cuti" value={report.total_cuti} icon={Plane} color="indigo" />
                <StatCard title="Total Jam Kerja" value={`${report.total_jam_kerja} Jam`} icon={Briefcase} color="gray" />
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle>Rincian Absensi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Jam Masuk</TableHead>
                                <TableHead>Jam Pulang</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Catatan</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.detail_absensi.map(item => (
                                <TableRow key={item.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{format(new Date(item.clock_in_time), 'EEEE, dd MMM yyyy', { locale: id })}</TableCell>
                                    <TableCell>{format(new Date(item.clock_in_time), 'HH:mm')}</TableCell>
                                    <TableCell>{item.clock_out_time ? format(new Date(item.clock_out_time), 'HH:mm') : '-'}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.notes || '-'}</TableCell>
                                    <TableCell className="text-center">
                                        <Link href={route('attendances.edit', item.id)}>
                                            <Button variant="outline" size="icon" className="group">
                                                <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
);

const statColorVariants = {
    green: "from-green-500 to-emerald-600 text-white",
    yellow: "from-yellow-500 to-amber-600 text-white",
    blue: "from-blue-500 to-sky-600 text-white",
    red: "from-red-500 to-rose-600 text-white",
    indigo: "from-indigo-500 to-violet-600 text-white",
    gray: "from-slate-500 to-slate-600 text-white",
}
const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: keyof typeof statColorVariants }) => (
    <div className="relative p-4 rounded-lg bg-white dark:bg-slate-900 shadow-md overflow-hidden group transition-transform hover:-translate-y-1">
        <div className={cn("absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity", statColorVariants[color])}></div>
        <Icon className={cn("h-8 w-8 mb-2", `text-${color}-500`)} />
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </div>
);

const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
        Hadir: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
        Izin: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
        Sakit: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
        Alpha: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
        Cuti: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
    };
    
    return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusStyles[status] || 'bg-muted text-muted-foreground')}>
            {status}
        </span>
    );
};


const AllEmployeesCalendar = ({ attendancesByDate, selectedMonth }: { attendancesByDate: AllReportData, selectedMonth: string }) => {
    const [modalData, setModalData] = useState<{ date: Date; details: AttendanceDetail[] } | null>(null);

    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = getDay(monthStart); 

    const handleDayClick = (day: Date, details: AttendanceDetail[]) => {
        if (details.length > 0) {
            setModalData({ date: day, details });
        }
    };

    const statusConfig: Record<string, { icon: React.ElementType, color: string }> = {
        Hadir: { icon: UserCheck, color: 'text-green-500' },
        Izin: { icon: BookUser, color: 'text-blue-500' },
        Sakit: { icon: FileText, color: 'text-yellow-500' },
        Alpha: { icon: UserX, color: 'text-red-500' },
        Cuti: { icon: Plane, color: 'text-indigo-500' },
    };
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Kalender Absensi Tim</CardTitle>
                    <CardDescription>Ringkasan kehadiran semua karyawan. Klik pada tanggal untuk melihat detail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                            <div key={day} className={cn("text-center font-bold text-xs md:text-sm text-muted-foreground pb-2", (day === 'Min' || day === 'Sab') && "text-red-500 dark:text-red-400")}>
                                {day}
                            </div>
                        ))}
                        
                        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="border rounded-lg bg-muted/30 min-h-[100px] md:min-h-[120px]"></div>)}
                        
                        {daysInMonth.map(day => {
                            const dateString = format(day, 'yyyy-MM-dd');
                            const dayData = attendancesByDate[dateString];
                            const hasAttendance = dayData && dayData.details.length > 0;
                            const dayOfWeek = getDay(day);
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const isCurrentDay = isToday(day);
                            
                            return (
                                <div 
                                    key={dateString} 
                                    className={cn(
                                        "border rounded-lg p-1.5 md:p-2 flex flex-col min-h-[100px] md:min-h-[120px] transition-all duration-200",
                                        hasAttendance ? "cursor-pointer bg-background hover:bg-accent hover:shadow-md hover:-translate-y-1" : "bg-muted/50",
                                        isWeekend && !hasAttendance && "bg-red-500/5",
                                        isCurrentDay && "border-2 border-primary ring-2 ring-primary/20"
                                    )}
                                    onClick={() => hasAttendance && handleDayClick(day, dayData.details)}
                                >
                                    <span className={cn(
                                        "font-semibold text-xs md:text-sm",
                                        isWeekend && "text-red-500 dark:text-red-400",
                                        isCurrentDay && "text-primary font-bold"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {hasAttendance && (
                                        <div className="mt-1 space-y-1 text-xs">
                                            {Object.entries(dayData.summary).map(([status, count]) => {
                                                if (count === 0) return null;
                                                const config = statusConfig[status];
                                                if (!config) return null;
                                                const Icon = config.icon;
                                                return (
                                                    <div key={status} className={cn("flex items-center gap-1.5", config.color)}>
                                                        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                                                        <span className="font-bold text-lg">{count}</span>
                                                        <span className="text-sm font-medium hidden sm:inline">{status}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!modalData} onOpenChange={(isOpen) => !isOpen && setModalData(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Detail Absensi: {modalData && format(modalData.date, 'EEEE, dd MMMM yyyy', { locale: id })}
                        </DialogTitle>
                        <DialogDescription>
                            Rincian kehadiran karyawan pada tanggal yang dipilih.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto mt-4 pr-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Karyawan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Jam</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalData?.details.map(att => (
                                    <TableRow key={att.id}>
                                        <TableCell className="font-medium">{att.employee.name}</TableCell>
                                        <TableCell>{getStatusBadge(att.status)}</TableCell>
                                        <TableCell>{format(new Date(att.clock_in_time), 'HH:mm')} - {att.clock_out_time ? format(new Date(att.clock_out_time), 'HH:mm') : '...'}</TableCell>
                                        <TableCell className="text-center">
                                            <Link href={route('attendances.edit', att.id)}>
                                                <Button variant="ghost" size="icon" className="group">
                                                    <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
