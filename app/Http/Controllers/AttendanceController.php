<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        $selectedMonth = $request->input('month', Carbon::now()->format('Y-m'));
        $selectedEmployeeId = $request->input('employee_id');
        $date = Carbon::createFromFormat('Y-m', $selectedMonth);

        $attendanceQuery = Attendance::with('employee')
            ->whereYear('clock_in_time', $date->year)
            ->whereMonth('clock_in_time', $date->month)
            ->orderBy('clock_in_time', 'asc');

        $reportData = null;
        $reportType = 'all';
        $selectedEmployee = null;

        if ($selectedEmployeeId) {
            $reportType = 'individual';
            $attendanceQuery->where('employee_id', $selectedEmployeeId);
            $attendances = $attendanceQuery->get();
            $selectedEmployee = Employee::find($selectedEmployeeId);

            $reportData = [
                'total_hadir' => $attendances->where('status', 'Hadir')->count(),
                'total_izin' => $attendances->where('status', 'Izin')->count(),
                'total_sakit' => $attendances->where('status', 'Sakit')->count(),
                'total_alpha' => $attendances->where('status', 'Alpha')->count(),
                'total_cuti' => $attendances->where('status', 'Cuti')->count(),
                'total_jam_kerja' => round($attendances->sum('work_hours'), 2),
                'detail_absensi' => $attendances,
            ];
        } else {
            // --- [PERUBAHAN UTAMA] ---
            // Mengubah cara data dikelompokkan untuk tampilan kalender.
            $attendances = $attendanceQuery->get();
            $groupedByDate = $attendances->groupBy(function ($item) {
                return Carbon::parse($item->clock_in_time)->format('Y-m-d');
            });

            $reportData = $groupedByDate->map(function ($dayGroup) {
                return [
                    'summary' => [
                        'Hadir' => $dayGroup->where('status', 'Hadir')->count(),
                        'Izin' => $dayGroup->where('status', 'Izin')->count(),
                        'Sakit' => $dayGroup->where('status', 'Sakit')->count(),
                        'Alpha' => $dayGroup->where('status', 'Alpha')->count(),
                        'Cuti' => $dayGroup->where('status', 'Cuti')->count(),
                    ],
                    'details' => $dayGroup->values(), // Mengirim semua detail untuk modal
                ];
            });
        }

        return Inertia::render('Attendance/Index', [
            'reportType' => $reportType,
            'reportData' => $reportData,
            'selectedMonth' => $selectedMonth,
            'selectedEmployeeId' => $selectedEmployeeId,
            'selectedEmployee' => $selectedEmployee,
            'employees' => Employee::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Menampilkan form untuk input absensi manual.
     */
    public function create()
    {
        $employees = Employee::orderBy('name')->get();
        return Inertia::render('Attendance/Create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Menyimpan data absensi baru dari input manual.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time' => 'nullable|date_format:H:i|after:clock_in_time',
            'status' => 'required|in:Hadir,Izin,Sakit,Alpha,Cuti',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        $clockInDateTime = Carbon::parse($validated['attendance_date'] . ' ' . $validated['clock_in_time']);
        $clockOutDateTime = !empty($validated['clock_out_time'])
            ? Carbon::parse($validated['attendance_date'] . ' ' . $validated['clock_out_time'])
            : null;
            
        $workHours = $clockOutDateTime ? ($clockInDateTime->diffInMinutes($clockOutDateTime) / 60) : null;

        Attendance::create([
            'employee_id' => $validated['employee_id'],
            'clock_in_time' => $clockInDateTime,
            'clock_out_time' => $clockOutDateTime,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'work_hours' => $workHours ? number_format($workHours, 2) : null,
        ]);

        return redirect()->route('attendances.index')->with('success', 'Data absensi berhasil disimpan.');
    }
    
    /**
     * Menampilkan form untuk mengedit data absensi.
     */
    public function edit(Attendance $attendance)
    {
        $attendance->load('employee');
        $employees = Employee::orderBy('name')->get();

        return Inertia::render('Attendance/Edit', [
            'attendance' => $attendance,
            'employees' => $employees,
        ]);
    }

    /**
     * Memperbarui data absensi di database.
     */
    public function update(Request $request, Attendance $attendance)
    {
         $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time' => 'nullable|date_format:H:i|after:clock_in_time',
            'status' => 'required|in:Hadir,Izin,Sakit,Alpha,Cuti',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        
        $clockInDateTime = Carbon::parse($validated['attendance_date'] . ' ' . $validated['clock_in_time']);
        $clockOutDateTime = !empty($validated['clock_out_time'])
            ? Carbon::parse($validated['attendance_date'] . ' ' . $validated['clock_out_time'])
            : null;
            
        $workHours = $clockOutDateTime ? $clockInDateTime->diffInMinutes($clockOutDateTime) / 60 : null;

        $attendance->update([
            'employee_id' => $validated['employee_id'],
            'clock_in_time' => $clockInDateTime,
            'clock_out_time' => $clockOutDateTime,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'work_hours' => $workHours ? number_format($workHours, 2) : null,
        ]);

        return redirect()->route('attendances.index')->with('success', 'Data absensi berhasil diperbarui.');
    }

    /**
     * Menghapus data absensi dari database.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('attendances.index')->with('success', 'Data absensi berhasil dihapus.');
    }
}
