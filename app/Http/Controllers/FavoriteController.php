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
            $message = 'Station removed from favorites!';
        } else {
            // Add to favorites
            UserFavorite::create([
                'user_id' => $userId,
                'station_uuid' => $stationUuid,
            ]);
            $message = 'Station added to favorites!';
        }
        
        // Always redirect back with flash message - Inertia way
        return back()->with('flash.message', $message);
    }
}
