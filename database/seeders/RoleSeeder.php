<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $roles = [
            ['role_name' => 'ROLE_ADMIN'],
            ['role_name' => 'ROLE_GUEST']
        ];
        foreach($roles as $role) Role::create($role);
    }
}
