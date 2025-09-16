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
            // Use last heartbeat time (updated_at) to prevent inflating duration
            // if the app/browser was closed without an explicit stop.
            $endCandidate = $this->updated_at && $this->updated_at->gt($this->started_at)
                ? $this->updated_at
                : now();

            $this->ended_at = $endCandidate;
            $this->duration_seconds = max(0, $this->started_at->diffInSeconds($endCandidate));
            $this->is_active = false;
            $this->save();
            
            // Award XP to user (1 XP per minute listened)
            // Only award XP if listened for at least 30 seconds
            if ($this->duration_seconds >= 30) {
                $minutes = floor($this->duration_seconds / 60);
                if ($minutes > 0) {
                    $this->user->addXp($minutes);
                }
            }
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
            // Reflect duration up to the last heartbeat to avoid runaway totals
            $endCandidate = $this->updated_at && $this->updated_at->gt($this->started_at)
                ? $this->updated_at
                : now();
            return max(0, $this->started_at->diffInSeconds($endCandidate));
        }
        return (int) $this->duration_seconds;
    }
}
