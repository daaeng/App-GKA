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
        Schema::table('kasbons', function (Blueprint $table) {
            // Tambahkan kolom transaction_date setelah kolom 'reason'
            $table->timestamp('transaction_date')->nullable()->after('reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kasbons', function (Blueprint $table) {
            $table->dropColumn('transaction_date');
        });
    }
};

