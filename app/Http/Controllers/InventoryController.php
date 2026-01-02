<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $inventories = Inventory::orderBy('name')->get();
        // Ambil daftar user untuk form "pengambil"
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Inventories/Index', [
            'inventories' => $inventories,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:inventories,name',
            'unit' => 'required|string|max:50',
            'low_stock_threshold' => 'required|integer|min:0',
        ]);

        Inventory::create($request->all());

        return redirect()->route('inventories.index')->with('success', 'Inventory item created successfully.');
    }

    public function update(Request $request, Inventory $inventory)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:inventories,name,' . $inventory->id,
            'unit' => 'required|string|max:50',
            'low_stock_threshold' => 'required|integer|min:0',
        ]);

        $inventory->update($request->all());

        return redirect()->route('inventories.index')->with('success', 'Inventory item updated successfully.');
    }

    public function destroy(Inventory $inventory)
    {
        // Pastikan tidak ada stok sebelum menghapus untuk keamanan data
        if ($inventory->stock > 0) {
            return redirect()->route('inventories.index')->with('error', 'Cannot delete item with existing stock.');
        }
        $inventory->delete();
        return redirect()->route('inventories.index')->with('success', 'Inventory item deleted successfully.');
    }

    public function stockIn(Request $request, Inventory $inventory)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'transaction_date' => 'required|date',
            'source' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($request, $inventory) {
            $inventory->increment('stock', $request->quantity);

            $inventory->transactions()->create([
                'type' => 'in',
                'quantity' => $request->quantity,
                'transaction_date' => $request->transaction_date,
                'source' => $request->source,
                'user_id' => Auth::id(), // User yang melakukan input
            ]);
        });

        return redirect()->route('inventories.index')->with('success', 'Stock added successfully.');
    }

    public function stockOut(Request $request, Inventory $inventory)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:' . $inventory->stock,
            'transaction_date' => 'required|date',
            'user_id' => 'required|exists:users,id', // Pengambil
            'description' => 'required|string|max:500',
        ]);

        DB::transaction(function () use ($request, $inventory) {
            $inventory->decrement('stock', $request->quantity);

            $inventory->transactions()->create([
                'type' => 'out',
                'quantity' => $request->quantity,
                'transaction_date' => $request->transaction_date,
                'user_id' => $request->user_id,
                'description' => $request->description,
            ]);
        });

        return redirect()->route('inventories.index')->with('success', 'Stock taken successfully.');
    }

    public function show(Inventory $inventory)
    {
        $inventory->load(['transactions.user:id,name']);

        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory,
        ]);
    }
}
