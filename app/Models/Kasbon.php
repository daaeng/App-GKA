<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Kasbon extends Model
{
    use HasFactory;

    protected $table = 'kasbons';

    /**
     * [PEMBARUAN] Menambahkan 'transaction_date' ke fillable.
     * Hapus 'incisor_id' karena sudah ditangani oleh relasi polimorfik.
     */
    protected $fillable = [
        'gaji', 'kasbon', 'status', 'reason', 'month', 'year',
        'kasbonable_type', 'kasbonable_id', 'payment_status', 'paid_at',
        'transaction_date',
    ];

    /**
     * [PEMBARUAN] Memberi tahu Laravel bahwa transaction_date adalah objek Carbon.
     */
    protected $casts = [
        'transaction_date' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function kasbonable(): MorphTo
    {
        return $this->morphTo();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(KasbonPayment::class);
    }
    
    // Relasi lama bisa dihapus jika tidak digunakan di tempat lain
    // public function incisor(): BelongsTo { return $this->belongsTo(Incisor::class, 'incisor_id'); }
}
