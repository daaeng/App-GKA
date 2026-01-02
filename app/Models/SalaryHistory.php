<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryHistory extends Model
{
    use HasFactory;
    protected $fillable = ['employee_id', 'gaji_pokok', 'tanggal_mulai', 'tanggal_selesai'];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
