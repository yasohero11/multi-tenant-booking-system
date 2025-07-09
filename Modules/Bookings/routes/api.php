<?php

use Illuminate\Support\Facades\Route;
use Modules\Bookings\Http\Controllers\BookingsController;


Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::post('bookings', [BookingsController::class, 'store']);
    Route::get('bookings', [BookingsController::class, 'myBookings']);
});
