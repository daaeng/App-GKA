<?php

namespace App\Http\Controllers;

use App\Models\PpbHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule; // (TAMBAHAN BARU)

class PpbController extends Controller
{
    /**
     * Menampilkan halaman list PPB dengan pagination dan search.
     */
    public function index(Request $request): Response
    {
        $perPage = 10;
        $searchTerm = $request->input('search');

        $ppbs = PpbHeader::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('nomor', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            })
            ->orderBy('tanggal', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        $ppbs->getCollection()->transform(function ($ppb) {
            $ppb->grand_total_formatted = 'Rp ' . number_format($ppb->grand_total, 0, ',', '.');
            $ppb->tanggal_formatted = (new \DateTime($ppb->tanggal))->format('d-m-Y');
            return $ppb;
        });

        $totalPpb = PpbHeader::count();
        $totalPending = PpbHeader::where('status', 'pending')->count();
        $totalApproved = PpbHeader::where('status', 'approved')->count();
        $sumApprovedAmount = PpbHeader::where('status', 'approved')->sum('grand_total');

        return Inertia::render('Ppb/Index', [
            'ppbs' => $ppbs,
            'filter' => $request->only('search'),
            'stats' => [
                'totalPpb' => $totalPpb,
                'totalPending' => $totalPending,
                'totalApproved' => $totalApproved,
                'sumApprovedAmount' => $sumApprovedAmount,
            ],
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    /**
     * Menampilkan form untuk membuat PPB baru.
     */
    public function create(): Response
    {
        return Inertia::render('Ppb/CreatePpb');
    }

    /**
     * Menyimpan PPB baru (Header dan Items) ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date',
            'nomor' => 'required|string|max:255|unique:ppb_headers,nomor',
            // ... (validasi lainnya)
            'items' => 'required|array|min:1',
            'items.*.nama_barang' => 'required|string|max:255',
            // ... (validasi item lainnya)
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            $grandTotal = 0;
            foreach ($request->items as $item) {
                $grandTotal += $item['jumlah'] * $item['harga_satuan'];
            }

            $header = PpbHeader::create(
                array_merge($request->except('items'), [
                    'grand_total' => $grandTotal
                    // status akan di-set otomatis oleh Model
                ])
            );

            foreach ($request->items as $itemData) {
                $header->items()->create([
                    'nama_barang' => $itemData['nama_barang'],
                    'jumlah' => $itemData['jumlah'],
                    'satuan' => $itemData['satuan'],
                    'harga_satuan' => $itemData['harga_satuan'],
                    'harga_total' => $itemData['jumlah'] * $itemData['harga_satuan'],
                    'keterangan' => $itemData['keterangan'],
                ]);
            }

            DB::commit();
            
            return redirect()->route('ppb.show', $header->id)->with('message', 'Pengajuan Permintaan Barang berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['db' => 'Gagal menyimpan data ke database: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Menampilkan detail PPB yang sudah dibuat (format surat).
     */
    public function show(string $id): Response
    {
        $ppb = PpbHeader::with('items')->findOrFail($id);

        return Inertia::render('Ppb/ShowPpb', [
            'ppb' => $ppb,
            'flash' => [ // (TAMBAHAN BARU) Kirim flash message ke show
                'message' => session('message')
            ]
        ]);
    }

    /**
     * (FUNGSI BARU)
     * Update status PPB (Approve/Reject).
     */
    public function updateStatus(Request $request, PpbHeader $ppb): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['approved', 'rejected'])],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        if ($ppb->status !== 'pending') {
            return back()->withErrors(['status' => 'Pengajuan ini sudah tidak bisa diubah statusnya.']);
        }

        $ppb->status = $request->status;
        $ppb->save();

        $message = $request->status === 'approved' ? 'Pengajuan berhasil disetujui.' : 'Pengajuan berhasil ditolak.';

        return redirect()->route('ppb.show', $ppb->id)->with('message', $message);
    }

    /**
     * Menghapus data PPB.
     */
    public function destroy(PpbHeader $ppb): RedirectResponse
    {
        // (TAMBAHAN LOGIKA)
        // Sebaiknya, jangan boleh hapus jika sudah di-approve
        if ($ppb->status === 'approved') {
            return back()->withErrors(['delete' => 'Pengajuan yang sudah disetujui tidak dapat dihapus.']);
        }
        
        $ppb->delete(); // onDelete('cascade') akan menghapus items

        return redirect()->route('ppb.index')->with('message', 'Pengajuan PPB berhasil dihapus.');
    }
}