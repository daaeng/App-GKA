import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, FileText, Hash, Info, Layers, User, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Requests', href: route('requests.index') },
    { title: 'Detail Request' },
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
    status: string;
    file: string;
}

interface Props {
    requests: Requested;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => (
    <div>
        <div className="flex items-center text-sm text-slate-400 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <div className="text-lg font-semibold ">{value}</div>
    </div>
);

export default function Show({ requests }: Props) {
    const data = requests;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengajuan #${data.id}`} />
            <div className="p-4 md:p-6 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Heading title="Detail Pengajuan" description={`Informasi lengkap untuk pengajuan #${data.id}`} />
                    <Link href={route('requests.index')}>
                        <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Informasi Utama */}
                    <div className="lg:col-span-2 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-lg space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<User />} label="Nama Pengaju" value={data.name} />
                            <DetailItem icon={<Calendar />} label="Tanggal" value={data.date} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<Layers />} label="Divisi" value={data.devisi} />
                            <DetailItem icon={<FileText />} label="Jenis Pengajuan" value={data.j_pengajuan} />
                        </div>

                        <DetailItem icon={<Users />} label="Diketahui oleh" value={data.mengetahui} />
                        <DetailItem icon={<Info />} label="Deskripsi" value={<p className="text-base  font-normal">{data.desk || '-'}</p>} />
                        
                        <hr className="border-slate-700" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <DetailItem icon={<Hash />} label="Status" value={<Tag status={data.status} />} />
                            <DetailItem icon={<DollarSign />} label="Total Dana" value={<span className="text-cyan-400">{formatCurrency(data.dana)}</span>} />
                        </div>
                    </div>

                    {/* Kolom Kanan: Lampiran */}
                    <div className="lg:col-span-1  backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col">
                        <h3 className="text-lg font-bold mb-4">Lampiran Bukti</h3>
                        <div className="flex-grow mt-2 p-2 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/50 min-h-[300px]">
                            {data.file ? (
                                <a href={`/storage/${data.file}`} target="_blank" rel="noopener noreferrer" title="Klik untuk melihat gambar penuh">
                                    <img
                                        src={`/storage/${data.file}`}
                                        alt={`Bukti untuk ${data.name}`}
                                        className="max-w-full max-h-[500px] object-contain rounded-md"
                                    />
                                </a>
                            ) : (
                                <p className="text-slate-500">Tidak ada lampiran.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
