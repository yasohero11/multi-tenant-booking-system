<?php

namespace Modules\Teams\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Teams\App\Services\TeamsService;

class TeamsController extends Controller
{
    protected $teamsService;

    public function __construct(TeamsService $teamsService)
    {
        $this->teamsService = $teamsService;
    }


    public function index(Request $request)
    {
        return $this->teamsService->listTeams();
    }

    public function store(Request $request)
    {
        return $this->teamsService->createTeam($request->all());
    }
    public function setAvailability(Request $request, $id)
    {
        return $this->teamsService->setAvailability($id, $request->all());
    }

    public function getAvailability($id)
    {
        return $this->teamsService->getAvailability($id);
    }

    public function generateSlots(Request $request, $id)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        return $this->teamsService->generateSlots($id, $from, $to);
    }
}
