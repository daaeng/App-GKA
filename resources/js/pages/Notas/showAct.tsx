import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, Info, Layers, User, Users, Hash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrasi & Keuangan', href: '/administrasis' },
    { title: 'Detail Nota' },
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

interface Props {
    nota: Nota;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Komponen untuk menampilkan item detail dengan ikon
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => (
    <div>
        <div className="flex items-center text-sm text-gray-500">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800 mt-1">{value}</div>
    </div>
);

export default function Show({ nota }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengajuan #${nota.id}`} />
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Detail Pengajuan" description={`Informasi lengkap untuk pengajuan #${nota.id}`} />
                    <Link href={route('administrasis.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Detail Pengajuan */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-lg shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<User size={16} />} label="Nama Pengaju" value={nota.name} />
                            <DetailItem icon={<Calendar size={16} />} label="Tanggal" value={nota.date} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<Layers size={16} />} label="Divisi" value={nota.devisi} />
                            <DetailItem icon={<Users size={16} />} label="Diketahui oleh" value={nota.mengetahui} />
                        </div>
                        <div>
                            <DetailItem icon={<Info size={16} />} label="Deskripsi" value={<p className="text-base text-gray-600 font-normal">{nota.desk || '-'}</p>} />
                        </div>
                        <hr />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem icon={<Hash size={16} />} label="Status" value={<Tag status={nota.status} />} />
                            <DetailItem icon={<DollarSign size={16} />} label="Total Dana" value={<span className="text-blue-600">{formatCurrency(nota.dana)}</span>} />
                        </div>
                    </div>

                    {/* Kolom Kanan: Lampiran Bukti */}
                    <div className="lg:col-span-1 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lampiran Bukti</h3>
                        <div className="mt-2 border rounded-lg flex items-center justify-center bg-gray-50 min-h-[300px] p-2">
                            {nota.file ? (
                                <a href={`/storage/${nota.file.replace('storage/', '')}`}  target="_blank" rel="noopener noreferrer" title="Klik untuk melihat gambar penuh">
                                    <img
                                        src={`/storage/${nota.file.replace('storage/', '')}`} 
                                        alt={`Bukti untuk ${nota.name}`}
                                        className="max-w-full max-h-[500px] object-contain rounded-md"
                                    />
                                </a>
                            ) : (
                                <p className="text-gray-500">Tidak ada lampiran.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
