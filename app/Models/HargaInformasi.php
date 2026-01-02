<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HargaInformasi extends Model
{
    protected $table = 'informasi_harga'; // Sesuaikan dengan nama tabel Anda
    protected $fillable = ['jenis', 'nilai', 'tanggal_berlaku'];
    protected $casts = [
        'nilai' => 'float',
        'tanggal_berlaku' => 'date',
    ];
}