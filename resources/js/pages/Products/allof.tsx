import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Megaphone, Search, Sprout, TreePalm, Trees, TrendingDown, TrendingUp, Undo2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Tag_Karet from '@/components/ui/tag_karet';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
];

interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
    status: string;
}

// Definisikan tipe untuk link paginasi agar lebih aman
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: { message?: string };
    products: {
        data: Product[];
        links: PaginationLink[]; // Gunakan tipe yang sudah didefinisikan
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    hsl_karet: number;
    saldoin: number;
    saldoout: number;
    hsl_kelapa: number;
    saldoinklp: number;
    saldooutklp: number;
    hsl_pupuk: number;
    saldoinppk: number;
    saldooutppk: number;
    filter?: { search?: string; time_period?: string; month?: string; year?: string }; // Added month and year
    currentMonth: number; // New prop
    currentYear: number;   // New prop
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { // Menggunakan locale id-ID
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Biasanya Rupiah tidak pakai sen
    }).format(value);
};

export default function AllofPage({ // Ganti nama komponen agar lebih deskriptif
    hsl_karet, saldoin, saldoout, hsl_kelapa, saldoinklp, saldooutklp,
    hsl_pupuk, saldoinppk, saldooutppk, products, flash, filter, currentMonth, currentYear
}: PageProps) {
    const [searchValue, setSearchValue] = useState(filter?.search || '');
    
    // Improved useState initialization for timePeriod
    const [timePeriod, setTimePeriod] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Prioritize 'time_period' parameter from URL if present
        if (urlParams.has('time_period')) {
            return urlParams.get('time_period') || 'this-month'; // Fallback if parameter in URL is empty
        }

        // If no 'time_period' parameter in URL,
        // and the filter prop from the backend is 'all-time' (possibly due to Inertia state persistence),
        // then force 'this-month' for the initial display.
        if (filter?.time_period === 'all-time') {
            return 'this-month';
        }
        
        // If no parameter in URL and filter prop is not 'all-time',
        // use the value from the filter prop (which should be 'this-month' from PHP default)
        // or fallback to 'this-month' if filter.time_period is undefined/null.
        return filter?.time_period || 'this-month';
    });

    const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    // Sinkronisasi state dengan prop dari server
    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'this-month'); // Sync time period from props
        setSelectedMonth(String(filter?.month || currentMonth)); // Sync month from props
        setSelectedYear(String(filter?.year || currentYear));   // Sync year from props
    }, [filter?.search, filter?.time_period, filter?.month, filter?.year, currentMonth, currentYear]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        const params: { search: string; time_period: string; month?: string; year?: string } = {
            search: searchValue,
            time_period: value
        };

        if (value === 'specific-month') {
            const current = new Date();
            params.month = String(current.getMonth() + 1);
            params.year = String(current.getFullYear());
            setSelectedMonth(params.month);
            setSelectedYear(params.year);
        } else {
            // Clear month and year if not 'specific-month'
            setSelectedMonth(String(new Date().getMonth() + 1));
            setSelectedYear(String(new Date().getFullYear()));
        }

        // Trigger search when time period changes
        router.get(route('products.allof'),
            params, // Include time_period, month, and year in the request
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk', 'currentMonth', 'currentYear'], // Hanya minta data yang berubah, termasuk statistik
            }
        );
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        router.get(route('products.allof'),
            { search: searchValue, time_period: timePeriod, month: value, year: selectedYear },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk', 'currentMonth', 'currentYear'],
            }
        );
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        router.get(route('products.allof'),
            { search: searchValue, time_period: timePeriod, month: selectedMonth, year: value },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk', 'currentMonth', 'currentYear'],
            }
        );
    };

    const performSearch = () => {
        // Menggunakan router.get untuk navigasi
        router.get(route('products.allof'),
            { search: searchValue, time_period: timePeriod, month: selectedMonth, year: selectedYear }, // Data yang dikirim sebagai query string
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk', 'currentMonth', 'currentYear'], // Hanya minta data yang berubah, termasuk statistik
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    // Fungsi untuk render link paginasi menggunakan <Link> dari Inertia
    const renderPagination = (pagination: PageProps['products']) => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => {
                    // Periksa apakah link.url ada dan valid sebelum membuat objek URL
                    let url: URL | null = null;
                    try {
                        if (link.url) {
                            url = new URL(link.url);
                        }
                    } catch (e) {
                        console.error("Invalid URL encountered:", link.url, e);
                        // Jika URL tidak valid, kita bisa memilih untuk tidak merender link ini atau merender sebagai teks biasa
                        return (
                            <div
                                key={index}
                                className="px-4 py-2 text-sm text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    const currentParams = url ? new URLSearchParams(url.search) : new URLSearchParams();
                    
                    // Set the correct page parameter name
                    currentParams.set('page', currentParams.get('page') || link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));

                    // Append existing filters
                    if (searchValue) currentParams.set('search', searchValue);
                    if (timePeriod !== 'all-time') currentParams.set('time_period', timePeriod);
                    if (timePeriod === 'specific-month' && selectedMonth) currentParams.set('month', selectedMonth);
                    if (timePeriod === 'specific-month' && selectedYear) currentParams.set('year', selectedYear);

                    return link.url === null || !url ? ( // Tambahkan !url check di sini
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        // Gunakan komponen <Link> dari Inertia
                        <Link
                            key={`link-${index}`}
                            href={`${url.origin}${url.pathname}?${currentParams.toString()}`}
                            className={`px-4 py-2 text-sm rounded-md transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            // Opsi tambahan untuk efisiensi
                            preserveState
                            preserveScroll
                        >
                            {/* Membersihkan label dari entitas HTML */}
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    )
                })}
            </div>
        );
    };

    // Generate options for months (1-12)
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
    }));

    // Generate options for years (e.g., current year - 5 to current year + 1)
    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => ({
        value: String(currentYearNum - 5 + i),
        label: String(currentYearNum - 5 + i),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Product" />
            <div className="h-full flex-col rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-black">
                <Heading title="All Product Data Information" />
                <div className='mb-1'>
                    <Link href={route('products.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Kartu Uang Masuk (saldoin) */}
                    <Card className="shadow-2xl border-2 border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white transition-all duration-500 rounded-2xl hover:shadow-green-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <TreePalm className="mr-3 text-white drop-shadow-md" size={32} /> Available Stock Kelapa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {hsl_kelapa} kg
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-yellow-100">
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Pengeluaran: {formatCurrency(saldoinklp)}</span>
                                </div>
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Pemasukan: {formatCurrency(saldooutklp)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total KG (hsl_karet) */}
                    <Card className="shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-400 to-blue-600 text-white transition-all duration-500 rounded-2xl hover:shadow-blue-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Trees className="mr-3 text-white drop-shadow-md" size={32} /> Available Stock Karet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {hsl_karet} kg
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-blue-100">
                                <div className="flex items-center font-medium">
                                    <TrendingDown size={18} className="mr-1" />
                                    <span>Pengeluaran : {formatCurrency(saldoin)}</span>
                                </div>
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Pemasukan : {formatCurrency(saldoout)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Keping */}
                    <Card className="shadow-2xl border-2 border-yellow-500 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white transition-all duration-500 rounded-2xl hover:shadow-yellow-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Sprout className="mr-3 text-white drop-shadow-md" size={32} /> Available Stock Pupuk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {hsl_pupuk} kg
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-yellow-100">
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Pengeluaran: {formatCurrency(saldoinppk)}</span>
                                </div>
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Pemasukan: {formatCurrency(saldooutppk)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian Kartu Statistik
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                        <CardHeader className="bg-amber-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Kelapa</CardTitle>
                                <div className="rounded-lg bg-amber-100 p-2"><TreePalm size={18} className="text-amber-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-amber-700">
                            <div className="text-2xl font-bold">{hsl_kelapa}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinklp)}</div>
                            <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutklp)}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                        <CardHeader className="bg-blue-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Karet</CardTitle>
                                <div className="rounded-lg bg-blue-100 p-2"><Package size={18} className="text-blue-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-blue-700">
                            <div className="text-2xl font-bold">{hsl_karet}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoin)} <p>(Bayar Penoreh)</p></div>
                            <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(saldoout)} <p>(Hasil Jual)</p></div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                        <CardHeader className="bg-red-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Pupuk</CardTitle>
                                <div className="rounded-lg bg-red-100 p-2"><Wheat size={18} className="text-red-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-red-700">
                            <div className="text-2xl font-bold">{hsl_pupuk}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinppk)}</div>
                            <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutppk)}</div>
                        </CardContent>
                    </Card>
                </div> */}

                <Card>
                    <CardContent className="pt-6">
                        {flash?.message && (
                            <Alert className="mb-4">
                                <Megaphone className="h-4 w-4" />
                                <AlertTitle className="text-green-600">Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by product, supplier, invoice..."
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={performSearch}><Search className="h-4 w-4 mr-2" />Search</Button>
                            
                            <div className="flex items-center gap-2">
                                {/* Select filter by time period */}
                                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-time">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="this-week">This Week</SelectItem>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="last-month">Last Month</SelectItem> {/* Added "Last Month" */}
                                        <SelectItem value="this-year">This Year</SelectItem>
                                        <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                                    </SelectContent>
                                </Select>

                                {timePeriod === 'specific-month' && (
                                    <>
                                        <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Pilih Bulan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedYear} onValueChange={handleYearChange}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Pilih Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem key={year.value} value={year.value}>
                                                        {year.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Keping</TableHead>
                                        <TableHead>Qty (IN)</TableHead>
                                        <TableHead>Qty (OUT)</TableHead>
                                        <TableHead>Total Harga (IN)</TableHead>
                                        <TableHead>Total Harga (OUT)</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell key={`${product.id}-product`}>{product.product}</TableCell>
                                                <TableCell key={`${product.id}-date`}>{product.date}</TableCell>
                                                <TableCell key={`${product.id}-supplier`}>{product.nm_supplier}</TableCell>
                                                <TableCell key={`${product.id}-keping`}>{product.keping}</TableCell>
                                                <TableCell key={`${product.id}-qty-in`}>{product.qty_kg}</TableCell>
                                                <TableCell key={`${product.id}-qty-out`}>{product.qty_out}</TableCell>
                                                <TableCell key={`${product.id}-amount-in`}>{formatCurrency(product.amount)}</TableCell>
                                                <TableCell key={`${product.id}-amount-out`}>{formatCurrency(product.amount_out)}</TableCell>
                                                <TableCell key={`${product.id}-status`} className="text-center">
                                                    <Tag_Karet status={product.status} />
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Memanggil fungsi render paginasi yang sudah diperbaiki */}
                        {products.data.length > 0 && renderPagination(products)}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
