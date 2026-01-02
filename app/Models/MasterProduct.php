<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterProduct extends Model
{
    protected $guarded = ['id']; // Izin isi semua kolom

    // Relasi ke Stok Masuk
    public function incomingStocks(): HasMany
    {
        return $this->hasMany(IncomingStock::class, 'product_id');
    }

    // Relasi ke Stok Keluar
    public function outgoingStocks(): HasMany
    {
        return $this->hasMany(OutgoingStock::class, 'product_id');
    }

    // Fitur Tambahan: Hitung Total Stok Real-time
    // Cara pakai nanti di controller: $product->current_stock
    public function getCurrentStockAttribute()
    {
        return $this->incomingStocks()->sum('qty_net') - $this->outgoingStocks()->sum('qty_out');
    }

    // [BARU] Hitung Sisa Keping (PIECES) - TAMBAHKAN INI
    public function getCurrentKepingAttribute()
    {
        return $this->incomingStocks()->sum('keping') - $this->outgoingStocks()->sum('keping_out');
    }
}
