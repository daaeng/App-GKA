<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection; 
use Maatwebsite\Excel\Concerns\WithHeadings;    
use Maatwebsite\Excel\Concerns\ShouldAutoSize; 

class ProductsAllExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $products;

    public function __construct(Collection $products)
    {
        $this->products = $products;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->products->map(function ($product) {
            return [
                'ID' => $product->id,
                'Product' => $product->product,
                'Date' => $product->date,
                'No. Invoice' => $product->no_invoice,
                'Supplier' => $product->nm_supplier,
                'Jenis Barang' => $product->j_brg,
                'Deskripsi' => $product->desk,
                'Qty (IN)' => $product->qty_kg,
                'Price Qty (IN)' => $product->price_qty,
                'Amount (IN)' => $product->amount,
                'Keping (IN)' => $product->keping,
                'Kualitas (IN)' => $product->kualitas,
                'Qty (OUT)' => $product->qty_out,
                'Price (OUT)' => $product->price_out,
                'Amount (OUT)' => $product->amount_out,
                'Keping (OUT)' => $product->keping_out,
                'Kualitas (OUT)' => $product->kualitas_out,
                'Status' => $product->status,
                'Created At' => $product->created_at ? $product->created_at->format('Y-m-d H:i:s') : null,
                'Updated At' => $product->updated_at ? $product->updated_at->format('Y-m-d H:i:s') : null,
            ];
        });
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Product',
            'Date',
            'No. Invoice',
            'Supplier',
            'Jenis Barang',
            'Deskripsi',
            'Qty (IN)',
            'Price Qty (IN)',
            'Amount (IN)',
            'Keping (IN)',
            'Kualitas (IN)',
            'Qty (OUT)',
            'Price (OUT)',
            'Amount (OUT)',
            'Keping (OUT)',
            'Kualitas (OUT)',
            'Status',
            'Created At',
            'Updated At',
        ];
    }
}