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
        
        $offset = 0;
        $limit = 500; // Reduced batch size to use less memory
        $totalProcessed = 0;
        
        do {
            $this->info("Downloading stations {$offset} to " . ($offset + $limit) . " (Memory: " . round(memory_get_usage(true)/1024/1024, 2) . " MB)");
            
            try {
                $response = Http::timeout(30)
                    ->withHeaders([
                        'User-Agent' => 'WAVEFINDER/1.0 (Laravel Radio App)'
                    ])
                    ->get("http://de2.api.radio-browser.info/json/stations", [
                        'offset' => $offset,
                        'limit' => $limit
                    ]);
                
                if (!$response->successful()) {
                    $this->error("API request failed: " . $response->status());
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
                
            } catch (\Exception $e) {
                $this->error("Error downloading stations: " . $e->getMessage());
                break;
            }
            
        } while (count($stations) == $limit);
        
        $this->info("Download complete! Processed {$totalProcessed} stations.");
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
}