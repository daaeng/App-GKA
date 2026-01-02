<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
  
    public function index()
    {
        return Inertia::render("Roles/Index", [
            "roles" => Role::with('permissions')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render("Roles/Create", [
            "permissions" => Permission::pluck('name')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'permissions' => 'required'
        ]);

        $role = Role::create([ 'name' => $request->name]);
        $role -> syncPermissions($request->permissions);
        return to_route('roles.index');
    }

    public function show(string $id)
    {
        $role = Role::find($id);

        return Inertia::render("Roles/Show", [
            "role" => $role,
            "permissions" => $role->permissions()->pluck('name'),
        ]);
    }

    public function edit(string $id)
    {
        $role = Role::find($id);
        return Inertia::render("Roles/Edit", [
            "role" => $role,
            "rolePermissions" => $role->permissions()->pluck('name'),
            "permissions" => Permission::pluck('name')
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required',
            'permissions' => 'required'
        ]);

        $role = Role::find($id);
        $role->name = $request->name;
        $role->save();
        $role -> syncPermissions($request->permissions);
        return to_route('roles.index');
    }

    public function destroy(string $id)
    {
        Role::destroy($id);
        return to_route('roles.index');
    }
}
