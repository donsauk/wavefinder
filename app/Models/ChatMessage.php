<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Builder;

class ChatMessage extends Model
{
    use MassPrunable;

    protected $fillable = [
        'station_uuid',
        'user_id',
        'username',
        'message',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define which records should be pruned.
     */
    public function prunable(): Builder
    {
        $hours = (int) config('chat.retention_hours', 24);

        // If retention is disabled (<= 0), return a query that matches nothing
        if ($hours <= 0) {
            return static::whereRaw('1 = 0');
        }

        return static::where('created_at', '<=', now()->subHours($hours));
    }
}
