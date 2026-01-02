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
    Pencil,
    Search,
    Trash,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Nota',
        href: '/notas',
    },
];

interface Nota {
    id: number;
    name: string;
    date: string;
    devisi: string;
    mengetahui: string;
    desk: string;
    dana: number;
    status: string;
    file: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: {
        message?: string;
    };
    notas: {
        data: Nota[];
        links: PaginationLink[];
    };
    filter?: { search?: string };
    jml_nota: number;
    totalPendingNotas: number;
    totalApprovedNotas: number;
    sumApprovedNotasAmount: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const StatCard = ({ title, value, icon, colorClass }: { title: string; value: string | number; icon: React.ReactNode; colorClass: string }) => (
    <div className={` backdrop-blur-sm border ${colorClass} p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300 flex items-center justify-between`}>
        <div>
            <p className="text-sm  mb-1">{title}</p>
            <p className="text-3xl font-bold ">{value}</p>
        </div>
        <div className={`text-4xl ${colorClass.replace('border-', 'text-')}`}>{icon}</div>
    </div>
);

export default function Index({ notas, flash, filter, totalPendingNotas, totalApprovedNotas, sumApprovedNotasAmount, jml_nota }: PageProps) {
    const { processing, delete: destroy } = useForm();
    const [searchValue, setSearchValue] = useState(filter?.search || '');

    useEffect(() => {
        setSearchValue(filter?.search || '');
    }, [filter?.search]);

    const performSearch = () => {
        router.get(route('notas.index'), { search: searchValue }, { preserveState: true, replace: true });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') performSearch();
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Yakin ingin menghapus nota dari "${name}"?`)) {
            destroy(route('notas.destroy', id), { preserveScroll: true });
        }
    };

    const renderPagination = (links: PaginationLink[]) => (
        <div className="flex justify-center items-center mt-6 space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        link.active
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                            : 'bg-slate-200 text-slate-300 hover:bg-slate-700'
                    } ${!link.url ? 'text-slate-600 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Nota" />
            <div className="p-4 md:p-6 min-h-screen">
                <Heading title="Dashboard Upload Nota" description="Monitor dan kelola semua nota pembelian." />

                {can('notas.create') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                        <StatCard title="Total Nota" value={jml_nota} icon={<FileText />} colorClass="border-cyan-500" />
                        <StatCard title="Disetujui" value={totalApprovedNotas} icon={<CheckCircle2 />} colorClass="border-green-500" />
                        <StatCard title="Pending" value={totalPendingNotas} icon={<Clock />} colorClass="border-yellow-500" />
                        <StatCard title="Total Dana Disetujui" value={formatCurrency(sumApprovedNotasAmount)} icon={<DollarSign />} colorClass="border-purple-500" />
                    </div>
                )}

                <div className="backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <h2 className="text-xl font-bold ">Laporan Nota</h2>
                        {can('notas.create') && (
                            <Link href={route('notas.up_nota')}>
                                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0">
                                    <CirclePlus className="w-5 h-5 mr-2" />
                                    Upload Nota Baru
                                </Button>
                            </Link>
                        )}
                    </div>

                    {flash.message && (
                        <Alert className="mb-4 bg-green-500/10 border-green-500 text-green-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-4 py-4">
                        <div className="relative flex-1">
                            <Search className="text-white absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Cari berdasarkan nama, divisi..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10 bg-slate-700 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 text-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700 hover:bg-slate-300/60">
                                    <TableHead className="">Nama</TableHead>
                                    <TableHead className="">Tanggal</TableHead>
                                    <TableHead className="">Divisi</TableHead>
                                    <TableHead className="">Dana</TableHead>
                                    <TableHead className="">Status</TableHead>
                                    
                                    {can('notas.edit') && (
                                        <TableHead className="text-center">Aksi</TableHead>
                                    )}

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notas.data.length > 0 ? (
                                    notas.data.map((nota) => (
                                        <TableRow key={nota.id} className="border-slate-800 hover:bg-slate-700/50 transition-colors">
                                            <TableCell className="font-medium ">{nota.name}</TableCell>
                                            <TableCell className="">{nota.date}</TableCell>
                                            <TableCell className="">{nota.devisi}</TableCell>
                                            <TableCell className="">{formatCurrency(nota.dana)}</TableCell>
                                            <TableCell><Tag status={nota.status} /></TableCell>

                                            {can('notas.edit') && (
                                                <TableCell className="text-center space-x-1">
                                                    <Link href={route('notas.show', nota.id)}>
                                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4 text-cyan-400 hover:text-cyan-500" /></Button>
                                                    </Link>
                                                    <Link href={route('notas.edit', nota.id)}>
                                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4 text-yellow-400 hover:text-yellow-500" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" disabled={processing} onClick={() => handleDelete(nota.id, nota.name)}>
                                                        <Trash className="h-4 w-4 text-red-400 hover:text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-8 text-center text-slate-500">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {notas.data.length > 0 && renderPagination(notas.links)}
                </div>
            </div>
        </AppLayout>
    );
}
