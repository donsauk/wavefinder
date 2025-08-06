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
        // Start with base query - only show stations that are currently working
        $query = RadioStation::where('lastcheckok', true);

        // Apply country filter if provided and not 'all'
        if ($request->filled('country') && $request->country !== 'all') {
            $query->where('country', $request->country);
        }

        // Apply search filter - searches both station name and tags with LIKE queries
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            // Use grouped WHERE clause to search name OR tags
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('tags', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        // Get unique countries for the dropdown filter - exclude empty/null values
        $countries = RadioStation::whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->pluck('country')
            ->sort()
            ->mapWithKeys(fn($country) => [$country => $country]);

        // Execute query with pagination, ordered by vote count (most popular first)
        $stations = $query->orderBy('votes', 'desc')->paginate(12);

        // Return Inertia response with data and current filter state
        return Inertia::render('Browse', [
            'stations' => $stations,              // Paginated station results
            'countries' => $countries,            // Country options for dropdown
            'filters' => [                        // Current filter state (sent back to frontend)
                'country' => $request->country ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }
}
