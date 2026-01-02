import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Send, ChevronRight } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Product Information', href: '/products' },
  { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
  { title: 'Send Product', href: '/products/c_send' },
];

// Komponen FormField untuk konsistensi
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</Label>
        <div className="mt-1.5">
            {children}
        </div>
    </div>
);

// Komponen input/select/textarea dengan gaya baru
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
);
const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
);
const StyledTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <Textarea {...props} className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
);

// Komponen Section untuk memisahkan bagian form
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center">
            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">{title}</h3>
        </div>
        <div className="mt-4 pl-5 border-l-2 border-gray-200 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
             </div>
        </div>
    </div>
);


export default function SendToGKA() {

    const {data, setData, post, processing, errors } = useForm({
        product: '', date: '', no_invoice: '', nm_supplier: '', j_brg: '', desk: '',
        qty_out: '', price_out: '', amount_out: '', keping_out: '', kualitas_out: '', status: '',
    });

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send To GKA" />
             <div className="bg-gray-50 dark:bg-gray-900/50 py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                             <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tighter">Send Product to GKA</h1>
                             <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Buat catatan pengiriman produk baru.</p>
                        </div>
                        <Link href={route('products.tsa')}>
                            <Button variant="ghost" className='flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'>
                                <Undo2 size={16} />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-8">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription>
                                <ul>{Object.values(errors).map((message, i) => <li key={i}>{message}</li>)}</ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-200 dark:border-gray-700'>
                        <FormSection title="Detail Utama Pengiriman">
                            <FormField label="Product">
                                <StyledSelect value={data.product} onChange={(e) => setData('product', e.target.value)} required>
                                    <option value="" disabled>Pilih Jenis Product</option>
                                    <option value="Karet">Karet</option>
                                    <option value="Kelapa">Kelapa</option>
                                    <option value="Pupuk">Pupuk</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Tanggal Kirim">
                                <StyledInput type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} />
                            </FormField>
                            <FormField label="No. Bukti">
                                <StyledInput placeholder='Nomor Bukti' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </FormField>
                            <FormField label="Supplier Asal">
                                <StyledSelect value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} required>
                                    <option value="" disabled>Pilih Supplier</option>
                                    <option value="Sebayar">Sebayar</option>
                                    <option value="Temadu">Temadu</option>
                                    <option value="Agro">GK Agro</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Status Pengiriman">
                                <StyledSelect value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                                    <option value="" disabled>Status</option>
                                    <option value="gka">To GKA</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Jenis Barang">
                                <StyledInput placeholder='Contoh: Lateks' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} />
                            </FormField>
                            <div className="md:col-span-2 lg:col-span-3">
                                <FormField label="Informasi Pembeli">
                                    <StyledTextarea placeholder='Jika pembeli adalah perusahaan, tulis nama lengkap' value={data.desk} onChange={(e) => setData('desk', e.target.value)} />
                                </FormField>
                            </div>
                        </FormSection>

                        <hr className="border-gray-200 dark:border-gray-700" />

                        <FormSection title="Data Stok Keluar">
                             <FormField label="Quantity (Kg)">
                                <StyledInput placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} />
                             </FormField>
                             <FormField label="Amount">
                                <StyledInput placeholder='Amount' value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)} />
                             </FormField>
                             <FormField label="Keping / Buah">
                                <StyledInput placeholder='Keping Keluar' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} />
                             </FormField>
                             <FormField label="Kualitas">
                                <StyledInput placeholder='Kualitas' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} />
                             </FormField>
                        </FormSection>

                        <div className='flex justify-end pt-4'>
                            <Button type='submit' disabled={processing} className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'>
                                <Send size={16} />
                                {processing ? 'Mengirim...' : 'Kirim Produk'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

