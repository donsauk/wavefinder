<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\RedirectResponse;
use ConsoleTVs\Profanity\Facades\Profanity;

class CommentController extends Controller
{
    private function reject(string $field, string $error, ?string $flash = null, bool $withInput = false)
    {
        $response = back()->withErrors([$field => $error]);
        if ($withInput) {
            $response = $response->withInput();
        }
        return $response->with('flash.error', $flash ?? $error);
    }

    // Store a new comment and redirect back with fresh data
    public function store(Request $request, string $stationUuid): RedirectResponse
    {
        $rateLimitKey = 'comment:' . Auth::id();
        
        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            return back()->with('flash.error', 'You\'re posting too fast!');
        }

        $request->validate([
            'content' => 'required|string|max:1000|min:1'
        ]);

        if (Auth::user()->isMuted()) {
            return $this->reject('content', 'You are currently muted and cannot post comments.');
        }

        $content = trim($request->input('content'));
        if (!Profanity::blocker($content)->clean()) {
            return $this->reject(
                'content',
                'Your comment contains inappropriate language. Please keep it respectful.',
                'Comment rejected due to inappropriate language.',
                true
            );
        }

        Comment::create([
            'station_uuid' => $stationUuid,
            'user_id' => Auth::id(),
            'content' => $content
        ]);

        RateLimiter::hit($rateLimitKey, 60);

        return back()->with('flash.message', 'Comment posted successfully!');
    }

    // Delete a comment and redirect back with message
    public function destroy(string $stationUuid, Comment $comment): RedirectResponse
    {
        if ($comment->user_id !== Auth::id()) {
            return $this->reject('comment', 'You can only delete your own comments.');
        }

        if ($comment->station_uuid !== $stationUuid) {
            return $this->reject('comment', 'Comment not found for this station.');
        }

        $comment->delete();

        return back()->with('flash.message', 'Comment deleted successfully!');
    }
}
