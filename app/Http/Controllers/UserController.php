<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function profile()
    {
        $user = auth()->user();
        
        return Inertia::render('Profile', [
            'user' => array_merge($user->toArray(), [
                'xp_to_next_level' => $user->getXpToNextLevel(),
                'xp_progress_percent' => $user->getXpProgressPercent(),
                'total_listening_hours' => $user->getTotalListeningHours(),
            ])
        ]);
    }

    public function settings()
    {
        return Inertia::render('Settings', [
            'user' => auth()->user()
        ]);
    }
}
