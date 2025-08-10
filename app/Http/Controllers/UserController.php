<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function profile()
    {
        return Inertia::render('Profile', [
            'user' => auth()->user()
        ]);
    }

    public function settings()
    {
        return Inertia::render('Settings', [
            'user' => auth()->user()
        ]);
    }
}
