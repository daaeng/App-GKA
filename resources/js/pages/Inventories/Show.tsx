import { Head, Link } from '@inertiajs/react';
import { PageProps, Inventory as InventoryType } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// PERBAIKAN 2: Menambahkan breadcrumbs
const breadcrumbs = [
    // {
    //     label: 'Dashboard',
    //     url: route('dashboard'),
    // },
    {
        label: 'Inventory',
        url: route('inventories.index'),
    },
    {
        label: 'History',
    },
];

export default function Show({ auth, inventory }: PageProps<{ inventory: InventoryType }>) {
    
    return (
        // PERBAIKAN 3: Mengganti layout dan menambahkan breadcrumbs
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`History for ${inventory.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Button asChild variant="outline">
                            <Link href={route('inventories.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory List
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>{inventory.name} - Transaction History</CardTitle>
                            <CardDescription>
                                Current Stock: {inventory.stock} {inventory.unit}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory.transactions?.map((trx) => (
                                        <TableRow key={trx.id}>
                                            <TableCell>{new Date(trx.transaction_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {trx.type === 'in' ? (
                                                    <Badge className="bg-green-500 text-white">IN</Badge>
                                                ) : (
                                                    <Badge className="bg-red-500 text-white">OUT</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className={trx.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                                               {trx.type === 'in' ? '+' : '-'}{trx.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {trx.type === 'in' && `Source: ${trx.source}`}
                                                {trx.type === 'out' && `Taken by: ${trx.user?.name || 'N/A'} - ${trx.description}`}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

