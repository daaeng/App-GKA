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
        Schema::create('ppb_headers', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('nomor')->unique();
            $table->string('lampiran')->nullable();
            $table->string('perihal');
            
            // Info 'Kepada Yth' (Req 5)
            $table->string('kepada_yth_jabatan');
            $table->string('kepada_yth_nama');
            $table->string('kepada_yth_lokasi')->default('di - Tempat');

            // Paragraf
            $table->text('paragraf_pembuka');

            // Info Penandatangan (Sesuai gambar)
            $table->string('dibuat_oleh_nama');
            $table->string('dibuat_oleh_jabatan');
            $table->string('menyetujui_1_nama');
            $table->string('menyetujui_1_jabatan');
            $table->string('menyetujui_2_nama');
            $table->string('menyetujui_2_jabatan');

            $table->decimal('grand_total', 15, 2)->default(0);
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppb_headers');
    }
};