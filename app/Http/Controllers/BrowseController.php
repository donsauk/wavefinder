<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrowseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = RadioStation::where('lastcheckok', true);

        // Apply country filter if provided
        if ($request->filled('country') && $request->country !== 'all') {
            $query->where('country', $request->country);
        }

        // Get unique countries for the dropdown
        $countries = RadioStation::whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->pluck('country')
            ->sort()
            ->mapWithKeys(fn($country) => [$country => $country]);

        $stations = $query->orderBy('votes', 'desc')->paginate(12);

        return Inertia::render('Browse', [
            'stations' => $stations,
            'countries' => $countries,
            'filters' => [
                'country' => $request->country ?? 'all',
            ],
        ]);
    }
}
