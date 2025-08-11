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

        // Create new session
        $session = ListeningSession::create([
            'user_id' => $userId,
            'station_uuid' => $stationUuid,
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

        // End all active sessions for this user
        $endedSessions = ListeningSession::where('user_id', $userId)
            ->where('is_active', true)
            ->get();

        foreach ($endedSessions as $session) {
            $session->endSession();
        }

        return response()->json([
            'success' => true,
            'ended_sessions' => $endedSessions->count()
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

        // Get listening time per station with station details
        $stationStats = ListeningSession::where('listening_sessions.user_id', $userId)
            ->join('radio_stations', 'listening_sessions.station_uuid', '=', 'radio_stations.stationuuid')
            ->selectRaw('
                listening_sessions.station_uuid,
                radio_stations.name,
                radio_stations.country,
                radio_stations.language,
                SUM(listening_sessions.duration_seconds) as total_seconds,
                COUNT(*) as session_count
            ')
            ->groupBy('listening_sessions.station_uuid', 'radio_stations.name', 'radio_stations.country', 'radio_stations.language')
            ->orderByDesc('total_seconds')
            ->get()
            ->map(function ($stat) {
                return [
                    'station_uuid' => $stat->station_uuid,
                    'station_name' => $stat->name,
                    'country' => $stat->country,
                    'language' => $stat->language,
                    'total_seconds' => $stat->total_seconds,
                    'session_count' => $stat->session_count,
                    'formatted_duration' => $this->formatDuration($stat->total_seconds)
                ];
            });

        // Get recent sessions with station details
        $recentSessions = ListeningSession::where('listening_sessions.user_id', $userId)
            ->leftJoin('radio_stations', 'listening_sessions.station_uuid', '=', 'radio_stations.stationuuid')
            ->select(
                'listening_sessions.station_uuid',
                'listening_sessions.started_at',
                'listening_sessions.duration_seconds',
                'listening_sessions.is_active',
                'radio_stations.name as station_name',
                'radio_stations.country'
            )
            ->orderByDesc('listening_sessions.started_at')
            ->limit(10)
            ->get()
            ->map(function ($session) {
                return [
                    'station_uuid' => $session->station_uuid,
                    'station_name' => $session->station_name ?? 'Unknown Station',
                    'country' => $session->country,
                    'started_at' => $session->started_at,
                    'duration_seconds' => $session->duration_seconds,
                    'formatted_duration' => $this->formatDuration($session->duration_seconds),
                    'is_active' => $session->is_active
                ];
            });

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
