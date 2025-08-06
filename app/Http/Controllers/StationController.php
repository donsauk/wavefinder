<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StationController extends Controller
{
    // Display individual station page with full station details
    public function show(string $stationuuid)
    {
        $station = RadioStation::where('stationuuid', $stationuuid)
            ->where('lastcheckok', true) // Only show stations that are currently working
            ->firstOrFail();

        return Inertia::render('Station', [
            'station' => $station
        ]);
    }

    // Redirect to a random working station
    public function random()
    {
        $randomStation = RadioStation::where('lastcheckok', true)
            ->inRandomOrder()
            ->first();

        if (!$randomStation) {
            return redirect()->route('browse');
        }

        return redirect()->route('station', ['stationuuid' => $randomStation->stationuuid]);
    }
}
