<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit',
        'stock',
        'low_stock_threshold',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class)->orderBy('transaction_date', 'desc');
    }
}
