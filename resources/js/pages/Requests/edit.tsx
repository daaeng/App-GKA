import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Image, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: route('requests.index'),
    },
    
    {
        title: 'Edit Request',
    }
];

interface Requested {
    id: number;
    name: string;
    date: string;
    devisi: string;
    j_pengajuan: string;
    mengetahui: string;
    desk: string;
    dana: number;
    file: string;
}

interface Props {
    requests: Requested;
}

export default function Edit({ requests }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: requests.name || '',
        date: requests.date || '',
        devisi: requests.devisi || '',
        j_pengajuan: requests.j_pengajuan || '',
        mengetahui: requests.mengetahui || '',
        desk: requests.desk || '',
        dana: requests.dana || 0,
        // File is not included as it cannot be changed in this form
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('requests.update', requests.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Request" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <div className="flex justify-between items-center mb-4">
                    <Heading title="Edit Pengajuan" />
                    <Link href={route('requests.index')}>
                        <Button variant="outline">
                            <Undo2 className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="w-full p-4 border rounded-lg">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.values(errors).map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 w-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Form Inputs */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Pengaju</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="date">Tanggal</Label>
                                <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="devisi">Divisi</Label>
                                <Input id="devisi" value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} className="mt-1" />
                            </div>
                             <div>
                                <Label htmlFor="j_pengajuan">Jenis Pengajuan</Label>
                                <Input id="j_pengajuan" value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="mengetahui">Diketahui oleh</Label>
                                <Input id="mengetahui" value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} className="mt-1" />
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

                        {/* Right Column: Image */}
                        <div>
                            <Label htmlFor="foto-nota">Bukti / Lampiran (Screenshot)</Label>
                            <div className="mt-2 p-2 border rounded-lg flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 min-h-[300px]">
                                <div className="text-sm text-yellow-600 mb-2 p-2 bg-yellow-100 rounded-md flex items-center">
                                    <Image className="h-4 w-4 mr-2" />
                                    Lampiran tidak dapat diubah pada halaman ini.
                                </div>
                                {requests.file ? (
                                    <a href={`/storage/${requests.file}`} target="_blank" rel="noopener noreferrer" title="Klik untuk melihat gambar penuh">
                                        <img
                                            // CORRECTED: The image path is now much simpler
                                            src={`/storage/${requests.file}`}
                                            alt={`Bukti untuk ${requests.name}`}
                                            className="max-w-full max-h-[450px] object-contain rounded-md"
                                        />
                                    </a>
                                ) : (
                                    <p className="text-gray-500">Tidak ada lampiran.</p>
                                )}
                            </div>
                        </div>

                        {/* Update Button at the bottom */}
                        <div className="md:col-span-2 flex justify-end">
                            <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-500">
                                {processing ? 'Memperbarui...' : 'Update Pengajuan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
