<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;
use App\Models\UserFavorite;
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
        
        // Apply country code filter (for Local Stations button)
        if ($request->filled('countrycode') && $request->countrycode !== 'all') {
            $query->where('countrycode', $request->countrycode);
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

        // Apply favorites filter - only show user's favorite stations if requested and user is authenticated
        if ($request->boolean('favorites_only') && auth()->check()) {
            // Use a join instead of loading all favorites into memory
            $query->join('user_favorites', function($join) {
                $join->on('radio_stations.stationuuid', '=', 'user_favorites.station_uuid')
                     ->where('user_favorites.user_id', auth()->id());
            });
        }

        // Apply history filter - only show stations user has listened to
        $isHistoryFilter = $request->boolean('history_only') && auth()->check();
        if ($isHistoryFilter) {
            $query->join('listening_sessions', function($join) {
                $join->on('radio_stations.stationuuid', '=', 'listening_sessions.station_uuid')
                     ->where('listening_sessions.user_id', auth()->id());
            })->distinct();
        }

        // Get unique countries for the dropdown filter - exclude empty/null values
        $countries = RadioStation::whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->pluck('country')
            ->sort()
            ->mapWithKeys(fn($country) => [$country => $country]);

        // Get sort parameters for both history and normal filtering
        $sortBy = $request->get('sort_by', 'votes');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        // Apply sorting - for history filter, sort by most recent listening session
        if ($isHistoryFilter) {
            $stations = $query->orderBy('listening_sessions.started_at', 'desc')->paginate(12);
        } else {
            // Map frontend sort field names to database column names
            $sortFieldMap = [
                'votes' => 'votes',
                'clickcount' => 'clickcount',
                'clicktrend' => 'clicktrend',
            ];
            
            // Use mapped field name or default to votes
            $sortColumn = $sortFieldMap[$sortBy] ?? 'votes';
            
            // Execute query with dynamic sorting and pagination
            $stations = $query->orderBy($sortColumn, $sortDirection)->paginate(12);
        }
        
        // Append current query parameters to pagination links
        $stations->appends($request->query());

        // Return Inertia response with data and current filter state
        return Inertia::render('Browse', [
            'stations' => $stations,              // Paginated station results
            'countries' => $countries,            // Country options for dropdown
            'filters' => [                        // Current filter state (sent back to frontend)
                'country' => $request->country ?? 'all',
                'countrycode' => $request->countrycode ?? 'all',
                'search' => $request->search ?? '',
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'favorites_only' => $request->boolean('favorites_only'),
                'history_only' => $request->boolean('history_only'),
            ],
        ]);
    }
}
