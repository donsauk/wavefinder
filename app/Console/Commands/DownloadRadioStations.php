<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\RadioStation;

class DownloadRadioStations extends Command
{
    protected $signature = 'radio:download';
    protected $description = 'Download all radio stations from radio-browser.info API';

    public function handle()
    {
        $this->info('Starting radio stations download...');
        
        $servers = $this->discoverApiServers();
        if (empty($servers)) {
            $this->error('No available API servers found. Using fallback server.');
            $servers = ['de2.api.radio-browser.info'];
        }
        
        $this->info('Available servers: ' . implode(', ', $servers));
        
        $offset = 0;
        $limit = 500;
        $totalProcessed = 0;
        
        // Reset sync flag for all stations before starting
        $this->info('Resetting sync flags...');
        DB::table('radio_stations')->update(['seen_in_current_sync' => false]);
        
        do {
            $this->info("Downloading stations {$offset} to " . ($offset + $limit) . " (Memory: " . round(memory_get_usage(true)/1024/1024, 2) . " MB)");
            
            $response = null;
            $lastException = null;
            
            foreach ($servers as $server) {
                try {
                    $this->line("Trying server: {$server}");
                    $response = Http::timeout(30)
                        ->withOptions(['verify' => false])
                        ->withHeaders([
                            'User-Agent' => 'WAVEFINDER/1.0 (Laravel Radio App)'
                        ])
                        ->get("https://{$server}/json/stations", [
                            'offset' => $offset,
                            'limit' => $limit
                        ]);
                    
                    if ($response->successful()) {
                        break;
                    }
                } catch (\Exception $e) {
                    $lastException = $e;
                    $this->warn("Server {$server} failed: " . $e->getMessage());
                    continue;
                }
            }
            
            if (!$response || !$response->successful()) {
                $this->error("All servers failed. Last error: " . ($lastException ? $lastException->getMessage() : 'Unknown error'));
                break;
            }
            
            $stations = $response->json();
            
            if (empty($stations)) {
                $this->info('No more stations to download.');
                break;
            }
            
            $this->processStations($stations);
            $totalProcessed += count($stations);
            
            $offset += $limit;
            
            // Small delay to be nice to the API
            sleep(0.2);
            
        } while (count($stations) == $limit);
        
        // Delete stations that were not seen in this sync (no longer in API)
        $this->info('Cleaning up stations no longer in API...');
        $deletedCount = RadioStation::where('seen_in_current_sync', false)->delete();
        
        $this->info("Download complete! Processed {$totalProcessed} stations, deleted {$deletedCount} removed stations.");
    }
    
    private function processStations($stations)
    {
        foreach ($stations as $station) {
            try {
                RadioStation::updateOrCreate(
                    ['stationuuid' => $station['stationuuid']],
                    [
                        'changeuuid' => $station['changeuuid'] ?? null,
                        'name' => $station['name'] ?? null,
                        'url' => $station['url'] ?? null,
                        'url_resolved' => $station['url_resolved'] ?? null,
                        'homepage' => $station['homepage'] ?? null,
                        'favicon' => $station['favicon'] ?? null,
                        'tags' => $station['tags'] ?? null,
                        'country' => $station['country'] ?? null,
                        'countrycode' => $station['countrycode'] ?? null,
                        'iso_3166_2' => $station['iso_3166_2'] ?? null,
                        'state' => $station['state'] ?? null,
                        'language' => $station['language'] ?? null,
                        'languagecodes' => $station['languagecodes'] ?? null,
                        'votes' => $station['votes'] ?? 0,
                        'lastchangetime' => $station['lastchangetime'] ?? null,
                        'lastchangetime_iso8601' => $station['lastchangetime_iso8601'] ?? null,
                        'codec' => $station['codec'] ?? null,
                        'bitrate' => $station['bitrate'] ?? 0,
                        'hls' => $station['hls'] ?? 0,
                        'lastcheckok' => $station['lastcheckok'] ?? 0,
                        'lastchecktime' => $station['lastchecktime'] ?? null,
                        'lastchecktime_iso8601' => $station['lastchecktime_iso8601'] ?? null,
                        'lastcheckoktime' => $station['lastcheckoktime'] ?? null,
                        'lastcheckoktime_iso8601' => $station['lastcheckoktime_iso8601'] ?? null,
                        'lastlocalchecktime' => $station['lastlocalchecktime'] ?? null,
                        'lastlocalchecktime_iso8601' => $station['lastlocalchecktime_iso8601'] ?? null,
                        'clicktimestamp' => $station['clicktimestamp'] ?? null,
                        'clicktimestamp_iso8601' => $station['clicktimestamp_iso8601'] ?? null,
                        'clickcount' => $station['clickcount'] ?? 0,
                        'clicktrend' => $station['clicktrend'] ?? 0,
                        'ssl_error' => $station['ssl_error'] ?? 0,
                        'geo_lat' => $station['geo_lat'] ?? null,
                        'geo_long' => $station['geo_long'] ?? null,
                        'geo_distance' => $station['geo_distance'] ?? null,
                        'has_extended_info' => $station['has_extended_info'] ?? 0,
                        'seen_in_current_sync' => true,
                    ]
                );
            } catch (\Exception $e) {
                $this->error("Error processing station {$station['name']}: " . $e->getMessage());
            }
        }
        
        // Clear memory after each batch
        unset($stations);
        gc_collect_cycles();
    }
    
    private function discoverApiServers()
    {
        $this->info('Discovering available API servers...');
        
        try {
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->withHeaders([
                    'User-Agent' => 'WAVEFINDER/1.0 (Laravel Radio App)'
                ])
                ->get('http://all.api.radio-browser.info/json/servers');
            
            if (!$response->successful()) {
                $this->warn('Failed to fetch server list from all.api.radio-browser.info');
                return [];
            }
            
            $serverList = $response->json();
            $servers = collect($serverList)->pluck('name')->toArray();
            
            $this->info('Found ' . count($servers) . ' API servers');
            
            return $servers;
            
        } catch (\Exception $e) {
            $this->warn('Server discovery failed: ' . $e->getMessage());
            return [];
        }
    }
}