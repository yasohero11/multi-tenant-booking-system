<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;


Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    // Route::apiResource('auths', AuthController::class)->names('auth');
});

Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});
