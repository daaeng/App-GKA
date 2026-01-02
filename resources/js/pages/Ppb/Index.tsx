import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    CirclePlus,
    Clock,
    DollarSign,
    Eye,
    FileText,
    Search,
    Trash,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Breadcrumbs untuk halaman index PPB
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPB',
        href: route('ppb.index'),
    },
];

// Tipe data untuk PpbHeader (data ringkas untuk tabel)
interface PpbHeader {
    id: number;
    nomor: string;
    perihal: string;
    status: string;
    grand_total_formatted: string;
    tanggal_formatted: string;
}

// Tipe untuk link pagination
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Tipe data untuk props halaman ini
interface PageProps {
    flash: {
        message?: string;
    };
    ppbs: {
        data: PpbHeader[];
        links: PaginationLink[];
    };
    filter?: { search?: string };
    stats: {
        totalPpb: number;
        totalPending: number;
        totalApproved: number;
        sumApprovedAmount: number;
    };
}

// Format mata uang (jika diperlukan di frontend)
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Komponen Kartu Statistik
const StatCard = ({ title, value, icon, colorClass }: { title: string; value: string | number; icon: React.ReactNode; colorClass: string }) => (
    <div className={` backdrop-blur-sm border ${colorClass} p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300 flex items-center justify-between`}>
        <div>
            <p className="text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold ">{value}</p>
        </div>
        <div className={`text-4xl ${colorClass.replace('border-', 'text-')}`}>{icon}</div>
    </div>
);

export default function Index({ ppbs, flash, filter, stats }: PageProps) {
    const { processing, delete: destroy } = useForm();
    const [searchValue, setSearchValue] = useState(filter?.search || '');

    useEffect(() => {
        setSearchValue(filter?.search || '');
    }, [filter?.search]);

    // Fungsi untuk menjalankan pencarian
    const performSearch = () => {
        router.get(route('ppb.index'), { search: searchValue }, { preserveState: true, replace: true });
    };

    // Handle 'Enter' di search box
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') performSearch();
    };

    // Fungsi untuk menghapus data
    const handleDelete = (id: number, nomor: string) => {
        if (window.confirm(`Yakin ingin menghapus pengajuan PPB dengan nomor "${nomor}"?`)) {
            destroy(route('ppb.destroy', id), { preserveScroll: true });
        }
    };

    // Render tombol-tombol pagination
    const renderPagination = (links: PaginationLink[]) => (
        <div className="flex justify-center items-center mt-6 space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        link.active
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    } ${!link.url ? 'text-slate-500 cursor-not-allowed opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pengajuan Barang (PPB)" />
            <div className="p-4 md:p-6 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Pengajuan Permintaan Barang (PPB)" description="Monitor dan kelola semua surat PPB." />
                </div>

                {/* Grid Kartu Statistik */}
                {can('requests.edit') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Surat PPB" value={stats.totalPpb} icon={<FileText />} colorClass="border-cyan-500" />
                        <StatCard title="Disetujui" value={stats.totalApproved} icon={<CheckCircle2 />} colorClass="border-green-500" />
                        <StatCard title="Pending" value={stats.totalPending} icon={<Clock />} colorClass="border-yellow-500" />
                        <StatCard title="Total Dana Disetujui" value={formatCurrency(stats.sumApprovedAmount)} icon={<DollarSign />} colorClass="border-purple-500" />
                    </div>
                )}

                {/* Tabel Laporan */}
                <div className="backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg">

                    {can('requests.create') && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <h2 className="text-xl font-bold ">Daftar Surat PPB</h2>
                            <Link href={route('ppb.create')}>
                                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0">
                                    <CirclePlus className="w-5 h-5 mr-2" />
                                    Buat PPB Baru
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Tampilkan flash message jika ada */}
                    {flash.message && (
                        <Alert className="mb-4 bg-green-500/10 border-green-500 text-green-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}

                    {/* Search Bar */}
                    <div className="flex gap-4 py-4">
                        <div className="relative flex-1">
                            <Search className="text-slate-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Cari berdasarkan nomor surat atau perihal..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10 bg-slate-800 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700 hover:bg-slate-800/60">
                                    <TableHead className="text-slate-400">Nomor Surat</TableHead>
                                    <TableHead className="text-slate-400">Tanggal</TableHead>
                                    <TableHead className="text-slate-400">Perihal</TableHead>
                                    <TableHead className="text-slate-400">Grand Total</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    
                                    {can('requests.edit') && (
                                        <TableHead className="text-center text-slate-400">Aksi</TableHead>
                                    )}

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ppbs.data.length > 0 ? (
                                    ppbs.data.map((ppb) => (
                                        <TableRow key={ppb.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="font-medium">{ppb.nomor}</TableCell>
                                            <TableCell>{ppb.tanggal_formatted}</TableCell>
                                            <TableCell>{ppb.perihal}</TableCell>
                                            <TableCell>{ppb.grand_total_formatted}</TableCell>
                                            <TableCell><Tag status={ppb.status} /></TableCell>
                                            
                                            {can('requests.edit') && (
                                                <TableCell className="text-center space-x-1">
                                                    <Link href={route('ppb.show', ppb.id)}>
                                                        <Button variant="ghost" size="icon" title="Lihat Detail">
                                                            <Eye className="h-4 w-4 text-cyan-400 hover:text-cyan-500" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" title="Hapus" disabled={processing} onClick={() => handleDelete(ppb.id, ppb.nomor)}>
                                                        <Trash className="h-4 w-4 text-red-400 hover:text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            )}

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-8 text-center text-slate-500">
                                            Tidak ada data pengajuan PPB ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Pagination */}
                    {ppbs.data.length > 0 && renderPagination(ppbs.links)}
                </div>
            </div>
        </AppLayout>
    );
}