<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialTransaction extends Model
{
    use HasFactory;

    protected $table = 'financial_transactions';

    protected $fillable = [
        'type',             // income / expense
        'source',           // cash / bank
        'category',
        'description',
        'amount',
        'transaction_date',

        'transaction_code',   // Kode (KK-, KM-, dll)
        'transaction_number', // Nomor Urut/Manual

        'db_cr',       // debit / credit
        'counterparty' // Terima Dari / Bayar Kepada
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];
}