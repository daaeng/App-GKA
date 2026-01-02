// ./resources/js/Pages/Pegawai/Index.tsx

import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

// UI Components
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

// Icons
import { 
    Banknote, 
    Briefcase, 
    CheckCircle2, 
    CirclePlus, 
    CreditCard, 
    LayoutList, 
    Pencil, 
    Search, 
    Trash2, 
    Users, 
    Filter,
    UserCircle,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

// --- Types ---
interface Pegawai {
    id: number;
    employee_id: string;
    name: string;
    position: string;
    salary: number;
    status: 'active' | 'inactive';
    avatar: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pegawai', href: route('pegawai.index') },
];

// --- Helpers ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const getAvatarColor = (name: string) => {
    const colors = [
        'bg-blue-100 text-blue-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-cyan-100 text-cyan-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

export default function Index({ pegawai }: { pegawai: Pegawai[] }) {
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [currentPegawai, setCurrentPegawai] = useState<Pegawai | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State Filter Status (Default 'active')
    const [statusFilter, setStatusFilter] = useState<string>('active');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        employee_id: '',
        name: '',
        position: '',
        salary: 0,
        status: 'active',
    });

    const flashMessage = props.flash?.message as string | undefined;

    // --- Filter Logic ---
    const filteredPegawai = useMemo(() => {
        return pegawai.filter(p => {
            const matchesSearch = 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [pegawai, searchQuery, statusFilter]);

    // --- Statistics ---
    const activePegawaiCount = useMemo(() => pegawai.filter(p => p.status === 'active').length, [pegawai]);
    const activePegawaiList = useMemo(() => pegawai.filter(p => p.status === 'active'), [pegawai]);
    const totalSalary = useMemo(() => activePegawaiList.reduce((acc, curr) => acc + curr.salary, 0), [activePegawaiList]);
    const averageSalary = useMemo(() => activePegawaiList.length > 0 ? totalSalary / activePegawaiList.length : 0, [totalSalary, activePegawaiList]);

    // --- Handlers ---
    const handleAdd = () => {
        reset();
        clearErrors();
        setCurrentPegawai(null);
        setIsModalOpen(true);
    };

    const handleEdit = (pegawai: Pegawai) => {
        clearErrors();
        setCurrentPegawai(pegawai);
        setData({ 
            employee_id: pegawai.employee_id, 
            name: pegawai.name, 
            position: pegawai.position, 
            salary: pegawai.salary,
            status: pegawai.status 
        });
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = (pegawai: Pegawai) => {
        setCurrentPegawai(pegawai);
        setIsDeleteConfirmOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteConfirmOpen(false);
        setCurrentPegawai(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => closeModal() };
        if (currentPegawai) {
            put(route('pegawai.update', currentPegawai.id), options);
        } else {
            post(route('pegawai.store'), options);
        }
    };

    const executeDelete = () => {
        if (currentPegawai) {
            router.delete(route('pegawai.destroy', currentPegawai.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // --- Render Helpers ---
    const StatusBadge = ({ status }: { status: string }) => (
        status === 'active' ? (
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 whitespace-nowrap">
                <span className="mr-1.5 relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Aktif
            </div>
        ) : (
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 whitespace-nowrap">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                Non-Aktif
            </div>
        )
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pegawai" />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-50/50 dark:bg-black min-h-screen font-sans">
                
                {/* 1. Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Data Kepegawaian</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data pegawai, pantau status aktif, dan riwayat gaji.
                        </p>
                    </div>
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all w-full sm:w-auto">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Tambah Pegawai
                    </Button>
                </div>

                {/* 2. Stats Cards (Grid Responsif 1 -> 2 -> 3 kolom) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground truncate">Pegawai Aktif</p>
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {activePegawaiCount} <span className="text-sm font-normal text-muted-foreground">/ {pegawai.length} Total</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground truncate">Payroll (Bulan Ini)</p>
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {formatCurrency(totalSalary)}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 shrink-0">
                                <Banknote className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground truncate">Rata-rata Gaji</p>
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {formatCurrency(averageSalary)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flash Message */}
                {flashMessage && (
                    <Alert className="bg-white dark:bg-zinc-900 border-l-4 border-emerald-500 shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <div className="ml-2">
                            <AlertTitle className="text-gray-900 dark:text-white">Berhasil</AlertTitle>
                            <AlertDescription className="text-muted-foreground">{flashMessage}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* 3. Search Bar & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-1.5 rounded-xl border shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Cari nama, ID, atau jabatan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-0 bg-transparent focus-visible:ring-0 shadow-none h-10"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto px-2">
                        <div className="h-6 w-px bg-border hidden md:block" />
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground w-full md:w-auto justify-between md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span>
                                            {statusFilter === 'all' ? 'Semua Status' : statusFilter === 'active' ? 'Status: Aktif' : 'Status: Non-Aktif'}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilter === 'active'} onCheckedChange={() => setStatusFilter('active')}>
                                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Aktif</span>
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilter === 'inactive'} onCheckedChange={() => setStatusFilter('inactive')}>
                                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-400" /> Non-Aktif</span>
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>
                                    Semua Data
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 4. CONTENT AREA (HYBRID LAYOUT) */}
                <div className="mt-2">
                    {filteredPegawai.length > 0 ? (
                        <>
                            {/* --- MOBILE VIEW (CARDS) --- */}
                            {/* Tampil di < md (tablet/hp) */}
                            <div className="grid gap-3 md:hidden">
                                {filteredPegawai.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`relative flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 ${item.status === 'inactive' ? 'opacity-80 bg-gray-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Avatar */}
                                                <div className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border ${item.status === 'active' ? 'border-emerald-100' : 'border-gray-100 grayscale'}`}>
                                                    {item.avatar ? (
                                                        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className={`flex h-full w-full items-center justify-center text-[10px] font-bold ${getAvatarColor(item.name)}`}>
                                                            {getInitials(item.name)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className={`text-sm font-bold truncate ${item.status === 'inactive' ? 'text-muted-foreground' : 'text-gray-900 dark:text-white'}`}>
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground truncate">{item.position}</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                <StatusBadge status={item.status} />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 dark:border-zinc-800 mt-1">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-[10px] font-medium text-muted-foreground uppercase">ID Pegawai</p>
                                                    <code className="text-[10px] font-mono bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700">
                                                        {item.employee_id}
                                                    </code>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.salary)}</p>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(item)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteConfirm(item)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- DESKTOP VIEW (TABLE) --- */}
                            {/* Tampil di >= md (desktop/tablet besar) dengan overflow-x-auto agar tidak terpotong */}
                            <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/50">
                                            <TableRow>
                                                <TableHead className="w-[300px] whitespace-nowrap">Pegawai</TableHead>
                                                <TableHead className="whitespace-nowrap">Jabatan</TableHead>
                                                <TableHead className="whitespace-nowrap">Status</TableHead>
                                                <TableHead className="text-right whitespace-nowrap">Gaji Pokok</TableHead>
                                                <TableHead className="text-right w-[100px] whitespace-nowrap">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPegawai.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-full overflow-hidden border flex-shrink-0 ${item.status === 'inactive' ? 'grayscale opacity-70' : ''}`}>
                                                                {item.avatar ? (
                                                                    <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className={`flex h-full w-full items-center justify-center text-[10px] font-bold ${getAvatarColor(item.name)}`}>
                                                                        {getInitials(item.name)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`font-medium text-sm truncate ${item.status === 'inactive' ? 'text-muted-foreground' : 'text-gray-900 dark:text-white'}`}>
                                                                    {item.name}
                                                                </p>
                                                                <code className="text-[10px] text-muted-foreground">{item.employee_id}</code>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                                                            <Briefcase className="h-3.5 w-3.5" />
                                                            {item.position}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={item.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium whitespace-nowrap">
                                                        {formatCurrency(item.salary)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => handleEdit(item)}>
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteConfirm(item)}>
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/50">
                            <div className="rounded-full bg-white p-3 shadow-sm dark:bg-zinc-800 mb-3">
                                <LayoutList className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Data Tidak Ditemukan
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                                {statusFilter !== 'all' 
                                    ? `Tidak ada pegawai dengan status "${statusFilter === 'active' ? 'Aktif' : 'Non-Aktif'}" yang cocok.` 
                                    : 'Silakan tambah data baru atau ubah pencarian.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah/Edit (Code sama seperti sebelumnya) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={closeModal}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-primary" />
                            {currentPegawai ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi profil kepegawaian di bawah ini dengan akurat.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id" className="text-xs font-bold uppercase text-muted-foreground">ID Pegawai</Label>
                                <Input id="employee_id" placeholder="Ex: GKA-001" value={data.employee_id} onChange={(e) => setData('employee_id', e.target.value)} />
                                {errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary" className="text-xs font-bold uppercase text-muted-foreground">Gaji Pokok</Label>
                                <Input id="salary" type="number" placeholder="0" value={data.salary} onChange={(e) => setData('salary', parseInt(e.target.value) || 0)} />
                                {errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Nama Lengkap</Label>
                            <Input id="name" placeholder="Nama Pegawai" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-xs font-bold uppercase text-muted-foreground">Jabatan / Posisi</Label>
                            <Input id="position" placeholder="Contoh: Site Manager" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-xs font-bold uppercase text-muted-foreground">Status Kepegawaian</Label>
                            <Select 
                                value={data.status} 
                                onValueChange={(value) => setData('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Aktif Bekerja
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-gray-400" /> Non-Aktif (Resign/Cuti)
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={closeModal}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                                {processing ? '...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Hapus (Code sama seperti sebelumnya) */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Hapus Data?
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Anda akan menghapus data <strong>{currentPegawai?.name}</strong>. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={executeDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}