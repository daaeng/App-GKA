<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('outgoing_stocks', function (Blueprint $table) {
            // Menambahkan kolom no_po setelah no_invoice
            $table->string('no_po')->nullable()->after('no_invoice');
        });
    }

    public function down(): void
    {
        Schema::table('outgoing_stocks', function (Blueprint $table) {
            $table->dropColumn('no_po');
        });
    }
};
