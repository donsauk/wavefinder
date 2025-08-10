<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    // Get comments for a specific station - returns JSON response with comments and user data
    public function index(Request $request, string $stationUuid): JsonResponse
    {
        // Fetch comments for the station with user relationship, ordered by newest first
        $comments = Comment::where('station_uuid', $stationUuid)
            ->with('user:id,name') // Eager load user data (id and name only)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'comments' => $comments
        ]);
    }

    // Store a new comment - requires authentication
    public function store(Request $request, string $stationUuid): JsonResponse
    {
        // Validate comment content (required, max 1000 characters)
        $request->validate([
            'content' => 'required|string|max:1000|min:1'
        ]);

        // Create comment with authenticated user and station UUID
        $comment = Comment::create([
            'station_uuid' => $stationUuid,
            'user_id' => Auth::id(),
            'content' => trim($request->input('content'))
        ]);

        // Load the user relationship for the response
        $comment->load('user:id,name');

        return response()->json([
            'success' => true,
            'comment' => $comment
        ], 201);
    }

    // Delete a comment - only the author can delete their own comment
    public function destroy(string $stationUuid, Comment $comment): JsonResponse
    {
        // Check if the authenticated user owns this comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own comments'
            ], 403);
        }

        // Verify comment belongs to the specified station
        if ($comment->station_uuid !== $stationUuid) {
            return response()->json([
                'success' => false, 
                'message' => 'Comment not found for this station'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ]);
    }
}
