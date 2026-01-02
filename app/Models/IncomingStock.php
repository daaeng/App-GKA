<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncomingStock extends Model
{
    protected $guarded = ['id'];

    // Relasi balik ke Induk Produk
    public function product(): BelongsTo
    {
        return $this->belongsTo(MasterProduct::class, 'product_id');
    }

    // Relasi ke Data Toreh (Incised)
    public function incised(): BelongsTo
    {
        return $this->belongsTo(Incised::class, 'incised_id');
    }
}
