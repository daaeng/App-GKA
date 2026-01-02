<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpbHeader extends Model
{
    use HasFactory;

    protected $table = 'ppb_headers';

    protected $fillable = [
        'tanggal',
        'nomor',
        'lampiran',
        'perihal',
        'kepada_yth_jabatan',
        'kepada_yth_nama',
        'kepada_yth_lokasi',
        'paragraf_pembuka',
        'dibuat_oleh_nama',
        'dibuat_oleh_jabatan',
        'menyetujui_1_nama',
        'menyetujui_1_jabatan',
        'menyetujui_2_nama',
        'menyetujui_2_jabatan',
        'grand_total',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'grand_total' => 'float',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PpbItem::class, 'ppb_header_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($header) {
            if (empty($header->status)) {
                $header->status = 'pending';
            }
        });
    }
}