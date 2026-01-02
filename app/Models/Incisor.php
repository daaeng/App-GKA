<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incisor extends Model
{
    protected $fillable = 
    [
        'name', 
        'ttl', 
        'gender', 
        'address', 
        'agama', 
        'status', // Ini Status Perkawinan
        'no_invoice', 
        'lok_toreh',
        'nik',
        'is_active', // <-- FIELD BARU (Status Kerja)
    ];

    // Casting agar otomatis jadi boolean (true/false) di React
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function inciseds()
    {
        return $this->hasMany(Incised::class, 'no_invoice', 'no_invoice');
    }

    public function kasbons()
    {
        return $this->morphMany(Kasbon::class, 'kasbonable');
    }
}