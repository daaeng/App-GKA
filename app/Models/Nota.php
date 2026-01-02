<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $fillable = 
    [
        'name', 
        'date', 
        'devisi', 
        'mengetahui', 
        'desk', 
        'dana', 
        'file', 
        'status', 
        'reason', 
        'file_hash'
    ];
}
