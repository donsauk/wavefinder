<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    // Display user profile page with user info and future stats
    public function profile()
    {
        $user = auth()->user();
        
        // Future: Add user statistics here
        $userStats = [
            'joined_date' => $user->created_at,
            'stations_listened' => 0, // Future implementation
            'listening_time' => 0, // Future implementation
            'favorite_count' => 0, // Future implementation
            'level' => 1, // Future gamification system
            'xp' => 0, // Future gamification system
        ];

        return Inertia::render('Profile', [
            'user' => $user,
            'stats' => $userStats
        ]);
    }

    // Display user settings page
    public function settings()
    {
        $user = auth()->user();

        return Inertia::render('Settings', [
            'user' => $user
        ]);
    }
}
