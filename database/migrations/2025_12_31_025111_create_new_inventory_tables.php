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
        // 1. Tabel Master Produk (Kamus Barang)
        Schema::create('master_products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Misal: Karet Lateks
            $table->string('code')->nullable(); // Kode barang (Opsional)
            $table->string('unit')->default('Kg'); // Satuan
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Stok Masuk (Incoming - Dari Supplier/Penoreh)
        Schema::create('incoming_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('master_products');
            $table->foreignId('incised_id')->nullable(); // Relasi ke data toreh (jika ada)

            // Data Identitas Masuk
            $table->date('date');
            $table->string('no_po')->nullable(); // Sesuai catatan kertas
            $table->string('nm_supplier')->nullable(); // Nama Supplier

            // Data Fisik Barang
            $table->decimal('qty_net', 15, 2); // Berat Bersih (Kg)
            $table->integer('keping')->nullable(); // Sesuai catatan kertas & tabel lama
            $table->string('kualitas')->nullable(); // Sesuai catatan kertas

            // Data Keuangan (Beli)
            $table->decimal('price_per_kg', 15, 2)->nullable(); // Harga beli satuan
            $table->decimal('total_amount', 15, 2)->nullable(); // Total bayar

            $table->timestamps();
        });

        // 3. Tabel Stok Keluar (Outgoing - Penjualan ke Customer)
        Schema::create('outgoing_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('master_products');

            // Relasi ke Customer (Karena Mas Daeng punya tabel 'customers')
            // Saya ubah dari 'customer_name' jadi ID biar relasinya kuat
            $table->foreignId('customer_id')->nullable()->constrained('customers');

            // Identitas Transaksi
            $table->string('no_invoice')->nullable();
            $table->date('date'); // Tanggal Transaksi

            // Data Fisik Keluar
            $table->decimal('qty_out', 15, 2); // Berat jual
            $table->integer('keping_out')->nullable();
            $table->string('kualitas_out')->nullable();

            // Data Pengiriman (Logistik)
            $table->date('tgl_kirim')->nullable();
            $table->date('tgl_sampai')->nullable();
            $table->decimal('qty_sampai', 15, 2)->nullable(); // Susut di jalan
            $table->string('shipping_method')->nullable(); // Tongkang/Truck
            $table->string('status')->default('Pending'); // Pending/Paid/Shipped
            $table->string('person_in_charge')->nullable(); // PIC

            // Data Keuangan (Jual)
            $table->decimal('selling_price', 15, 2); // Harga Jual per Kg
            $table->decimal('pph_value', 15, 2)->nullable(); // Pajak PPH
            $table->decimal('ob_cost', 15, 2)->nullable(); // Biaya OB
            $table->decimal('extra_cost', 15, 2)->nullable(); // Biaya Lainnya
            $table->decimal('grand_total', 15, 2); // Total Akhir (Amount)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus tabel secara berurutan (Anak dulu, baru Induk)
        Schema::dropIfExists('outgoing_stocks');
        Schema::dropIfExists('incoming_stocks');
        Schema::dropIfExists('master_products');
    }
};
