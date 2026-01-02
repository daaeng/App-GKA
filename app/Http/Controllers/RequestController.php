<?php

namespace App\Http\Controllers;

use App\Models\Requested;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RequestController extends Controller
{
    // ... (fungsi index, create, surat, show, edit, update tetap sama) ...

    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');

        $requests = Requested::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('devisi', 'like', "%{$search}%")
                    ->orWhere('j_pengajuan', 'like', "%{$search}%")
                    ->orWhere('mengetahui', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        $jml_rl = Requested::count();
        $totalPending = Requested::where('status', 'belum ACC')->count();
        $totalApproved = Requested::where('status', 'diterima')->count();
        $sumApprovedAmount = Requested::where('status', 'diterima')->sum('dana');

        $requests->getCollection()->transform(function ($request) {
            $request->dana_formatted = 'Rp ' . number_format($request->dana, 0, ',', '.');
            return $request;
        });

        return Inertia::render("Requests/index", [
            "requests" => $requests,
            "filter" => $request->only('search'),
            "jml_rl" => $jml_rl,
            "totalPending" => $totalPending,
            "totalApproved" => $totalApproved,
            "sumApproved" => $sumApprovedAmount,
        ]);
    }

    public function create()
    {
        return Inertia('Requests/create');
    }

    public function surat(Request $request)
    {
        Log::info('Memulai proses pengajuan surat.');

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string|max:250',
            'j_pengajuan' => 'required|string|max:250',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validasi gagal.', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }
        Log::info('Validasi berhasil.');

        $path = null;
        try {
            if ($request->hasFile('file')) {
                Log::info('File terdeteksi dalam request.');
                $file = $request->file('file');

                if (!$file->isValid()) {
                    Log::error('File yang diunggah tidak valid.');
                    return back()->withErrors(['file' => 'File yang diunggah tidak valid.'])->withInput();
                }
                Log::info('File valid.');

                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $sluggedName = Str::slug($originalName);
                $filename = 'request_' . time() . '_' . $sluggedName . '.' . $extension;

                Log::info("Mencoba menyimpan file sebagai '{$filename}' di 'public/requesteds'.");

                $path = $file->storeAs('requesteds', $filename, 'public');

                if ($path) {
                    Log::info("File berhasil disimpan di path: {$path}");
                } else {
                    Log::error('storeAs() gagal. File tidak dapat disimpan. Periksa izin tulis pada folder storage/app/public/.');
                    return back()->withErrors(['file' => 'Gagal menyimpan file. Silakan periksa izin folder server.'])->withInput();
                }
            } else {
                Log::warning('Tidak ada file yang terdeteksi dalam request, padahal wajib.');
                return back()->withErrors(['file' => 'Tidak ada file yang terdeteksi dalam permintaan.'])->withInput();
            }

            $fileHash = md5_file(Storage::disk('public')->path($path));
            $existing = Requested::where('file_hash', $fileHash)->exists();

            if ($existing) {
                Log::warning('File duplikat terdeteksi. Menghapus file yang baru diunggah.');
                Storage::disk('public')->delete($path);
                return back()->withErrors(['file' => 'Data dengan file yang sama sudah ada!'])->withInput();
            }

            Log::info('Membuat data di database.');
            Requested::create([
                'name' => $request->name,
                'date' => $request->date,
                'devisi' => $request->devisi,
                'j_pengajuan' => $request->j_pengajuan,
                'mengetahui' => $request->mengetahui,
                'desk' => $request->desk,
                'dana' => $request->dana,
                'file' => $path,
                'file_hash' => $fileHash,
            ]);
            Log::info('Data berhasil dibuat.');

        } catch (\Exception $e) {
            Log::error('Terjadi exception saat upload file atau simpan ke database.');
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());

            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            return back()->withErrors(['file' => 'Terjadi kesalahan server: ' . $e->getMessage()])->withInput();
        }

        return redirect()->route('requests.index')->with('message', 'Pengajuan berhasil dibuat!');
    }


    public function show(string $id)
    {
        $requested = Requested::findOrFail($id);
        return Inertia::render("Requests/show", [
            "requests" => $requested,
        ]);
    }

    public function edit(string $id)
    {
        $requested = Requested::findOrFail($id);
        return Inertia::render("Requests/edit", [
            "requests" => $requested,
        ]);
    }

    public function update(Request $request, Requested $requested)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string|max:250',
            'j_pengajuan' => 'required|string|max:250',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
        ]);

        $requested->update($request->all());

        return redirect()->route('requests.index')->with('message', 'Pengajuan berhasil diperbarui.');
    }

    public function showAct(string $id)
    {
        $requested = Requested::findOrFail($id);
        return Inertia::render("Requests/showAct", [
            "requests" => $requested,
        ]);
    }

    public function editAct(string $id)
    {
        $requested = Requested::findOrFail($id);
        return Inertia::render("Requests/editAct", [
            "requests" => $requested,
        ]);
    }

    /**
     * Update the status of a request.
     */
    public function updateAct(Request $request, Requested $requested)
    {
        // Validasi hanya untuk field status dan reason
        $request->validate([
            'status' => 'required|string|in:diterima,ditolak,belum ACC',
            'reason' => 'nullable|string|max:500',
        ]);

        // Update hanya field yang relevan
        $requested->update([
            'status' => $request->input('status'),
            'reason' => $request->input('reason'),
        ]);

        return redirect()->route('administrasis.index')->with('message', 'Status pengajuan berhasil diperbarui.');
    }

    public function destroy(Requested $requested)
    {
        if ($requested->file && Storage::disk('public')->exists($requested->file)) {
            Storage::disk('public')->delete($requested->file);
        }

        $requested->delete();
        return redirect()->route('requests.index')->with('message', 'Pengajuan berhasil dihapus.');
    }
}
