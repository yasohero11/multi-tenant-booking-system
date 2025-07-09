<?php

namespace Modules\Bookings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Bookings\App\Services\BookingsService;

class BookingsController extends Controller
{
    protected $bookingsService;

    public function __construct(BookingsService $bookingsService)
    {
        $this->bookingsService = $bookingsService;
    }

    public function store(Request $request)
    {
        return $this->bookingsService->createBooking($request->user(), $request->all());
    }

    public function myBookings(Request $request)
    {
        return $this->bookingsService->getUserBookings($request->user());
    }
}
