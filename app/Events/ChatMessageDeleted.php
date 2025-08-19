<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageId;
    public $stationUuid;

    public function __construct($messageId, $stationUuid)
    {
        $this->messageId = $messageId;
        $this->stationUuid = $stationUuid;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("station-chat.{$this->stationUuid}")
        ];
    }

    public function broadcastAs()
    {
        return 'chat.message.deleted';
    }

    public function broadcastWith()
    {
        return [
            'messageId' => $this->messageId,
        ];
    }
}
