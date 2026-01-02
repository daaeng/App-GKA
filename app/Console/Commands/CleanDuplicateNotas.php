<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Nota;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CleanDuplicateNotas extends Command
{
    protected $signature = 'clean:duplicate-notas';
    protected $description = 'Membersihkan data duplikat di tabel notas';

    public function handle()
    {
        $duplicates = DB::table('notas')
            ->select('name', 'date', 'devisi', 'file_hash', DB::raw('COUNT(*) as count'))
            ->groupBy('name', 'date', 'devisi', 'file_hash')
            ->having('count', '>', 1)
            ->get();

        foreach ($duplicates as $duplicate) {
            $records = Nota::where('name', $duplicate->name)
                        ->where('date', $duplicate->date)
                        ->where('devisi', $duplicate->devisi)
                        ->where('file_hash', $duplicate->file_hash)
                        ->orderBy('created_at', 'desc')
                        ->skip(1)
                        ->get();

            foreach ($records as $record) {
                // Hapus file fisik
                $filePath = str_replace('storage/', 'public/', $record->file);
                Storage::delete($filePath);
                
                // Hapus record database
                $record->delete();
                $this->info("Data duplikat ID {$record->id} dihapus");
            }
        }

        $this->info('Proses pembersihan selesai!');
    }
}