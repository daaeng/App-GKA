import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight, Building2, FolderOpen, PackagePlus,
    Sprout, Trees, LayoutGrid, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
];

export default function Index() {
    // Data Menu Modul
    const products = [
        {
            name: 'PT. Garuda Karya Amanat',
            description: 'Manajemen stok gudang utama, penjualan (outgoing), dan laporan keuangan.',
            icon: Building2,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/20',
            border: 'hover:border-amber-500',
            btnColor: 'text-amber-600 hover:text-amber-700',
            route: 'products.gka',
        },
        {
            name: 'Karet Temadu-Sebayar',
            description: 'Monitoring pembelian karet dari supplier/kebun dan stok masuk (TSA).',
            icon: Trees,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            border: 'hover:border-blue-500',
            btnColor: 'text-blue-600 hover:text-blue-700',
            route: 'products.tsa',
        },
        {
            name: 'Agro & Lainnya',
            description: 'Pencatatan komoditas lain seperti Pupuk, Kelapa, dan hasil bumi lainnya.',
            icon: Sprout,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/20',
            border: 'hover:border-emerald-500',
            btnColor: 'text-emerald-600 hover:text-emerald-700',
            route: 'products.agro',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Information" />

            {can('products.view') && (
                <div className="min-h-screen bg-gray-50/50 dark:bg-black py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
                                        <LayoutGrid className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    Product Information
                                </h1>
                                <p className="text-gray-500 mt-2 text-lg">
                                    Pilih modul manajemen stok dan penjualan yang ingin Anda kelola.
                                </p>
                            </div>

                            {/* Action Buttons (Master Data) */}
                            {can('products.create') && (
                                <div className="flex flex-wrap gap-3">
                                    <Link href={route('products.allof')}>
                                        <Button variant="outline" className="bg-white dark:bg-zinc-900 border-gray-300 hover:bg-gray-50 shadow-sm h-11 px-5 rounded-lg">
                                            <FolderOpen size={18} className="mr-2 text-gray-500" />
                                            Semua Data
                                        </Button>
                                    </Link>
                                    <Link href={route('master-products.index')}>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 h-11 px-5 rounded-lg transition-all hover:-translate-y-0.5">
                                            <PackagePlus size={18} className="mr-2" />
                                            Master Data Barang
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, idx) => (
                                <Link key={idx} href={route(product.route)} className="group">
                                    <Card className={`h-full border-2 border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-zinc-900 ${product.border} dark:border-zinc-800`}>
                                        <CardHeader>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${product.bg}`}>
                                                <product.icon size={28} className={product.color} />
                                            </div>
                                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                {product.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base text-gray-500 leading-relaxed">
                                                {product.description}
                                            </CardDescription>
                                        </CardContent>
                                        <CardFooter className="pt-4">
                                            <div className={`flex items-center text-sm font-semibold ${product.btnColor} group-hover:underline decoration-2 underline-offset-4`}>
                                                Buka Modul <ChevronRight size={16} className="ml-1" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Footer Info / Stats Summary (Opsional) */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center">
                            <p className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} Sistem Informasi Manajemen Stok - PT. Garuda Karya Amanat
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </AppLayout>
    );
}
