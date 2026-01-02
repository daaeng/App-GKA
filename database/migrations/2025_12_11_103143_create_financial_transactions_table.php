<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            // Enum: income = Pemasukan, expense = Pengeluaran
            $table->enum('type', ['income', 'expense']); 
            
            // Enum: cash = Kas Tunai, bank = Rekening Bank
            $table->enum('source', ['cash', 'bank']);    
            
            $table->string('category'); // Contoh: "Setor Modal", "Bayar Listrik", "Penarikan Bank"
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2); // Mendukung angka besar dengan 2 desimal
            $table->date('transaction_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('financial_transactions');
    }
};