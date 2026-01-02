<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $table = 'pengeluaran'; // Sesuaikan dengan nama tabel Anda
    protected $fillable = ['kategori', 'deskripsi', 'jumlah', 'tanggal_pengeluaran'];
    protected $casts = [
        'jumlah' => 'float',
        'tanggal_pengeluaran' => 'date',
    ];
}