<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Modules\Tenants\App\Models\Tenant;
use Modules\Users\App\Models\User;
use Modules\Auth\App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }



    public function register(Request $request)
    {
        $result = $this->authService->register($request->all());
        if (isset($result['errors'])) {
            return response()->json(['errors' => $result['errors']], $result['status']);
        }
        return response()->json([
            'tenant' => $result['tenant'],
            'user' => $result['user'],
            'token' => $result['token'],
        ], $result['status']);
    }

    public function login(Request $request)
    {
        $result = $this->authService->login($request->all());
        if (isset($result['errors']) || isset($result['message'])) {
            return response()->json($result, $result['status']);
        }
        return response()->json([
            'user' => $result['user'],
            'token' => $result['token'],
        ], $result['status']);
    }
}
