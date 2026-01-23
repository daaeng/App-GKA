<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use App\Models\Kasbon;
use App\Models\SalaryHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'period' => 'nullable|date_format:Y-m',
        ]);

        $selectedPeriod = $request->input('period');

        $payrollsQuery = Payroll::query()
            ->with('employee')
            ->when($selectedPeriod, function ($query, $period) {
                return $query->where('payroll_period', $period);
            });

        $statsQuery = clone $payrollsQuery;
        $totalGajiPeriod = $statsQuery->sum('gaji_bersih');
        $jumlahKaryawan = $statsQuery->count();

        $periodeAktif = 'Semua Periode';
        if ($selectedPeriod) {
            $periodeAktif = Carbon::createFromFormat('Y-m', $selectedPeriod)->translatedFormat('F Y');
        }

        $payrolls = $payrollsQuery
            ->orderBy('payroll_period', 'desc')
            ->orderBy('id', 'asc')
            ->paginate(15)
            ->withQueryString();

        $availablePeriods = DB::table('payrolls')
            ->select('payroll_period')
            ->distinct()
            ->orderBy('payroll_period', 'desc')
            ->get()
            ->map(function ($item) {
                $date = Carbon::createFromFormat('Y-m', $item->payroll_period);
                return [
                    'value' => $item->payroll_period,
                    'label' => $date->translatedFormat('F Y'),
                ];
            });

        return Inertia::render('Payroll/Index', [
            'payrolls' => $payrolls,
            'availablePeriods' => $availablePeriods,
            'filters' => $request->only(['period']),
            'totalGajiPeriod' => $totalGajiPeriod,
            'jumlahKaryawan' => $jumlahKaryawan,
            'periodeAktif' => $periodeAktif,
        ]);
    }

    public function create()
    {
        return Inertia::render('Payroll/Create');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'period_month' => 'required|integer|between:1,12',
            'period_year' => 'required|integer',
        ]);

        $period = Carbon::create($request->period_year, $request->period_month, 1);
        $periodString = $period->format('Y-m');

        // [MODIFIKASI] HAPUS/KOMENTARI BARIS INI AGAR BISA SPLIT PAYMENT
        // if (Payroll::where('payroll_period', $periodString)->exists()) {
        //     return redirect()->route('payroll.create')->with('error', 'Penggajian untuk periode ini sudah pernah dibuat.');
        // }

        $employees = Employee::where('status', 'active')
            ->with(['kasbons' => function ($query) {
                $query->whereIn('payment_status', ['unpaid', 'partial']);
            }, 'kasbons.payments'])
            ->get();

        $payrollData = [];

        // Ambil default tarif makan dari setting (jika ada), default 20.000
        $defaultUangMakan = PayrollSetting::where('setting_key', 'uang_makan_harian')->first()->setting_value ?? 20000;

        foreach ($employees as $employee) {
            $gajiPokok = $employee->salary ?? 0;

            $sisaHutang = $employee->kasbons->sum(function ($kasbon) {
                $sudahDibayar = $kasbon->payments->sum('amount');
                return max(0, $kasbon->kasbon - $sudahDibayar);
            });

            $maxPotongan = $gajiPokok * 0.5;
            $saranPotongan = min($sisaHutang, $maxPotongan);

            $payrollData[] = [
                'employee_id' => $employee->id,
                'name' => $employee->name,
                'gaji_pokok' => (int) $gajiPokok,
                'hari_hadir' => 26,
                'insentif' => 0,
                'potongan_kasbon' => (int) $saranPotongan,
                // [BARU] Data tambahan untuk frontend
                'is_paid' => true,
                'uang_makan_rate' => (int)$defaultUangMakan,
            ];
        }

        return Inertia::render('Payroll/Generate', [
            'payrollData' => $payrollData,
            'period' => $period->translatedFormat('F Y'),
            'period_string' => $periodString,
            // 'uang_makan_harian' tidak lagi dipakai global, tapi injected ke setiap row di atas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'payrolls' => 'required|array',
            'period_string' => 'required|string',
        ]);

        $includeGaji = $request->boolean('include_gaji', true);
        $includeMakan = $request->boolean('include_makan', true);
        $includeKasbon = $request->boolean('include_kasbon', true);

        DB::beginTransaction();
        try {
            foreach ($request->payrolls as $empPayroll) {
                // 1. Cek apakah karyawan ini dicentang untuk dibayar?
                $isPaid = $empPayroll['is_paid'] ?? true;
                if (!$isPaid) continue; // Skip jika tidak dibayar

                // 2. Hitung Komponen
                $gajiPokok = $includeGaji ? (int)$empPayroll['gaji_pokok'] : 0;
                $insentif = (int)$empPayroll['insentif'];

                // [MODIFIKASI] Hitung Uang Makan pakai Rate Individu
                $hariHadir = (int)$empPayroll['hari_hadir'];
                $rateMakan = (int)($empPayroll['uang_makan_rate'] ?? 0);
                $uangMakan = $includeMakan ? ($hariHadir * $rateMakan) : 0;

                $potonganKasbon = $includeKasbon ? (int)$empPayroll['potongan_kasbon'] : 0;

                $totalPendapatan = $gajiPokok + $insentif + $uangMakan;
                $totalPotongan = $potonganKasbon;
                $gajiBersih = $totalPendapatan - $totalPotongan;

                // Jangan simpan jika nilainya 0 semua (data kosong)
                if ($totalPendapatan == 0 && $totalPotongan == 0) continue;

                // 3. Simpan Header Payroll
                $payroll = Payroll::create([
                    'employee_id' => $empPayroll['employee_id'],
                    'payroll_period' => $request->period_string,
                    'total_pendapatan' => $totalPendapatan,
                    'total_potongan' => $totalPotongan,
                    'gaji_bersih' => $gajiBersih,
                    'status' => 'final',
                    'tanggal_pembayaran' => now(),
                ]);

                // 4. Simpan Detail Item
                if ($gajiPokok > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Gaji Pokok', 'tipe' => 'pendapatan', 'jumlah' => $gajiPokok]);
                }

                if ($uangMakan > 0) {
                    $formattedRate = number_format($rateMakan, 0, ',', '.');
                    PayrollItem::create([
                        'payroll_id' => $payroll->id,
                        'deskripsi' => "Uang Makan ({$hariHadir} hari x Rp {$formattedRate})",
                        'tipe' => 'pendapatan',
                        'jumlah' => $uangMakan
                    ]);
                }

                if ($insentif > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Insentif', 'tipe' => 'pendapatan', 'jumlah' => $insentif]);
                }

                if ($potonganKasbon > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Potongan Kasbon', 'tipe' => 'potongan', 'jumlah' => $potonganKasbon]);
                    $this->processKasbonPayment($empPayroll['employee_id'], $potonganKasbon, $payroll->id);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
        return redirect()->route('payroll.index')->with('message', 'Penggajian berhasil disimpan.');
    }

    private function processKasbonPayment($employeeId, $amountToPay, $payrollId)
    {
        $activeKasbons = \App\Models\Kasbon::where('kasbonable_type', 'App\Models\Employee')
            ->where('kasbonable_id', $employeeId)
            ->whereIn('payment_status', ['unpaid', 'partial'])
            ->orderBy('transaction_date', 'asc')
            ->get();

        $remainingPayment = $amountToPay;

        foreach ($activeKasbons as $kasbon) {
            if ($remainingPayment <= 0) break;

            $alreadyPaid = $kasbon->payments()->sum('amount');
            $debtBalance = $kasbon->kasbon - $alreadyPaid;

            if ($debtBalance <= 0) {
                $kasbon->update(['payment_status' => 'paid', 'paid_at' => now()]);
                continue;
            }

            $paymentAmount = min($remainingPayment, $debtBalance);

            \App\Models\KasbonPayment::create([
                'kasbon_id' => $kasbon->id,
                'amount' => $paymentAmount,
                'payment_date' => now(),
                'notes' => "Potong Gaji (Payroll ID: #$payrollId)"
            ]);

            $remainingPayment -= $paymentAmount;

            $newTotalPaid = $alreadyPaid + $paymentAmount;
            if ($newTotalPaid >= $kasbon->kasbon) {
                $kasbon->update(['payment_status' => 'paid', 'paid_at' => now()]);
            } else {
                $kasbon->update(['payment_status' => 'partial']);
            }
        }
    }

    // ... (Fungsi show, edit, update, printSlip, destroy biarkan seperti sebelumnya) ...
    public function show(Payroll $payroll)
    {
        $payroll->load(['employee', 'items']);
        return Inertia::render('Payroll/Show', ['payroll' => $payroll]);
    }

    public function edit(Payroll $payroll)
    {
        $payroll->load('items', 'employee');
        $gajiPokok = $payroll->items->where('deskripsi', 'Gaji Pokok')->first()->jumlah ?? 0;
        $insentif = $payroll->items->where('deskripsi', 'Insentif')->first()->jumlah ?? 0;
        $potonganKasbon = $payroll->items->where('deskripsi', 'Potongan Kasbon')->first()->jumlah ?? 0;
        $uangMakanItem = $payroll->items->first(function ($item) { return str_starts_with($item->deskripsi, 'Uang Makan'); });
        $hariHadir = 0;
        if ($uangMakanItem) { preg_match('/\((\d+)\s*hari\)/', $uangMakanItem->deskripsi, $matches); $hariHadir = $matches[1] ?? 0; }
        $uangMakanHarian = PayrollSetting::where('setting_key', 'uang_makan_harian')->first()->setting_value ?? 20000;

        return Inertia::render('Payroll/Edit', [
            'payroll' => ['id' => $payroll->id, 'status' => $payroll->status, 'payroll_period' => $payroll->payroll_period, 'employee_name' => $payroll->employee->name, 'gaji_pokok' => $gajiPokok, 'hari_hadir' => (int)$hariHadir, 'insentif' => $insentif, 'potongan_kasbon' => $potonganKasbon],
            'uang_makan_harian' => (int)$uangMakanHarian
        ]);
    }

    public function update(Request $request, Payroll $payroll)
    {
        // Logika update sederhana (jika diperlukan detail, copy dari file sebelumnya)
        // Untuk saat ini fokus ke generate/store yang diminta
        $request->validate(['status' => ['required', Rule::in(['draft', 'final', 'paid'])]]);
        $payroll->update(['status' => $request->status]);
        return redirect()->route('payroll.index')->with('message', 'Status diperbarui.');
    }

    public function printSlip(Payroll $payroll)
    {
        $payroll->load(['employee', 'items']);
        return Inertia::render('Payroll/PrintSlip', ['payroll' => $payroll, 'company_name' => 'PT. Garuda Karya Amanat']);
    }

    public function destroy(Payroll $payroll)
    {
        DB::beginTransaction();
        try {
            $relatedPayments = \App\Models\KasbonPayment::where('notes', 'LIKE', "%Payroll ID: #{$payroll->id})")->get();
            foreach ($relatedPayments as $payment) {
                $kasbon = $payment->kasbon;
                $payment->delete();
                $totalPaidNow = $kasbon->payments()->sum('amount');
                $kasbon->update(['payment_status' => $totalPaidNow <= 0 ? 'unpaid' : 'partial', 'paid_at' => null]);
            }
            $payroll->items()->delete();
            $payroll->delete();
            DB::commit();
            return redirect()->back()->with('message', 'Data gaji berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus data: ' . $e->getMessage());
        }
    }
}
