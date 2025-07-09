<?php

namespace Modules\Tenants\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Tenants\App\Models\Tenant;

class TenantsController extends Controller
{
    public function getAllTenants()
    {
        return response()->json(Tenant::all());
    }
}
