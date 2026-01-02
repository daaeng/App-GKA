<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class NotaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');

        $notas = Nota::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('devisi', 'like', "%{$search}%")
                      ->orWhere('mengetahui', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        $jml_nota = Nota::count();
        $totalPendingNotas = Nota::where('status', 'belum ACC')->count();
        $totalApprovedNotas = Nota::where('status', 'diterima')->count();
        $sumApprovedNotasAmount = Nota::where('status', 'diterima')->sum('dana');

        return Inertia::render("Notas/index", [
            "notas" => $notas,
            "filter" => $request->only('search'),
            "totalPendingNotas" => $totalPendingNotas,
            "totalApprovedNotas" => $totalApprovedNotas,
            "sumApprovedNotasAmount" => $sumApprovedNotasAmount,
            "jml_nota" => $jml_nota,
        ]);
    }

    public function up_nota()
    {
        return Inertia('Notas/up_nota');
    }

    public function c_nota(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            'file' => 'required|image|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $fileHash = md5_file($request->file('file')->getRealPath());
        $existing = Nota::where('file_hash', $fileHash)->exists();

        if ($existing) {
            return back()->withErrors(['file' => 'Data dengan file yang sama sudah ada!'])->withInput();
        }

        $path = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $sluggedName = Str::slug($originalName);
            $filename = 'nota_' . time() . '_' . $sluggedName . '.' . $extension;
            $path = $file->storeAs('notas', $filename, 'public');
        }

        Nota::create([
            'name' => $request->name,
            'date' => $request->date,
            'devisi' => $request->devisi,
            'mengetahui' => $request->mengetahui,
            'desk' => $request->desk,
            'dana' => $request->dana,
            'file' => $path,
            'file_hash' => $fileHash,
        ]);

        return redirect()->route('notas.index')->with('message', 'Nota berhasil diunggah.');
    }

    public function show(string $id)
    {
        $nota = Nota::findOrFail($id);
        return Inertia::render("Notas/show", [
            "nota" => $nota,
        ]);
    }

    public function edit(string $id)
    {
        $nota = Nota::findOrFail($id);
        return Inertia::render("Notas/edit", [
            "nota" => $nota,
        ]);
    }

    public function update(Request $request, Nota $nota)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
        ]);

        $nota->update($request->all());

        return redirect()->route('notas.index')->with('message', 'Nota berhasil diperbarui.');
    }

    public function showAct(string $id)
    {
        $nota = Nota::findOrFail($id);
        return Inertia::render("Notas/showAct", [
            "nota" => $nota,
        ]);
    }

    public function editAct(string $id)
    {
        $nota = Nota::findOrFail($id);
        return Inertia::render("Notas/editAct", [
            "nota" => $nota,
        ]);
    }

    public function updateAct(Request $request, Nota $nota)
    {
        // PERBAIKAN: Validasi hanya untuk status dan reason.
        $request->validate([
            'status' => 'required|string|in:diterima,ditolak,belum ACC',
            'reason' => 'nullable|string|max:500',
        ]);

        // PERBAIKAN: Update hanya field yang relevan.
        $nota->update([
            'status' => $request->input('status'),
            'reason' => $request->input('reason'),
        ]);

        return redirect()->route('administrasis.index')->with('message', 'Status nota berhasil diperbarui.');
    }

    public function destroy(Nota $nota)
    {
        if ($nota->file && Storage::disk('public')->exists($nota->file)) {
            Storage::disk('public')->delete($nota->file);
        }
        $nota->delete();
        return redirect()->route('notas.index')->with('message', 'Nota berhasil dihapus.');
    }
}
