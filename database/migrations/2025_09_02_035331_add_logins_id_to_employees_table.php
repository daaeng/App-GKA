<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Menambahkan kolom untuk relasi ke tabel users (logins)
            // Kolom ini dibuat setelah kolom 'id'
            // Kita buat nullable() dulu agar tidak error pada data yang sudah ada
            $table->foreignId('logins_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Hapus foreign key constraint terlebih dahulu
            $table->dropForeign(['logins_id']);
            // Hapus kolomnya
            $table->dropColumn('logins_id');
        });
    }
};
