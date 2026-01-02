<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventoryMigrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua data dari tabel lama 'products'
        $oldData = DB::table('products')->orderBy('id')->get();

        foreach ($oldData as $row) {
            // 1. PASTIKAN MASTER PRODUK ADA
            // Cek apakah nama produk ini sudah ada di kamus master? Kalau belum, buat baru.
            $masterProduct = DB::table('master_products')->where('name', $row->product)->first();

            if (!$masterProduct) {
                $productId = DB::table('master_products')->insertGetId([
                    'name' => $row->product ?? 'Produk Tanpa Nama', // Default jika kosong
                    'unit' => 'Kg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $productId = $masterProduct->id;
            }

            // 2. MIGRASI DATA MASUK (Jika ada qty_kg)
            // Asumsi: Jika qty_kg > 0, berarti ini transaksi barang masuk
            if ($row->qty_kg > 0) {
                DB::table('incoming_stocks')->insert([
                    'product_id'    => $productId,
                    'date'          => $row->date ?? now(),
                    'no_po'         => $row->no_po,
                    'nm_supplier'   => $row->nm_supplier,
                    'qty_net'       => $row->qty_kg,       // Mapping qty_kg -> qty_net
                    'keping'        => $row->keping,
                    'kualitas'      => $row->kualitas,
                    'price_per_kg'  => $row->price_qty,    // Mapping price_qty -> price_per_kg
                    'total_amount'  => $row->amount,
                    'created_at'    => $row->created_at ?? now(),
                    'updated_at'    => $row->updated_at ?? now(),
                ]);
            }

            // 3. MIGRASI DATA KELUAR (Jika ada qty_out)
            // Asumsi: Jika qty_out > 0, berarti ini transaksi barang keluar
            if ($row->qty_out > 0) {

                // Cari ID Customer berdasarkan Nama (Agar relasi nyambung)
                $customerId = null;
                if ($row->customer_name) {
                    $cust = DB::table('customers')->where('name', $row->customer_name)->first();
                    if ($cust) {
                        $customerId = $cust->id;
                    } else {
                        // Opsi: Jika customer tidak ditemukan, buat baru otomatis biar data tidak hilang
                        $customerId = DB::table('customers')->insertGetId([
                            'name' => $row->customer_name,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                }

                DB::table('outgoing_stocks')->insert([
                    'product_id'      => $productId,
                    'customer_id'     => $customerId,
                    'no_invoice'      => $row->no_invoice,
                    'date'            => $row->date ?? now(),
                    'qty_out'         => $row->qty_out,
                    'keping_out'      => $row->keping_out,
                    'kualitas_out'    => $row->kualitas_out,
                    'tgl_kirim'       => $row->tgl_kirim,
                    'tgl_sampai'      => $row->tgl_sampai,
                    'qty_sampai'      => $row->qty_sampai,
                    'shipping_method' => $row->shipping_method,
                    'status'          => $row->status ?? 'Pending',
                    'person_in_charge'=> $row->person_in_charge,
                    'selling_price'   => $row->price_out ?? 0,
                    'pph_value'       => $row->pph_value,
                    'ob_cost'         => $row->ob_cost,
                    'extra_cost'      => $row->extra_cost,
                    'grand_total'     => $row->amount_out ?? 0, // Mapping amount_out -> grand_total
                    'created_at'      => $row->created_at ?? now(),
                    'updated_at'      => $row->updated_at ?? now(),
                ]);
            }
        }
    }
}
