<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function store(Request $request)
    {
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
