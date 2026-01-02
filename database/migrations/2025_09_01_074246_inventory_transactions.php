<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['in', 'out']);
            $table->integer('quantity');
            $table->date('transaction_date');
            $table->string('source')->nullable()->comment('Source for stock in, e.g., vendor name');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null')->comment('User who took the item for stock out');
            $table->text('description')->nullable()->comment('Description for stock out');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
