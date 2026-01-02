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
        Schema::table('incisors', function (Blueprint $table) {
            // Menambahkan kolom NIK setelah kolom 'name'
            // Dibuat nullable() dan unique() untuk keamanan data
            $table->string('nik', 20)->unique()->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incisors', function (Blueprint $table) {
            $table->dropColumn('nik');
        });
    }
};
