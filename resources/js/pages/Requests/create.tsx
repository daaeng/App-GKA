import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, ImageUp, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Requests', href: route('requests.index') },
    { title: 'Create Request' },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        date: '',
        devisi: '',
        j_pengajuan: '',
        mengetahui: '',
        desk: '',
        dana: 0,
        file: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removePreview = () => {
        setData('file', null);
        setPreview(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('requests.surat'), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan Baru" />
            <div className="p-4 md:p-6 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Formulir Pengajuan Baru" description="Lengkapi semua detail yang diperlukan." />
                    <Link href={route('requests.index')}>
                        <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className=" backdrop-blur-sm border border-slate-700 p-6 md:p-8 rounded-2xl shadow-lg">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500 text-red-300">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5">
                                    {Object.values(errors).map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Kolom Kiri: Form Input */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name" className="">Nama Pengaju</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-2" placeholder="cth: John Doe" />
                                </div>
                                <div>
                                    <Label htmlFor="date" className="">Tanggal</Label>
                                    <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="devisi" className="">Divisi</Label>
                                    <Input id="devisi" value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} className="mt-2" placeholder="cth: Marketing" />
                                </div>
                                <div>
                                    <Label htmlFor="j_pengajuan" className="">Jenis Pengajuan</Label>
                                    <Input id="j_pengajuan" value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)} className="mt-2" placeholder="cth: Pembelian Aset" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="mengetahui" className="">Diketahui oleh</Label>
                                <Input id="mengetahui" value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} className="mt-2" placeholder="cth: Manajer Keuangan" />
                            </div>
                            <div>
                                <Label htmlFor="desk" className="">Deskripsi Keperluan</Label>
                                <Textarea id="desk" value={data.desk} onChange={(e) => setData('desk', e.target.value)} className="mt-2" placeholder="Jelaskan secara rinci tujuan dari pengajuan dana ini..." />
                            </div>
                            <div>
                                <Label htmlFor="dana" className="">Total Dana Diajukan</Label>
                                <div className="relative mt-2">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">Rp</span>
                                    <Input id="dana" type="number" value={data.dana} onChange={(e) => setData('dana', parseFloat(e.target.value) || 0)} className="pl-8" placeholder="500000" />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Upload */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="file-input" className="">Bukti / Lampiran</Label>
                            <div className="mt-2 p-4 border-2 border-dashed border-slate-600 rounded-xl text-center h-full flex flex-col justify-center items-center hover:border-cyan-500 transition-colors">
                                {preview ? (
                                    <div className="relative group w-full">
                                        <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-md object-contain" />
                                        <button type="button" onClick={removePreview} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageUp className="h-16 w-16 text-slate-600" />
                                        <label htmlFor="file-input" className="cursor-pointer mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-500">
                                            Pilih file untuk diunggah
                                        </label>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF (maks. 2MB)</p>
                                        <Input id="file-input" type="file" onChange={handleFileChange} className="hidden" />
                                    </div>
                                )}
                            </div>
                            {errors.file && <p className="text-red-400 text-xs mt-2">{errors.file}</p>}
                        </div>

                        {/* Tombol Simpan */}
                        <div className="lg:col-span-5 flex justify-end mt-2">
                            <Button type="submit" disabled={processing} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 px-8 py-3">
                                <Sparkles className="w-5 h-5 mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan Pengajuan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
