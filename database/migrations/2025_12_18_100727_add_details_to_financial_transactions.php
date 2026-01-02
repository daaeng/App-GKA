<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('financial_transactions', function (Blueprint $table) {
            $table->enum('db_cr', ['debit', 'credit'])->default('debit')->after('amount');
            $table->string('counterparty')->nullable()->after('db_cr');
        });
    }

    public function down()
    {
        Schema::table('financial_transactions', function (Blueprint $table) {
            $table->dropColumn(['db_cr', 'counterparty']);
        });
    }
};
