<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use ConsoleTVs\Profanity\Facades\Profanity;

class ChatController extends Controller
{
    private function reject(string $field, string $error, ?string $flash = null)
    {
        $response = back()->withErrors([$field => $error]);
        return $response->with('flash.error', $flash ?? $error);
    }

    public function store(Request $request)
    {
        $rateLimitKey = 'chat:' . Auth::id();
        if (RateLimiter::tooManyAttempts($rateLimitKey, 2)) {
            return $this->reject('message', "You're posting too fast!", "You're posting too fast!");
        }

        $request->validate([
            'station_uuid' => 'required|string',
            'message' => 'required|string|max:500',
        ]);

        $user = Auth::user();

        if ($user->isMuted()) {
            return $this->reject('message', 'You are currently muted and cannot send messages.');
        }

        $message = trim($request->message);
        if ($message === '') {
            return $this->reject('message', 'Message cannot be empty.');
        }
        if (!Profanity::blocker($message)->clean()) {
            return $this->reject(
                'message',
                'Your message contains inappropriate language. Please keep it respectful.',
                'Message rejected due to inappropriate language.'
            );
        }

        $chatMessage = ChatMessage::create([
            'station_uuid' => $request->station_uuid,
            'user_id' => $user->id,
            'username' => $user->name,
            'message' => $message,
        ]);

        $chatMessage->load('user:id,name,isModerator,avatar_path');
        if ($chatMessage->user) {
            $chatMessage->user->append('avatar_url');
        }

        RateLimiter::hit($rateLimitKey, 1);

        broadcast(new MessageSent($chatMessage));

        return back();
    }

    public function getMessages(Request $request, string $stationUuid)
    {
        $messages = ChatMessage::with('user:id,name,isModerator,avatar_path')
            ->where('station_uuid', $stationUuid)
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        // Ensure avatar_url is included in the response
        $messages->each(fn ($m) => $m->user?->append('avatar_url'));

        return response()->json($messages);
    }
}
