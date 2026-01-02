<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product',
        'date',
        'no_invoice',
        'no_po',
        'nm_supplier',
        'j_brg','desk',
        'qty_kg',
        'price_qty',
        'amount',
        'keping',
        'kualitas',
        'qty_out',
        'price_out',
        'amount_out',
        'keping_out',
        'kualitas_out',
        'status',
        'tgl_kirim',
        'tgl_sampai',
        'qty_sampai',

        // Field Tambahan
        'customer_name',
        'shipping_method',
        'pph_value',
        'ob_cost',
        'extra_cost',
        'due_date',
        'person_in_charge',
    ];
}
