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
    // Store a new comment and redirect back with fresh data
    public function store(Request $request, string $stationUuid): RedirectResponse
    {
        // Check rate limit: 3 comments per minute per user
        $rateLimitKey = 'comment:' . Auth::id();
        
        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            return back()->with('flash.error', 'You\'re posting too fast!');
        }

        // Validate comment content (required, max 1000 characters)
        $request->validate([
            'content' => 'required|string|max:1000|min:1'
        ]);

        $user = Auth::user();

        // Check if user is muted
        if ($user->isMuted()) {
            return back()
                ->withErrors(['content' => 'You are currently muted and cannot post comments.'])
                ->with('flash.error', 'You are currently muted and cannot post comments.');
        }

        // Check for profanity in comment content
        $content = trim($request->input('content'));
        if (!Profanity::blocker($content)->clean()) {
            return back()
                ->withErrors(['content' => 'Your comment contains inappropriate language. Please keep it respectful.'])
                ->withInput()
                ->with('flash.error', 'Comment rejected due to inappropriate language.');
        }

        // Create comment with authenticated user and station UUID
        Comment::create([
            'station_uuid' => $stationUuid,
            'user_id' => Auth::id(),
            'content' => $content
        ]);

        // Hit the rate limiter (60 seconds = 1 minute)
        RateLimiter::hit($rateLimitKey, 60);

        // Redirect back to station page with success message
        return back()->with('flash.message', 'Comment posted successfully!');
    }

    // Delete a comment and redirect back with message
    public function destroy(string $stationUuid, Comment $comment): RedirectResponse
    {
        // Check if the authenticated user owns this comment
        if ($comment->user_id !== Auth::id()) {
            return back()->withErrors([
                'comment' => 'You can only delete your own comments'
            ]);
        }

        // Verify comment belongs to the specified station
        if ($comment->station_uuid !== $stationUuid) {
            return back()->withErrors([
                'comment' => 'Comment not found for this station'
            ]);
        }

        $comment->delete();

        return back()->with('flash.message', 'Comment deleted successfully!');
    }
}
