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

            // Generate and assign a unique slug if it's not already set
            if (empty($radioStation->slug)) {
                $baseSlug = \Illuminate\Support\Str::slug(\Illuminate\Support\Str::ascii($radioStation->name));
                $slug = $baseSlug;
                $counter = 1;

                // Truncate slug to a maximum length of 250 characters
                $maxLength = 250;
                $slug = substr($slug, 0, $maxLength);

                while (RadioStation::where('slug', $slug)->exists()) {
                    $slug = substr($baseSlug.'-'.$counter, 0, $maxLength);
                    $counter++;
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
