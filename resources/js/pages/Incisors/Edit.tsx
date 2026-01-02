// ./resources/js/Pages/Incisors/edit.tsx

import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, Calendar, CircleAlert, Hash, MapPin, Save, Undo2, User, UserCheck } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Penoreh', href: '/incisors' },
    { title: 'Edit', href: '#' },
];

export default function IncisorEdit({ incisor }: { incisor: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: incisor.name || '',
        nik: incisor.nik || '',
        ttl: incisor.ttl || '',
        gender: incisor.gender || '',
        address: incisor.address || '',
        agama: incisor.agama || '',
        status: incisor.status || '',
        no_invoice: incisor.no_invoice || '',
        lok_toreh: incisor.lok_toreh || '',
        is_active: incisor.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('incisors.update', incisor.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Penoreh" />
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
                <div className="flex justify-between items-center">
                    <Heading title="Edit Data Penoreh" description={`Update info ${incisor.name}`} />
                    <Link href={route('incisors.index')}><Button variant="outline"><Undo2 className="mr-2 h-4 w-4" /> Kembali</Button></Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    {Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"><CircleAlert className="h-4 w-4"/><AlertTitle>Error</AlertTitle><AlertDescription>Cek inputan.</AlertDescription></Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Section Status (Highlight) */}
                        <div className={`p-5 rounded-xl border-l-4 transition-all ${data.is_active ? 'bg-white border-emerald-500 shadow-sm' : 'bg-gray-100 border-gray-400'}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <Label htmlFor="is_active" className="text-base font-bold flex items-center gap-2">
                                        <UserCheck className="w-5 h-5"/> Status Keaktifan
                                    </Label>
                                    <p className="text-sm text-gray-500 mt-1">Ubah status ini jika penoreh berhenti bekerja.</p>
                                </div>
                                <select 
                                    id="is_active" 
                                    value={data.is_active ? '1' : '0'} 
                                    onChange={(e) => setData('is_active', e.target.value === '1')}
                                    className={`w-full sm:w-48 h-10 px-3 rounded-md border text-sm font-medium focus:ring-2 ${data.is_active ? 'border-emerald-300 bg-emerald-50 text-emerald-800 focus:ring-emerald-500' : 'border-gray-300 bg-gray-200 text-gray-700 focus:ring-gray-500'}`}
                                >
                                    <option value="1">🟢 Aktif</option>
                                    <option value="0">⚫ Non-Aktif (Berhenti)</option>
                                </select>
                            </div>
                        </div>

                        {/* Section Info Pribadi */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="md:col-span-2 font-semibold text-lg border-b pb-2 mb-2">Informasi Pribadi</h3>
                            <div className="space-y-2"><Label>Nama</Label><Input value={data.name} onChange={e=>setData('name', e.target.value)}/></div>
                            <div className="space-y-2"><Label>NIK</Label><Input value={data.nik} onChange={e=>setData('nik', e.target.value)}/></div>
                            <div className="space-y-2"><Label>Gender</Label><select value={data.gender} onChange={e=>setData('gender', e.target.value)} className="w-full h-10 rounded-md border-gray-300"><option value="Laki - laki">Laki - laki</option><option value="Perempuan">Perempuan</option></select></div>
                            <div className="space-y-2"><Label>Tgl Lahir</Label><Input type="date" value={data.ttl} onChange={e=>setData('ttl', e.target.value)}/></div>
                            <div className="md:col-span-2 space-y-2"><Label>Alamat</Label><Textarea value={data.address} onChange={e=>setData('address', e.target.value)} className="min-h-[80px]"/></div>
                        </div>

                        {/* Section Administrasi */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h3 className="md:col-span-2 font-semibold text-lg border-b pb-2 mb-2">Administrasi</h3>
                            <div className="space-y-2"><Label>Kode Penoreh</Label><Input value={data.no_invoice} onChange={e=>setData('no_invoice', e.target.value)}/></div>
                            <div className="space-y-2"><Label>Lokasi</Label><select value={data.lok_toreh} onChange={e=>setData('lok_toreh', e.target.value)} className="w-full h-10 rounded-md border-gray-300"><option value="Temadu">Temadu</option><option value="Sebayar">Sebayar</option></select></div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}