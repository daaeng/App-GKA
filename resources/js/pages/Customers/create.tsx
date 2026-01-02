import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Undo2, Building2, MapPin, FileText, ChevronRight, CircleAlert } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customer Management', href: '/customers' },
    { title: 'Tambah Customer', href: '/customers/create' },
];

// --- Helper Components untuk Styling Konsisten ---
const FormField = ({ label, icon, children }: { label: string, icon?: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center gap-1.5 mb-1.5">
            {icon && <span className="text-blue-500">{icon}</span>}
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</Label>
        </div>
        <div>{children}</div>
    </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
);

const StyledTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <Textarea {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px]" />
);

const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8 last:mb-0">
        <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700 pb-2 mb-6">
            <ChevronRight className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {children}
        </div>
    </div>
);

export default function CustomerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        npwp: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Customer Baru" />

            <div className="bg-gray-50 dark:bg-black py-8 min-h-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tambah Customer Baru</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Isi formulir di bawah untuk mendaftarkan mitra atau pelanggan baru.</p>
                        </div>
                        <Link href={route('customers.index')}>
                            <Button variant="outline" className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300">
                                <Undo2 size={16} /> Kembali
                            </Button>
                        </Link>
                    </div>

                    {/* Alert Error Global (Jika ada) */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription>
                                Mohon periksa kembali inputan Anda.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit}>

                                <FormSection title="Identitas Perusahaan / Perorangan">
                                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                        <FormField label="Nama Customer / PT" icon={<Building2 size={14} />}>
                                            <StyledInput
                                                id="name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="Contoh: PT. Sumber Makmur Jaya"
                                                required
                                                autoFocus
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                                        </FormField>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                        <FormField label="Nomor Pokok Wajib Pajak (NPWP)" icon={<FileText size={14} />}>
                                            <StyledInput
                                                id="npwp"
                                                value={data.npwp}
                                                onChange={e => setData('npwp', e.target.value)}
                                                placeholder="XX.XXX.XXX.X-XXX.XXX"
                                            />
                                            {errors.npwp && <p className="mt-1 text-xs text-red-500 font-medium">{errors.npwp}</p>}
                                        </FormField>
                                    </div>
                                </FormSection>

                                <FormSection title="Lokasi & Alamat">
                                    <div className="col-span-1 md:col-span-2">
                                        <FormField label="Alamat Lengkap" icon={<MapPin size={14} />}>
                                            <StyledTextarea
                                                id="address"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder="Nama Jalan, Nomor Gedung, Kelurahan, Kecamatan, Kota..."
                                            />
                                            {errors.address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.address}</p>}
                                        </FormField>
                                    </div>
                                </FormSection>

                                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center"
                                    >
                                        <Save size={18} />
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
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
