<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class ChatController extends Controller
{
    public function store(Request $request)
    {
        // Check rate limit: 2 messages per second per user
        $rateLimitKey = 'chat:' . Auth::id();
        
        if (RateLimiter::tooManyAttempts($rateLimitKey, 2)) {
            return back()
                ->withErrors(['message' => 'You\'re posting too fast!'])
                ->with('flash.error', 'You\'re posting too fast!');
        }

        $request->validate([
            'station_uuid' => 'required|string',
            'message' => 'required|string|max:500',
        ]);

        $user = Auth::user();

        $chatMessage = ChatMessage::create([
            'station_uuid' => $request->station_uuid,
            'user_id' => $user->id,
            'username' => $user->name,
            'message' => $request->message,
        ]);

        // Hit the rate limiter (1 second window)
        RateLimiter::hit($rateLimitKey, 1);

        broadcast(new MessageSent($chatMessage))->toOthers();

        return back();
    }

    public function getMessages(Request $request, string $stationUuid)
    {
        $messages = ChatMessage::where('station_uuid', $stationUuid)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }
}
