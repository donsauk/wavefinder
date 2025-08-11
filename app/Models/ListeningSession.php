<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ListeningSession extends Model
{
    protected $fillable = [
        'user_id',
        'station_uuid',
        'station_name',
        'started_at',
        'ended_at',
        'duration_seconds',
        'is_active'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Calculate and update duration when ending session
    public function endSession(): void
    {
        if ($this->is_active && $this->started_at) {
            $this->ended_at = now();
            $this->duration_seconds = $this->started_at->diffInSeconds($this->ended_at);
            $this->is_active = false;
            $this->save();
            
            // Award XP to user (1 XP per minute listened)
            $minutes = ceil($this->duration_seconds / 60);
            $this->user->addXp($minutes);
        }
    }

    // Get formatted duration
    public function getFormattedDurationAttribute(): string
    {
        $seconds = $this->duration_seconds;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $remainingSeconds = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $remainingSeconds);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $remainingSeconds);
        } else {
            return sprintf('%ds', $remainingSeconds);
        }
    }

    // Get current session duration (for active sessions)
    public function getCurrentDuration(): int
    {
        if ($this->is_active && $this->started_at) {
            return $this->started_at->diffInSeconds(now());
        }
        return $this->duration_seconds;
    }
}
