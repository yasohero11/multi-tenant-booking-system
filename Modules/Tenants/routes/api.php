<?php

use Illuminate\Support\Facades\Route;
use Modules\Tenants\Http\Controllers\TenantsController;


Route::prefix('v1')->group(function () {
    Route::get('tenant', [TenantsController::class, 'getAllTenants']);
});
