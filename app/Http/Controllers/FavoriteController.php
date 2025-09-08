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

        $favorite = UserFavorite::firstOrCreate([
            'user_id' => auth()->id(),
            'station_uuid' => $request->station_uuid,
        ]);

        if ($favorite->wasRecentlyCreated) {
            return back()->with('flash.message', 'Station added to favorites!');
        }

        $favorite->delete();
        return back()->with('flash.message', 'Station removed from favorites!');
    }
}
