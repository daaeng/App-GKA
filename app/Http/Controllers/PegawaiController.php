<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class PegawaiController extends Controller
{
    /**
     * Menampilkan halaman daftar pegawai.
     */
    public function index(): Response
    {
        $pegawai = Employee::oldest('id')->get()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->name,
                'position' => $employee->position,
                'salary' => (float) $employee->salary,
                'status' => $employee->status ?? 'active', // Default ke active jika null
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($employee->name) . '&background=random&color=fff',
            ];
        });

        return Inertia::render('Pegawai/index', [
            'pegawai' => $pegawai,
        ]);
    }

    /**
     * Menyimpan data pegawai baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|max:255|unique:employees,employee_id',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive', // Validasi status
        ]);

        Employee::create($validated);

        return redirect()->route('pegawai.index')->with('message', 'Pegawai berhasil ditambahkan.');
    }

    /**
     * Mengupdate data pegawai yang ada di database.
     */
    public function update(Request $request, Employee $pegawai): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string', 'max:255', Rule::unique('employees')->ignore($pegawai->id)],
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive', // Validasi status
        ]);

        $pegawai->update($validated);

        return redirect()->route('pegawai.index')->with('message', 'Data pegawai berhasil diperbarui.');
    }

    /**
     * Menghapus data pegawai dari database.
     */
    public function destroy(Employee $pegawai): RedirectResponse
    {
        $pegawai->delete();

        return redirect()->route('pegawai.index')->with('message', 'Data pegawai berhasil dihapus.');
    }
}