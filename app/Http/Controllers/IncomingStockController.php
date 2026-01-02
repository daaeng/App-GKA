<?php

namespace App\Http\Controllers;

use App\Models\IncomingStock;
use App\Models\MasterProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class IncomingStockController extends Controller
{
    /**
     * Halaman TSA: Stok Masuk
     */
    public function tsa(Request $request)
    {
        $perPage = 20;
        $searchTerm = $request->input('search');
        // [UBAH] Default jadi 'all-time' agar data langsung muncul
        $timePeriod = $request->input('time_period', 'all-time');
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);

        // 1. QUERY DASAR
        $query = IncomingStock::with('product');

        // [OPSIONAL] Filter Nama Produk (Saya matikan dulu agar semua produk muncul)
        // $query->whereHas('product', function($q) {
        //     $q->where('name', 'like', '%karet%');
        // });

        // 2. Filter Pencarian
        $query->when($searchTerm, function ($q, $search) {
            $q->where(function($sub) use ($search) {
                $sub->where('nm_supplier', 'like', "%{$search}%")
                    ->orWhere('no_po', 'like', "%{$search}%")
                    ->orWhereHas('product', function($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    });
            });
        });

        // 3. Filter Waktu
        if ($timePeriod === 'specific-month') {
            $query->whereMonth('date', $selectedMonth)->whereYear('date', $selectedYear);
        } elseif ($timePeriod !== 'all-time') {
            switch ($timePeriod) {
                case 'today': $query->whereDate('date', Carbon::today()); break;
                case 'this-week': $query->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]); break;
                case 'this-month': $query->whereMonth('date', Carbon::now()->month)->whereYear('date', Carbon::now()->year); break;
                case 'this-year': $query->whereYear('date', Carbon::now()->year); break;
            }
        }

        // 4. Hitung Statistik (Sebelum Pagination)
        $statsQuery = clone $query;
        $totalBerat = $statsQuery->sum('qty_net'); // Total Kg
        $totalUang = $statsQuery->sum('total_amount'); // Total Rupiah

        // 5. Pagination
        $products2 = $query->orderBy('date', 'DESC')->paginate($perPage, ['*'], 'page2');

        return Inertia::render('Products/tsa', [
            "products2" => $products2,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth,
            "currentYear" => (int)$selectedYear,

            // Data Statistik Card
            "hsl_karet" => $totalBerat,
            "saldoin" => $totalUang,
        ]);
    }

    // ... (Biarkan fungsi create, store, edit, update, destroy, show di bawah ini tetap ada) ...

    public function create(Request $request)
    {
        $prefill = [
            'date' => $request->input('prefill_date'),
            'nm_supplier' => $request->input('prefill_supplier'),
            'qty_net' => $request->input('prefill_qty'),
            'keping' => $request->input('prefill_keping'),
            'kualitas' => $request->input('prefill_kualitas'),
            'no_po' => $request->input('prefill_ref'),
        ];

        return Inertia::render('Products/CreateIncoming', [
            'master_products' => MasterProduct::select('id', 'name', 'code')->get(),
            'prefillData' => $prefill, // Kirim ke frontend
        ]);
    }

    public function checkIncisedStock(Request $request)
    {
        $dateInput = $request->input('date');
        $supplier = $request->input('supplier'); // Temadu / Sebayar

        if (!$dateInput || !$supplier) {
            return response()->json(['qty' => 0, 'keping' => 0, 'found' => false, 'new_ref' => '']);
        }

        // --- 1. AMBIL DATA STOK DARI INCISED ---
        $summary = \App\Models\Incised::query()
            ->whereDate('date', $dateInput)
            ->where('lok_kebun', 'LIKE', "%{$supplier}%")
            ->selectRaw('COALESCE(SUM(qty_kg), 0) as total_kg, COALESCE(SUM(keping), 0) as total_keping')
            ->first();

        $totalKg = floatval($summary->total_kg);
        $totalKeping = intval($summary->total_keping);


        // --- 2. GENERATE NO REFERENSI OTOMATIS ---
        // Format: PBK.XII-TMD-01/25

        $dt = Carbon::parse($dateInput);
        $year2Digit = $dt->format('y'); // 25
        $monthRomawi = $this->getRomawi($dt->format('n')); // 12 -> XII

        // Tentukan Kode Lokasi
        $locCode = 'GEN'; // Default
        if (stripos($supplier, 'Temadu') !== false) $locCode = 'TMD';
        if (stripos($supplier, 'Sebayar') !== false) $locCode = 'SBYR';
        if (stripos($supplier, 'Agro') !== false) $locCode = 'AGR';

        // Hitung Nomor Urut (Berdasarkan transaksi bulan & tahun tersebut)
        // Kita hitung jumlah record di IncomingStock pada bulan & tahun yg sama
        $countExisting = IncomingStock::whereYear('date', $dt->year)
            ->whereMonth('date', $dt->month)
            ->count();

        $nextSequence = str_pad($countExisting + 1, 2, '0', STR_PAD_LEFT); // 1 -> 01, 10 -> 10

        // Rakit String
        $generatedRef = "PBK.{$monthRomawi}-{$locCode}-{$nextSequence}/{$year2Digit}";


        return response()->json([
            'qty' => $totalKg,
            'keping' => $totalKeping,
            'found' => ($totalKg > 0),
            'new_ref' => $generatedRef // Kirim ke frontend
        ]);
    }

    private function getRomawi($monthNumber) {
        $map = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        return $map[$monthNumber];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'product_id' => 'required|exists:master_products,id',
            'nm_supplier' => 'required|string',
            'qty_net' => 'required|numeric',
            'price_per_kg' => 'nullable|numeric',
            'total_amount' => 'nullable|numeric',
            'keping' => 'nullable|numeric',
            'kualitas' => 'nullable|string',
            'no_po' => 'nullable|string',
        ]);

        IncomingStock::create($validated);

        return redirect()->route('products.tsa')->with('message', 'Data stok masuk berhasil disimpan.');
    }

    public function edit(IncomingStock $incomingStock)
    {
        return Inertia::render('Products/EditIncoming', [
            'stock' => $incomingStock,
            'master_products' => MasterProduct::select('id', 'name', 'code')->get()
        ]);
    }

    public function update(Request $request, IncomingStock $incomingStock)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'product_id' => 'required|exists:master_products,id',
            'nm_supplier' => 'required|string',
            'qty_net' => 'required|numeric',
            'price_per_kg' => 'nullable|numeric',
            'total_amount' => 'nullable|numeric',
            'keping' => 'nullable|numeric',
            'kualitas' => 'nullable|string',
            'no_po' => 'nullable|string',
        ]);

        $incomingStock->update($validated);
        return redirect()->route('products.tsa')->with('message', 'Data berhasil diperbarui.');
    }

    public function destroy(IncomingStock $incomingStock)
    {
        $incomingStock->delete();
        return redirect()->back()->with('message', 'Data berhasil dihapus.');
    }

    public function show(IncomingStock $incomingStock)
    {
        return Inertia::render('Products/ShowIncoming', [
            'stock' => $incomingStock->load('product'),
        ]);
    }
}
