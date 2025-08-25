<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;

class UserController extends Controller
{
    public function profile()
    {
        $user = auth()->user();
        
        return Inertia::render('Profile', [
            'user' => array_merge($user->toArray(), [
                'avatar_url' => $user->avatar_url,
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

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:4096', // 4MB in kilobytes
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
            ]
        ]);

        $user = auth()->user();

        try {
            // Delete old avatar if it exists
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            // Store the new avatar
            $path = $request->file('avatar')->store('avatars', 'public');

            // Update user's avatar path
            $user->update([
                'avatar_path' => $path
            ]);

            return back()->with('success', 'Avatar updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update avatar. Please try again.');
        }
    }
}
