<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::table('products', function (Blueprint $table) {
    //         $table->date('tgl_kirim')->nullable()->after('status');
    //         $table->date('tgl_sampai')->nullable()->after('tgl_kirim');
    //         $table->decimal('qty_sampai', 15, 2)->nullable()->after('tgl_sampai');
    //     });
    // }

    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Cek apakah kolom 'tgl_kirim' SUDAH ADA atau BELUM
            if (!Schema::hasColumn('products', 'tgl_kirim')) {
                $table->date('tgl_kirim')->nullable(); // Sesuaikan tipe data dengan aslinya
            }
            
            // Lakukan hal yang sama jika ada kolom lain di file ini (misal 'tgl_sampai', dll)
            // Contoh:
            // if (!Schema::hasColumn('products', 'tgl_sampai')) {
            //     $table->date('tgl_sampai')->nullable();
            // }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
