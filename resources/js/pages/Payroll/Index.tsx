import React, { useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// Layout & Tipe Data
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Komponen UI dari ShadCN
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Ikon dari Lucide React
import { PlusCircle, Pencil, MoreHorizontal, Eye, Wallet, Users, CalendarDays, Building } from 'lucide-react';
import { can } from '@/lib/can';

// --- INTERFACES & TIPE DATA ---
interface Payroll {
    id: number;
    payroll_period: string;
    status: 'draft' | 'final' | 'paid';
    created_at: string;
    gaji_bersih: number;
    employee: {
        name: string;
    };
}

interface PaginatedPayrolls {
    data: Payroll[];
    links: { url: string | null; label: string; active: boolean; }[];
    from: number;
    to: number;
    total: number;
}

interface Period {
    value: string; // e.g., "2025-08"
    label: string; // e.g., "Agustus 2025"
}

// [PERUBAHAN] Menambahkan properti baru dari controller
interface PageProps {
    payrolls: PaginatedPayrolls;
    availablePeriods: Period[];
    filters: {
        period?: string;
    };
    totalGajiPeriod: number;
    jumlahKaryawan: number;
    periodeAktif: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    // { title: 'Dashboard', href: route('dashboard') },
    { title: 'Penggajian', href: route('payroll.index') },
];

// --- FUNGSI BANTUAN & KOMPONEN KECIL ---
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const Pagination: React.FC<{ links: PageProps['payrolls']['links'] }> = ({ links }) => (
    <div className="flex items-center justify-center px-6 py-3">
        <nav className="flex items-center space-x-1">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={cn(
                        'px-3 py-1.5 text-sm rounded-md transition-colors',
                        link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                        !link.url && 'text-muted-foreground cursor-not-allowed'
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    as="button"
                    disabled={!link.url}
                    preserveState
                    preserveScroll
                />
            ))}
        </nav>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap = {
        paid: { text: 'Dibayar', className: 'bg-teal-100 text-teal-800' },
        final: { text: 'Final', className: 'bg-sky-100 text-sky-800' },
        draft: { text: 'Draft', className: 'bg-amber-100 text-amber-800' },
    };
    const current = statusMap[status as keyof typeof statusMap] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    return <Badge className={cn('font-medium border-0', current.className)}>{current.text}</Badge>;
};

// [KOMPONEN BARU] Kartu Statistik
const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; description: string; className?: string; }> = ({ icon: Icon, title, value, description, className }) => (
    <Card className={cn("border-0 shadow-lg text-white overflow-hidden", className)}>
        <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs opacity-80 mt-1">{description}</p>
            </div>
        </CardContent>
    </Card>
);

// --- KOMPONEN UTAMA ---
export default function Index({ payrolls, availablePeriods, filters, totalGajiPeriod, jumlahKaryawan, periodeAktif }: PageProps) {
    const { data, setData } = useForm({
        period: filters.period || 'all',
    });

    useEffect(() => {
        router.get(route('payroll.index'), { period: data.period === 'all' ? undefined : data.period }, {
            preserveState: true,
            replace: true,
        });
    }, [data.period]);

    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Penggajian" />
            {can('notas.edit') && (
            
                <div className="space-y-8 p-4 sm:p-6 lg:p-8">
                    <Heading title="Dashboard Penggajian" description="Analitik dan riwayat data penggajian karyawan." />
                    
                    {/* [TAMPILAN BARU] Grid Kartu Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard 
                            icon={Wallet} 
                            title="Total Biaya Gaji" 
                            value={formatCurrency(totalGajiPeriod)} 
                            description="Total gaji bersih pada periode ini" 
                            className="bg-gradient-to-br from-sky-400 to-blue-500"
                        />
                        <StatCard 
                            icon={Users} 
                            title="Karyawan Digaji" 
                            value={jumlahKaryawan} 
                            description="Jumlah karyawan yang diproses" 
                            className="bg-gradient-to-br from-green-400 to-cyan-500"
                        />
                        <StatCard 
                            icon={CalendarDays} 
                            title="Periode Penggajian" 
                            value={periodeAktif} 
                            description="Periode yang sedang ditampilkan" 
                            className="bg-gradient-to-br from-yellow-400 to-orange-500"
                        />
                    </div>

                    {/* [TAMPILAN BARU] Tabel dibungkus dalam Card */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Riwayat Penggajian</CardTitle>
                                <CardDescription>
                                    Menampilkan {payrolls.from || 0}-{payrolls.to || 0} dari {payrolls.total} data penggajian.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <Select value={data.period} onValueChange={(value) => setData('period', value)}>
                                    <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-transparent">
                                        <SelectValue placeholder="Filter Periode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Periode</SelectItem>
                                        {availablePeriods.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Link href={route('payroll.create')} className='w-full sm:w-auto'>
                                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0">
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Generate Gaji
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                        <TableHead className="pl-6">Nama Karyawan</TableHead>
                                        <TableHead>Periode Gaji</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Gaji Bersih</TableHead>
                                        <TableHead className="text-center pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payrolls.data.length > 0 ? (
                                        payrolls.data.map((payroll) => (
                                            <TableRow key={payroll.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <TableCell className="pl-6 font-medium text-gray-800 dark:text-white">{payroll.employee.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{formatPeriod(payroll.payroll_period)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={payroll.status} />
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight">{formatCurrency(payroll.gaji_bersih)}</TableCell>
                                                <TableCell className="text-center pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onSelect={() => router.get(route('payroll.show', payroll.id))}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>Lihat Slip</span>
                                                            </DropdownMenuItem>
                                                            {payroll.status !== 'paid' && (
                                                                <DropdownMenuItem onSelect={() => router.get(route('payroll.edit', payroll.id))}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Building className="w-12 h-12 text-gray-300" />
                                                    <p className="font-medium">Tidak ada data penggajian untuk ditampilkan.</p>
                                                    <p className="text-sm">Coba pilih periode lain atau generate gaji baru.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        {payrolls.links.length > 3 && (
                            <Pagination links={payrolls.links} />
                        )}
                    </Card>
                </div>
            )}

        </AppLayout>
    );
}
