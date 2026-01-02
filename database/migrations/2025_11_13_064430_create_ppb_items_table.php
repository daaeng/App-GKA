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
        Schema::create('ppb_items', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel header
            $table->foreignId('ppb_header_id')
                  ->constrained('ppb_headers')
                  ->onDelete('cascade'); // Jika header dihapus, item ikut terhapus
                  
            // Kolom dari tabel di gambar
            $table->string('nama_barang');
            $table->integer('jumlah');
            $table->string('satuan');
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('harga_total', 15, 2);
            $table->string('keterangan')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppb_items');
    }
};