<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BrowseController extends Controller
{
    public function index(Request $request): Response
    {
        // Base: only show stations that are currently working
        $query = RadioStation::where('lastcheckok', true);

        if ($request->filled('country') && $request->country !== 'all') {
            $query->where('country', $request->country);
        }
        
        if ($request->filled('countrycode') && $request->countrycode !== 'all') {
            $query->where('countrycode', $request->countrycode);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('tags', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if ($request->boolean('favorites_only') && auth()->check()) {
            $query->join('user_favorites', function($join) {
                $join->on('radio_stations.stationuuid', '=', 'user_favorites.station_uuid')
                     ->where('user_favorites.user_id', auth()->id());
            })->select('radio_stations.*');
        }

        $isHistoryFilter = $request->boolean('history_only') && auth()->check();
        if ($isHistoryFilter) {
            $listenedStationUuids = DB::table('listening_sessions')
                ->where('user_id', auth()->id())
                ->distinct()
                ->pluck('station_uuid');
            
            $query->whereIn('stationuuid', $listenedStationUuids);
        }

        // Unique countries for dropdown
        $countries = RadioStation::whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->orderBy('country')
            ->pluck('country', 'country');

        // Get sort parameters with safe direction
        $sortBy = $request->get('sort_by', 'votes');
        $sortDirection = strtolower($request->get('sort_direction', 'desc'));
        $sortDirection = in_array($sortDirection, ['asc', 'desc'], true) ? $sortDirection : 'desc';
        
        $sortFieldMap = [
            'votes' => 'votes',
            'clickcount' => 'clickcount',
            'clicktrend' => 'clicktrend',
        ];
        
        $sortColumn = $sortFieldMap[$sortBy] ?? 'votes';

        // Apply sorting and paginate
        $stations = $query->orderBy($sortColumn, $sortDirection)->paginate(12);
        
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
