<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    use HasFactory;
    protected $fillable = ['payroll_id', 'deskripsi', 'tipe', 'jumlah'];

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(Payroll::class);
    }
}