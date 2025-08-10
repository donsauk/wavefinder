<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    // Store a new comment and redirect back with fresh data
    public function store(Request $request, string $stationUuid): RedirectResponse
    {
        // Validate comment content (required, max 1000 characters)
        $request->validate([
            'content' => 'required|string|max:1000|min:1'
        ]);

        // Create comment with authenticated user and station UUID
        Comment::create([
            'station_uuid' => $stationUuid,
            'user_id' => Auth::id(),
            'content' => trim($request->input('content'))
        ]);

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
