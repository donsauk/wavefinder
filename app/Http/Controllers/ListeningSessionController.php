<?php

namespace App\Http\Controllers;

use App\Models\ListeningSession;
use App\Models\RadioStation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ListeningSessionController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $request->validate([
            'station_uuid' => 'required|string'
        ]);

        $userId = Auth::id();
        $stationUuid = $request->station_uuid;

        // End any existing active sessions for this user
        ListeningSession::where('user_id', $userId)
            ->where('is_active', true)
            ->each(function ($session) {
                $session->endSession();
            });

        // Get station name for permanent storage
        $station = RadioStation::where('stationuuid', $stationUuid)->first();
        
        // Create new session
        $session = ListeningSession::create([
            'user_id' => $userId,
            'station_uuid' => $stationUuid,
            'station_name' => $station?->name,
            'started_at' => now(),
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'session_id' => $session->id
        ]);
    }

    public function stop(Request $request): JsonResponse
    {
        $userId = Auth::id();

        $activeSessions = ListeningSession::where('user_id', $userId)
            ->where('is_active', true)
            ->get();
        $activeSessions->each->endSession();

        return response()->json([
            'success' => true,
            'ended_sessions' => $activeSessions->count()
        ]);
    }

    public function heartbeat(Request $request): JsonResponse
    {
        $request->validate([
            'station_uuid' => 'required|string'
        ]);

        $userId = Auth::id();
        $stationUuid = $request->station_uuid;

        // Find active session for this station
        $session = ListeningSession::where('user_id', $userId)
            ->where('station_uuid', $stationUuid)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json(['success' => false, 'message' => 'No active session found']);
        }

        // Update the session's updated_at timestamp
        $session->touch();

        return response()->json([
            'success' => true,
            'current_duration' => $session->getCurrentDuration()
        ]);
    }

    public function getStats(): JsonResponse
    {
        $userId = Auth::id();

        // Get total listening time
        $totalSeconds = ListeningSession::where('user_id', $userId)
            ->sum('duration_seconds');

        // Get listening time per station using stored station names
        $stationStats = ListeningSession::where('user_id', $userId)
            ->selectRaw('
                station_uuid,
                station_name,
                SUM(duration_seconds) as total_seconds,
                COUNT(*) as session_count
            ')
            ->groupBy('station_uuid', 'station_name')
            ->orderByDesc('total_seconds')
            ->get()
            ->map(fn ($stat) => [
                'station_uuid' => $stat->station_uuid,
                'station_name' => $stat->station_name ?? 'Unknown Station',
                'total_seconds' => (int) $stat->total_seconds,
                'session_count' => (int) $stat->session_count,
                'formatted_duration' => $this->formatDuration((int) $stat->total_seconds),
            ]);

        // Get recent sessions using stored station names
        $recentSessions = ListeningSession::where('user_id', $userId)
            ->select(
                'station_uuid',
                'station_name',
                'started_at',
                'duration_seconds',
                'is_active'
            )
            ->orderByDesc('started_at')
            ->limit(10)
            ->get()
            ->map(fn ($session) => [
                'station_uuid' => $session->station_uuid,
                'station_name' => $session->station_name ?? 'Unknown Station',
                'started_at' => $session->started_at,
                'duration_seconds' => (int) $session->duration_seconds,
                'formatted_duration' => $this->formatDuration((int) $session->duration_seconds),
                'is_active' => (bool) $session->is_active,
            ]);

        return response()->json([
            'total_seconds' => $totalSeconds,
            'total_formatted' => $this->formatDuration($totalSeconds),
            'station_stats' => $stationStats,
            'recent_sessions' => $recentSessions
        ]);
    }

    private function formatDuration(int $seconds): string
    {
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
}
