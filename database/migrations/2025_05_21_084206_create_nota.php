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
        Schema::create('notas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->string('devisi');
            $table->string('mengetahui');
            $table->text('desk')->nullable();
            $table->decimal('dana', 16, 2)->nullable();
            $table->string('file')->nullable();
            $table->string('status')->default('belum ACC');
            $table->string('reason')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nota');
    }
};
