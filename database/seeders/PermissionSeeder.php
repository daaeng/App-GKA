<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'usermanagements.view',
            'usermanagements.create',
            'usermanagements.edit',
            'usermanagements.delete',

            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            'products.view',
            'products.create',
            'products.edit',
            'products.delete',

            'requests.view',
            'requests.create',
            'requests.edit',
            'requests.delete',

            'notas.view',
            'notas.create',
            'notas.edit',
            'notas.delete',

            'administrasis.view',
            'administrasis.create',
            'administrasis.edit',
            'administrasis.delete',

            'incisor.view',
            'incisor.create',
            'incisor.edit',
            'incisor.delete',
            
            'incised.view',
            'incised.create',
            'incised.edit',
            'incised.delete',
            
            'kasbons.view',
            'kasbons.create',
            'kasbons.edit',
            'kasbons.delete',
            
            'pegawai.view',
            'pegawai.create',
            'pegawai.edit',
            'pegawai.delete',
            
            'payroll.view',
            'payroll.create',
            'payroll.edit',
            'payroll.delete',
            
        ];

        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }
    }
}
