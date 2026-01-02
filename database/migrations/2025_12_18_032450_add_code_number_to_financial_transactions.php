<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('financial_transactions', function (Blueprint $table) {
            $table->string('transaction_code')->nullable()->after('id');
            $table->string('transaction_number')->nullable()->after('transaction_code');
        });
    }

    public function down()
    {
        Schema::table('financial_transactions', function (Blueprint $table) {
            $table->dropColumn(['transaction_code', 'transaction_number']);
        });
    }
};
