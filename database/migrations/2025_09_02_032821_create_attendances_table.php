<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel employees
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            
            // Waktu clock-in dan clock-out
            $table->dateTime('clock_in_time');
            $table->dateTime('clock_out_time')->nullable(); // Boleh kosong saat baru clock-in

            // Informasi tambahan
            $table->string('clock_in_ip_address', 45)->nullable();
            $table->string('clock_out_ip_address', 45)->nullable();

            // Status absensi
            $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Alpha', 'Cuti'])->default('Hadir');
            
            // Catatan (misal: untuk alasan izin/sakit)
            $table->text('notes')->nullable();

            // Total jam kerja (bisa dihitung nanti)
            $table->decimal('work_hours', 5, 2)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};