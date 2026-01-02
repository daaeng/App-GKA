<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('incisors', function (Blueprint $table) {
            // Cek dulu biar tidak error "Column already exists"
            if (!Schema::hasColumn('incisors', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('lok_toreh');
            }
        });
    }

    public function down()
    {
        Schema::table('incisors', function (Blueprint $table) {
            if (Schema::hasColumn('incisors', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};