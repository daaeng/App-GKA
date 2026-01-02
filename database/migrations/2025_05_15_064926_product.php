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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('product');
            $table->date('date');
            $table->string('no_invoice');
            $table->string('nm_supplier');
            $table->string('j_brg');
            $table->text('desk')->nullable();

            $table->integer('qty_kg')->nullable();
            $table->decimal('price_qty', 19, 2)->nullable();
            $table->decimal('amount', 19, 2)->nullable();
            $table->integer('keping')->nullable();
            $table->string('kualitas')->nullable();

            $table->integer('qty_out')->nullable();
            $table->decimal('price_out', 19, 2)->nullable();
            $table->decimal('amount_out', 19, 2)->nullable();
            $table->integer('keping_out')->nullable();
            $table->string('kualitas_out')->nullable();

            $table->integer('qty_sampai')->nullable();
            $table->date('tgl_sampai')->nullable();

            $table->string('status')->default('tsa');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
