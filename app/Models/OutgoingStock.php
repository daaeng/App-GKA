<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutgoingStock extends Model
{
    protected $guarded = ['id'];

    // Relasi balik ke Induk Produk
    public function product(): BelongsTo
    {
        return $this->belongsTo(MasterProduct::class, 'product_id');
    }

    // Relasi ke Customer
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
