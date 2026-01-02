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
        Schema::create('informasi_harga', function (Blueprint $table) {
            $table->id();
            $table->string('jenis', 50)->unique(); // e.g., 'harga_saham_karet', 'harga_dollar'
            $table->decimal('nilai', 18, 4);
            $table->date('tanggal_berlaku');
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('informasi_harga');
    }
};