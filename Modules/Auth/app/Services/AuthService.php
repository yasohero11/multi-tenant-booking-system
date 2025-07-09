<?php

namespace Modules\Auth\App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Modules\Tenants\App\Models\Tenant;
use Modules\Users\App\Models\User;

class AuthService
{
    public function register(array $data)
    {
        $validator = Validator::make($data, [
            'tenant_name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return ['errors' => $validator->errors(), 'status' => 422];
        }

        $tenant = Tenant::firstOrCreate(['domain' => $data['domain']], [
            'name' => $data['tenant_name'],
            'domain' => $data['domain'],
        ]);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'tenant' => $tenant,
            'user' => $user,
            'token' => $token,
            'status' => 201,
        ];
    }

    public function login(array $data)
    {
        $validator = Validator::make($data, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ['errors' => $validator->errors(), 'status' => 422];
        }

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return ['message' => 'Invalid credentials', 'status' => 401];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'status' => 200,
        ];
    }
}
