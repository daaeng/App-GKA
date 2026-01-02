import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CircleAlert, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notas', href: route('notas.index') },
    { title: 'Edit Nota' },
];

interface Nota {
    id: number;
    name: string;
    date: string;
    devisi: string;
    mengetahui: string;
    desk: string;
    dana: number;
    file: string;
}

interface Props {
    nota: Nota;
}

export default function Edit({ nota }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: nota.name || '',
        date: nota.date || '',
        devisi: nota.devisi || '',
        mengetahui: nota.mengetahui || '',
        desk: nota.desk || '',
        dana: nota.dana || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('notas.update', nota.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Nota #${nota.id}`} />
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Edit Nota" description={`Perbarui detail untuk nota #${nota.id}`} />
                    <Link href={route('notas.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kolom Kiri: Form Input */}
                        <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-lg shadow-sm space-y-6">
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-5">
                                            {Object.values(errors).map((message, index) => (
                                                <li key={index}>{message}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name">Nama Pengaju</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="date">Tanggal</Label>
                                    <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="devisi">Divisi</Label>
                                    <Input id="devisi" value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="mengetahui">Diketahui oleh</Label>
                                    <Input id="mengetahui" value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="desk">Deskripsi</Label>
                                <Textarea id="desk" value={data.desk} onChange={(e) => setData('desk', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="dana">Total Dana</Label>
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                                    <Input id="dana" type="number" value={data.dana} onChange={(e) => setData('dana', parseFloat(e.target.value) || 0)} className="pl-8" />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Lampiran & Tombol Simpan */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lampiran Bukti</h3>
                                <div className="mt-2 border rounded-lg flex items-center justify-center bg-gray-50 min-h-[200px] p-2">
                                    {nota.file ? (
                                        <a href={`/storage/${nota.file.replace('storage/', '')}`}  target="_blank" rel="noopener noreferrer" title="Klik untuk melihat gambar penuh">
                                            <img
                                                src={`/storage/${nota.file.replace('storage/', '')}`} 
                                                alt={`Bukti untuk ${nota.name}`}
                                                className="max-w-full max-h-[300px] object-contain rounded-md"
                                            />
                                        </a>
                                    ) : (
                                        <p className="text-gray-500">Tidak ada lampiran.</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Lampiran tidak dapat diubah di halaman ini.</p>
                            </div>
                            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                                <Button type="submit" disabled={processing} className="w-full">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
