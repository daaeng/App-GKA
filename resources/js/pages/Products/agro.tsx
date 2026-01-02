import { useState, useEffect } from 'react';

// Diasumsikan komponen-komponen ini ada di direktori yang sesuai
// dan diekspor sebagai default atau named export.
// Path diubah dari alias '@/' menjadi path relatif.
import Heading from '../../components/heading';
import AppLayout from '../../layouts/app-layout';
import { can } from '../../lib/can';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Head, Link, router } from '@inertiajs/react';
import { CirclePlus, Eye, FileDown, Megaphone, Package, Send, Search, Sprout, Trash, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'Garuda Karya Agro', href: '/products/tsa' },
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
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: { message?: string };
    products: {
        data: Product[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    products2: {
        data: Product[];
        links: PaginationLink[];
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
    tm_slin: number;
    tm_slou: number;
    tm_sin: number;
    tm_sou: number;
    ts_slin: number;
    ts_slou: number;
    ts_sin: number;
    ts_sou: number;
    filter?: { search?: string; time_period?: string }; // Added time_period to filter
    auth?: any;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function TsaPage({
    flash, products, products2, hsl_karet, saldoin, saldoout,
    tm_slin, tm_slou, tm_sin, tm_sou, filter,
}: PageProps) {
    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time'); // State for time period filter

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'all-time'); // Sync time period from props
    }, [filter?.search, filter?.time_period]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        // Trigger search when time period changes
        router.get(route('products.tsa'),
            { search: searchValue, time_period: value }, // Include time_period in the request
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou'], // Include all stats
            }
        );
    };

    const performSearch = () => {
        router.get(route('products.tsa'),
            { search: searchValue, time_period: timePeriod }, // Include time_period in the search
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou'], // Include all stats
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Do you want to delete this - ${id}. ${product}`)) {
            router.delete(route('products.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.get(route('products.tsa'), { search: searchValue, time_period: timePeriod }, { preserveState: true }); // Preserve time_period after delete
                },
            });
        }
    };

    const renderPagination = (pagination: PageProps['products']) => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => (
                    link.url === null ? (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={`link-${index}`}
                            href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '')} // Append search and time_period to pagination links
                            className={`px-4 py-2 text-sm rounded-md transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveState
                            preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    )
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="GK Agro" />
            <div className="h-full flex-col rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-black">
                <Heading title="Garuda Karya Agro" />
                <div className="mb-3">
                    <Link href={route('products.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full justify-center h-auto flex mb-5 gap-2'>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                            <CardHeader className="bg-blue-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Available Stock Pupuk</CardTitle>
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Package size={18} className="text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-blue-700">
                                <div className='grid grid-cols-2 gap-1'>
                                    <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoin)}</div>
                                    <div className="text-2xl font-bold row-span-2 flex justify-end">{hsl_karet} Kg</div>
                                    <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(saldoout)}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                            <CardHeader className="bg-amber-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Stock Gk Agro</CardTitle>
                                    <div className="rounded-lg bg-amber-100 p-2">
                                        <Sprout size={18} className="text-amber-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-amber-700">
                                <div className="grid grid-cols-2">
                                    <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(tm_slin)}</div>
                                    <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(tm_slou)}</div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{tm_sin} Kg</div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{tm_sou} Kg</div>
                                </div>
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        {flash?.message && (
                            <Alert className="mb-4">
                                <Megaphone className="h-4 w-4" />
                                <AlertTitle className="text-green-600">Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by supplier, invoice, item..."
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={performSearch}><Search className="h-4 w-4 mr-2" />Search</Button> {/* Added search button for consistency */}
                            <div className="flex items-center gap-2">
                                {/* Select filter by time period */}
                                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Select time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-time">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="this-week">This Week</SelectItem>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="this-year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                {can('products.create') && (
                                    <Link href={route('products.create')}>
                                        <Button className="bg-yellow-600 hover:bg-yellow-500">
                                            <CirclePlus className="w-4 h-4 mr-2" /> Product
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border p-4 rounded-lg">
                                <div className="font-bold text-xl mb-4">Data Pembelian Karet</div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty (IN)</TableHead>
                                                <TableHead>Outcome</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.data.length > 0 ? (
                                                products.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{product.date}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{product.qty_kg}</TableCell>
                                                        <TableCell>{formatCurrency(product.amount)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && <Link href={route('products.show', product.id)}><Button size="icon" variant="ghost"><Eye className="h-4 w-4 text-gray-500" /></Button></Link>}
                                                            {can('products.edit') && <Link href={route('products.edit', product.id)}><Button size="icon" variant="ghost"><Send className="h-4 w-4 text-blue-500" /></Button></Link>}
                                                            {can('products.delete') && <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id, product.product)}><Trash className="h-4 w-4 text-red-500" /></Button>}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No results found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products.data.length > 0 && renderPagination(products)}
                            </div>

                            <div className="border p-4 rounded-lg">
                                <div className="font-bold text-xl mb-4">Data Penjualan Karet</div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty (OUT)</TableHead>
                                                <TableHead>Income</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products2.data.length > 0 ? (
                                                products2.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{product.date}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{product.qty_kg}</TableCell>
                                                        <TableCell>{formatCurrency(product.amount)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && <Link href={route('products.show', product.id)}><Button size="icon" variant="ghost"><Eye className="h-4 w-4 text-gray-500" /></Button></Link>}
                                                            {/* {can('products.edit') && <Link href={route('products.edit', product.id)}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4 text-blue-500" /></Button></Link>}
                                                            {can('products.delete') && <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id, product.product)}><Trash className="h-4 w-4 text-red-500" /></Button>} */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No results found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products2.data.length > 0 && renderPagination(products2)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
