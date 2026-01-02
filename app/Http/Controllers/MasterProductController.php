<?php

namespace App\Http\Controllers;

use App\Models\MasterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterProductController extends Controller
{
    /**
     * Tampilkan halaman daftar Master Produk
     */
    public function index()
    {
        return Inertia::render('MasterProducts/Index', [
            'products' => MasterProduct::orderBy('name', 'asc')->get()
        ]);
    }

    /**
     * Simpan Master Produk Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'unit' => 'required|string|max:20', // Kg, Ton, Pcs, dll
        ]);

        MasterProduct::create($validated);

        return redirect()->back()->with('message', 'Produk baru berhasil ditambahkan ke Master Data.');
    }

    /**
     * Hapus Master Produk
     */
    public function destroy(MasterProduct $masterProduct)
    {
        // Cek dulu apakah produk ini sudah dipakai di transaksi?
        // Kalau sudah ada transaksi, sebaiknya jangan dihapus biar data tidak rusak.
        if ($masterProduct->incomingStocks()->exists() || $masterProduct->outgoingStocks()->exists()) {
             return redirect()->back()->with('error', 'Produk tidak bisa dihapus karena sudah ada riwayat transaksi.');
        }

        $masterProduct->delete();

        return redirect()->back()->with('message', 'Produk berhasil dihapus.');
    }
}
