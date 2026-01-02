<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('customer_name')->nullable();
            $table->string('shipping_method')->nullable();
            $table->decimal('pph_value', 15, 2)->nullable();
            $table->decimal('ob_cost', 15, 2)->nullable();
            $table->decimal('extra_cost', 15, 2)->nullable();
            $table->date('due_date')->nullable();
            $table->string('person_in_charge')->nullable();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'shipping_method', 'pph_value', 'ob_cost', 'extra_cost', 'due_date', 'person_in_charge']);
        });
    }
};
