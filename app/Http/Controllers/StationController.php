<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;
use App\Models\UserFavorite;
use App\Models\UserStationVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StationController extends Controller
{
    // Display individual station page with full station details
    public function show(string $stationuuid)
    {
        $station = RadioStation::where('stationuuid', $stationuuid)
            ->where('lastcheckok', true) // Only show stations that are currently working
            ->firstOrFail();

        // Check if current user has favorited this station
        $isFavorited = auth()->check() ? 
            UserFavorite::where('user_id', auth()->id())
                ->where('station_uuid', $stationuuid)
                ->exists() 
            : false;

        // Check voting status - users can vote every 10 minutes from same IP
        $canVote = true;
        $nextVoteTime = null;
        
        if (auth()->check()) {
            // Check 10-minute rate limit for any vote from this IP
            $recentVote = UserStationVote::where('ip_address', request()->ip())
                ->where('created_at', '>', now()->subMinutes(10))
                ->latest()
                ->first();
                
            if ($recentVote) {
                $canVote = false;
                $nextVoteTime = $recentVote->created_at->addMinutes(10);
            }
        }

        return Inertia::render('Station', [
            'station' => $station,
            'isFavorited' => $isFavorited,
            'canVote' => $canVote,
            'nextVoteTime' => $nextVoteTime?->toISOString(),
        ]);
    }

    // Track station click and report to radio-browser API for popularity statistics
    public function click(string $stationuuid)
    {
        $station = RadioStation::where('stationuuid', $stationuuid)
            ->where('lastcheckok', true)
            ->firstOrFail();

        // Report click to radio-browser.info API to help with popularity statistics
        try {
            \Http::timeout(5)
                ->withHeaders([
                    'User-Agent' => 'WAVEFINDER/1.0 (Laravel Radio App)'
                ])
                ->post("http://de2.api.radio-browser.info/json/url/{$stationuuid}");
        } catch (\Exception $e) {
            // Silently fail - don't let API issues affect user experience
            \Log::warning("Failed to report station click to radio-browser API: " . $e->getMessage());
        }

        // Return the station URL for the frontend to play
        return response()->json([
            'url' => $station->url_resolved ?: $station->url,
            'name' => $station->name
        ]);
    }

    // Redirect to a random working station
    public function random()
    {
        $randomStation = RadioStation::where('lastcheckok', true)
            ->inRandomOrder()
            ->first();

        if (!$randomStation) {
            return redirect()->route('browse');
        }

        return redirect()->route('station', ['stationuuid' => $randomStation->stationuuid]);
    }

    // Vote for a station - helps Radio Browser API track popular stations
    public function vote(Request $request, string $stationuuid)
    {
        // Ensure user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $station = RadioStation::where('stationuuid', $stationuuid)
            ->where('lastcheckok', true)
            ->firstOrFail();

        $userId = auth()->id();
        $ipAddress = $request->ip();

        // Check 10-minute rate limit for this IP address
        $recentVote = UserStationVote::where('ip_address', $ipAddress)
            ->where('created_at', '>', now()->subMinutes(10))
            ->latest()
            ->first();

        if ($recentVote) {
            $nextVoteTime = $recentVote->created_at->addMinutes(10);
            $minutesLeft = now()->diffInMinutes($nextVoteTime, false);
            
            return response()->json([
                'error' => 'Rate limit exceeded. Please wait before voting again.',
                'next_vote_time' => $nextVoteTime->toISOString(),
                'minutes_left' => ceil($minutesLeft)
            ], 429);
        }

        // Submit vote to Radio Browser API
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'WAVEFINDER/1.0 (Laravel Radio App)'
                ])
                ->get("http://de2.api.radio-browser.info/json/vote/{$stationuuid}");

            if (!$response->successful()) {
                Log::warning("Radio Browser API vote failed: " . $response->status() . " " . $response->body());
                
                // Still record the vote in our database even if Radio Browser API is down
                UserStationVote::create([
                    'user_id' => $userId,
                    'station_uuid' => $stationuuid,
                    'ip_address' => $ipAddress,
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Vote recorded! (Radio Browser API temporarily unavailable)',
                    'api_down' => true
                ]);
            }

            $apiResponse = $response->json();
            
            // Record the vote in our database
            UserStationVote::create([
                'user_id' => $userId,
                'station_uuid' => $stationuuid,
                'ip_address' => $ipAddress,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vote submitted successfully!',
                'api_response' => $apiResponse
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to vote for station: " . $e->getMessage());
            
            // Still record the vote in our database even if there's a network issue
            try {
                UserStationVote::create([
                    'user_id' => $userId,
                    'station_uuid' => $stationuuid,
                    'ip_address' => $ipAddress,
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Vote recorded locally! (Network error with Radio Browser API)',
                    'api_down' => true
                ]);
            } catch (\Exception $dbError) {
                Log::error("Failed to record vote in database: " . $dbError->getMessage());
                return response()->json(['error' => 'Failed to submit vote'], 500);
            }
        }
    }
}
