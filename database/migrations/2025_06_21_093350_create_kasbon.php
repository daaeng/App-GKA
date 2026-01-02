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
        Schema::create('kasbons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incisor_id')->nullable()->constrained('incisors')->onUpdate('cascade');
            $table->decimal('gaji', 15, 2)->nullable();
            $table->decimal('kasbon', 15, 2);
            $table->string('status')->default('Belum ACC');
            $table->text('reason')->nullable();
            $table->integer('month')->nullable();
            $table->integer('year')->nullable();
            
            $table->timestamps();
            
            $table->morphs('kasbonable'); // Ini akan membuat kolom kasbonable_id dan kasbonable_type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kasbons');
    }
};
