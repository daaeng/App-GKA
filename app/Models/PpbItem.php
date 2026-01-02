<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpbItem extends Model
{
    use HasFactory;

    /**
     * Nama tabel
     */
    protected $table = 'ppb_items';

    /**
     * Kolom yang boleh diisi
     */
    protected $fillable = [
        'ppb_header_id',
        'nama_barang',
        'jumlah',
        'satuan',
        'harga_satuan',
        'harga_total',
        'keterangan',
    ];

    /**
     * Cast tipe data
     */
    protected $casts = [
        'jumlah' => 'integer',
        'harga_satuan' => 'float',
        'harga_total' => 'float',
    ];

    /**
     * Relasi many-to-one ke PpbHeader
     * Satu PpbItem dimiliki oleh satu PpbHeader
     */
    public function header(): BelongsTo
    {
        return $this->belongsTo(PpbHeader::class, 'ppb_header_id');
    }
}