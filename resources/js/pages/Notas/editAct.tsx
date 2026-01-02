import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Info, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrasi', href: route('administrasis.index') },
    { title: 'Update Status Nota' },
];

interface Nota {
    id: number;
    name: string;
    date: string;
    desk: string;
    file: string;
    status: 'belum ACC' | 'ditolak' | 'diterima';
    reason: string;
}

interface Props {
    nota: Nota;
}

export default function EditAct({ nota }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: nota.status || 'belum ACC',
        reason: nota.reason || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('notas.updateAct', nota.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Update Status Nota #${nota.id}`} />
            <div className="p-4 md:p-6 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Update Status Pengajuan" description={`Review dan perbarui status untuk nota dari ${nota.name}.`} />
                    <Link href={route('administrasis.index')}>
                        <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri & Tengah: Info & Gambar */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-bold text-cyan-400 border-b border-slate-700 pb-2 mb-4">Detail Pengajuan</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="">Nama Pengaju</Label>
                                    <p className="text-lg font-semibold mt-1">{nota.name}</p>
                                </div>
                                <div>
                                    <Label className="">Tanggal</Label>
                                    <p className="text-lg font-semibold mt-1">{nota.date}</p>
                                </div>
                                <div>
                                    <Label className="flex items-center"><Info className="w-4 h-4 mr-2" /> Deskripsi</Label>
                                    <p className=" mt-1">{nota.desk || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-bold text-cyan-400 mb-4">Lampiran Bukti</h3>
                            <div className="mt-2 p-2 border border-slate-700 rounded-lg flex items-center justify-center min-h-[300px]">
                                {nota.file ? (
                                    <a href={`/storage/${nota.file.replace('storage/', '')}`}  target="_blank" rel="noopener noreferrer" title="Klik untuk melihat gambar penuh">
                                        <img
                                            src={`/storage/${nota.file.replace('storage/', '')}`} 
                                            alt={`Bukti untuk ${nota.name}`}
                                            className="max-w-full max-h-[400px] object-contain rounded-md"
                                        />
                                    </a>
                                ) : (
                                    <p className="text-slate-500">Tidak ada lampiran.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Form Update Status */}
                    <div className="lg:col-span-1">
                        <div className="backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg sticky top-6">
                            <h3 className="text-lg font-bold text-cyan-400 border-b border-slate-700 pb-2 mb-6">Aksi</h3>
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
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="status" className="text-slate-400">Ubah Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'belum ACC' | 'ditolak' | 'diterima') => setData('status', value)}
                                    >
                                        <SelectTrigger className="w-full mt-2  border-slate-700 focus:border-cyan-500 focus:ring-cyan-500">
                                            <SelectValue placeholder="Pilih status..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectItem value="belum ACC">Belum ACC</SelectItem>
                                            <SelectItem value="diterima">Diterima</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="reason" className="">Alasan (jika ditolak)</Label>
                                    <Textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        className="mt-2"
                                        placeholder="Berikan alasan jika pengajuan ditolak..."
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={processing} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 py-3">
                                        <Save className="w-5 h-5 mr-2" />
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
