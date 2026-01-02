<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KasbonPayment extends Model
{
    use HasFactory;

    /**
     * [PEMBARUAN] Menambahkan 'payment_date' ke fillable.
     * Kolom `created_at` dan `updated_at` akan diisi otomatis.
     */
    protected $fillable = [
        'kasbon_id',
        'amount',
        'payment_date',
        'notes',
    ];

    /**
     * [PEMBARUAN] Memberi tahu Laravel bahwa payment_date adalah objek Carbon.
     */
    protected $casts = [
        'payment_date' => 'datetime',
    ];

    public function kasbon(): BelongsTo
    {
        return $this->belongsTo(Kasbon::class);
    }
}
