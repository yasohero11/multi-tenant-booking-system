<?php

use Illuminate\Support\Facades\Route;
use Modules\Teams\Http\Controllers\TeamsController;


Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::get('teams', [TeamsController::class, 'index']);
    Route::post('teams', [TeamsController::class, 'store']);
    Route::post('teams/{id}/availability', [TeamsController::class, 'setAvailability']);
    Route::get('teams/{id}/availability', [TeamsController::class, 'getAvailability']);
    Route::get('teams/{id}/generate-slots', [TeamsController::class, 'generateSlots']);
});
