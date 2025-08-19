<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModerationController extends Controller
{
    public function deleteComment(Comment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully');
    }

    public function deleteChatMessage(ChatMessage $chatMessage)
    {
        $chatMessage->delete();

        broadcast(new \App\Events\ChatMessageDeleted($chatMessage->id, $chatMessage->station_uuid));

        return back()->with('success', 'Message deleted successfully');
    }

    public function muteUser(Request $request, User $user)
    {
        $request->validate([
            'hours' => 'required|numeric|min:0.1|max:24',
            'reason' => 'nullable|string|max:255',
        ]);

        $user->muteUser($request->hours, $request->reason, Auth::id());

        // Broadcast to the muted user so they know they've been muted
        broadcast(new \App\Events\UserMuted($user->id, $user->muted_until, $request->reason));

        return back()->with('success', "User {$user->name} muted for {$request->hours} hours");
    }

    public function unmuteUser(User $user)
    {
        $user->unmute();

        // Broadcast to the unmuted user so they know they've been unmuted
        broadcast(new \App\Events\UserUnmuted($user->id));

        return back()->with('success', "User {$user->name} unmuted");
    }
}
