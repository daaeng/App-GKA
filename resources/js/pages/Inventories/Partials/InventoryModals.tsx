import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inventory, User } from '@/types';
import { FormEventHandler, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface InventoryModalProps extends ModalProps {
    inventory: Inventory;
}

// Modal for adding a new inventory item
export function NewItemModal({ isOpen, onClose }: ModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        unit: '',
        low_stock_threshold: 5,
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inventories.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="unit">Unit (e.g., pcs, box, rim)</Label>
                        <Input id="unit" value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                        {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                    </div>
                    <div>
                        <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                        <Input id="low_stock_threshold" type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', parseInt(e.target.value))} />
                        {errors.low_stock_threshold && <p className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={processing}>Save Item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Modal for editing an inventory item
export function EditItemModal({ isOpen, onClose, inventory }: InventoryModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: inventory.name,
        unit: inventory.unit,
        low_stock_threshold: inventory.low_stock_threshold,
    });

    useEffect(() => {
        if (inventory) {
            setData({
                name: inventory.name,
                unit: inventory.unit,
                low_stock_threshold: inventory.low_stock_threshold,
            });
        }
    }, [inventory, isOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('inventories.update', inventory.id), {
            onSuccess: () => onClose(),
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit: {inventory.name}</DialogTitle>
                </DialogHeader>
                 <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="unit">Unit (e.g., pcs, box, rim)</Label>
                        <Input id="unit" value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                        {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                    </div>
                    <div>
                        <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                        <Input id="low_stock_threshold" type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', parseInt(e.target.value))} />
                        {errors.low_stock_threshold && <p className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={processing}>Update Item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Modal for deleting an item
export function DeleteItemModal({ isOpen, onClose, inventory }: InventoryModalProps) {
    const { delete: destroy, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('inventories.destroy', inventory.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Item: {inventory.name}?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently delete this item? You can only delete items with 0 stock.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={submit} disabled={processing}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Modal for adding stock (Stock In)
export function StockInModal({ isOpen, onClose, inventory }: InventoryModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: 1,
        transaction_date: new Date().toISOString().split('T')[0],
        source: '',
    });

     useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inventories.stockIn', inventory.id), {
            onSuccess: () => onClose(),
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Stock for: {inventory.name}</DialogTitle>
                    <DialogDescription>Current Stock: {inventory.stock} {inventory.unit}</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="quantity">Quantity In</Label>
                        <Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', parseInt(e.target.value))} />
                         {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                     <div>
                        <Label htmlFor="transaction_date">Transaction Date</Label>
                        <Input id="transaction_date" type="date" value={data.transaction_date} onChange={(e) => setData('transaction_date', e.target.value)} />
                        {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>}
                    </div>
                     <div>
                        <Label htmlFor="source">Source (e.g. Vendor Name)</Label>
                        <Input id="source" value={data.source} onChange={(e) => setData('source', e.target.value)} />
                        {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={processing}>Add Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Modal for taking stock (Stock Out)
export function StockOutModal({ isOpen, onClose, inventory, users }: InventoryModalProps & { users: User[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: 1,
        transaction_date: new Date().toISOString().split('T')[0],
        user_id: '',
        description: '',
    });

     useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inventories.stockOut', inventory.id), {
            onSuccess: () => onClose(),
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Take Stock for: {inventory.name}</DialogTitle>
                    <DialogDescription>Current Stock: {inventory.stock} {inventory.unit}</DialogDescription>
                </DialogHeader>
                 <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="quantity_out">Quantity Out</Label>
                        <Input id="quantity_out" type="number" min="1" max={inventory.stock} value={data.quantity} onChange={(e) => setData('quantity', parseInt(e.target.value))} />
                         {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                     <div>
                        <Label htmlFor="date_out">Transaction Date</Label>
                        <Input id="date_out" type="date" value={data.transaction_date} onChange={(e) => setData('transaction_date', e.target.value)} />
                        {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>}
                    </div>
                     <div>
                        <Label htmlFor="user_id">Taken By</Label>
                         <Select onValueChange={(value) => setData('user_id', value)} value={data.user_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select employee..." />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                    </div>
                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="destructive" disabled={processing}>Take Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
