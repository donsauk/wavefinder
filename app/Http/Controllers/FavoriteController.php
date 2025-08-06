<?php

namespace App\Http\Controllers;

use App\Models\UserFavorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'station_uuid' => 'required|string',
        ]);

        $userId = auth()->id();
        $stationUuid = $request->station_uuid;

        // Check if favorite already exists
        $favorite = UserFavorite::where('user_id', $userId)
            ->where('station_uuid', $stationUuid)
            ->first();

        if ($favorite) {
            // Remove from favorites
            $favorite->delete();
            $isFavorited = false;
        } else {
            // Add to favorites
            UserFavorite::create([
                'user_id' => $userId,
                'station_uuid' => $stationUuid,
            ]);
            $isFavorited = true;
        }

        // If it's an AJAX request, return JSON
        if ($request->expectsJson()) {
            return response()->json([
                'favorited' => $isFavorited,
            ]);
        }
        
        // For form submissions, redirect back
        return back()->with('success', $isFavorited ? 'Station added to favorites!' : 'Station removed from favorites!');
    }
}
