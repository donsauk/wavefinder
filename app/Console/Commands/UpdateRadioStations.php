<?php

namespace App\Console\Commands;

use App\Helpers\StationHelper;
use App\Models\RadioStation;
use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UpdateRadioStations extends Command
{
    protected $signature = 'app:update-radio-stations';

    protected $description = 'Fetch and update radio stations from radio-browser.info API';

    public function handle()
    {
        $radioServerSettings = Setting::where('key', 'LIKE', '%radio%')->get();

        if ($radioServerSettings->isEmpty()) {
            $this->error('No radio API server settings found.');

            return;
        }

        $url = 'http://'.$radioServerSettings->first()->value.'/json/stations';
        $response = Http::get($url);

        if (! $response->successful()) {
            $this->error('Failed to fetch radio stations. API responded with error.');

            return;
        }

        $stationsFromApi = collect($response->json());

        // Get the max number of stations from the configuration
        $maxStations = config('radio.max_stations');

        if ($stationsFromApi->count() > $maxStations) {
            $stationsFromApi = $stationsFromApi->take($maxStations);
        }

        $this->updateRadioStations($stationsFromApi);
    }

    private function updateRadioStations($stationsFromApi)
    {
        $totalStations = $stationsFromApi->count();
        $this->info("Fetching and filtering a total of {$totalStations} radio stations.");
        $this->info('Stations successfully downloaded, updating the local database...');

        $bar = $this->output->createProgressBar($totalStations);
        $bar->start();

        $existingStationuuids = RadioStation::pluck('stationuuid')->toArray();

        $stationsFromApi->each(function ($stationData) use (&$existingStationuuids, $bar) {
            $stationData = StationHelper::cleanStationData($stationData);

            if ($stationData === null) {
                return;
            }

            $radioStation = RadioStation::updateOrCreate(
                ['stationuuid' => $stationData['stationuuid']],
                $stationData
            );

            if (empty($radioStation->slug)) {
                $baseSlug = \Illuminate\Support\Str::slug(\Illuminate\Support\Str::ascii($radioStation->name));
                $maxLength = 90;

                // Truncate the base slug to fit within the maximum length, allowing room for a unique suffix if needed
                $slug = substr($baseSlug, 0, $maxLength - 8); // Reserve space for a 7-char suffix and a hyphen
                $originalSlug = $slug;
                $counter = 1;

                while (RadioStation::where('slug', $slug)->exists()) {
                    // Append a unique suffix
                    $suffix = '-'.$counter++;
                    $slug = substr($originalSlug, 0, $maxLength - strlen($suffix)).$suffix;

                    // As a last resort, append a unique random string if collisions persist
                    if ($counter > 1000) {
                        $suffix = '-'.\Illuminate\Support\Str::random(5);
                        $slug = substr($originalSlug, 0, $maxLength - strlen($suffix)).$suffix;
                        break;
                    }
                }

                $radioStation->slug = $slug;
                $radioStation->save();
            }

            if (($key = array_search($stationData['stationuuid'], $existingStationuuids)) !== false) {
                unset($existingStationuuids[$key]);
            }

            $bar->advance();
        });

        if (! empty($existingStationuuids)) {
            RadioStation::whereIn('stationuuid', $existingStationuuids)->delete();
        }

        $bar->finish();
        $totalStationsSaved = RadioStation::count();

        $this->info("\n{$totalStationsSaved} Radio stations successfully fetched, updated, and cleaned up.");
        $rejectedStations = $totalStations - $totalStationsSaved;
        $this->info("Rejected {$rejectedStations} stations due to invalid data.");
    }
}
