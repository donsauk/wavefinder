<?php

namespace App\Console\Commands;

use App\Helpers\StationHelper;
use App\Models\RadioStation;
use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UpdateRadioStations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-radio-stations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and update radio stations from radio-browser.info API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Fetch all settings where the key contains 'radio'
        $radioServerSettings = Setting::where('key', 'LIKE', '%radio%')->get();

        if ($radioServerSettings->isNotEmpty()) {
            // Use the first URL from the fetched settings
            $url = 'http://'.$radioServerSettings->first()->value.'/json/stations';

            $response = Http::get($url);

            if ($response->successful()) {
                $stationsFromApi = collect($response->json());
                $totalStations = $stationsFromApi->count();

                $this->info("Fetching and filtering a total of {$totalStations} radio stations.");
                $this->info('Stations successfully downloaded, updating the local database...');
                // Create a new progress bar instance
                $bar = $this->output->createProgressBar($totalStations);
                $bar->start();

                // Get existing stationuuids from database
                $existingStationuuids = RadioStation::pluck('stationuuid')->toArray();

                // Update or create stations from API
                $stationsFromApi->each(function ($stationData) use ($existingStationuuids, $bar) {
                    // Clean station data
                    $stationData = StationHelper::cleanStationData($stationData);

                    // Skip station if cleanStationData returns null
                    if ($stationData === null) {
                        return; // Skip current iteration
                    }

                    // Save station data to database
                    RadioStation::updateOrCreate(
                        ['stationuuid' => $stationData['stationuuid']],
                        $stationData
                    );

                    // Remove stationuuid from existing list
                    if (($key = array_search($stationData['stationuuid'], $existingStationuuids)) !== false) {
                        unset($existingStationuuids[$key]);
                    }

                    // Advance the progress bar
                    $bar->advance();
                });

                // Delete stations that no longer exist in the API response
                if (! empty($existingStationuuids)) {
                    RadioStation::whereIn('stationuuid', $existingStationuuids)->delete();
                }

                // Finish the progress bar
                $bar->finish();
                $totalStationsSaved = RadioStation::count();

                $this->info("\n{$totalStationsSaved} Radio stations successfully fetched, updated, and cleaned up.");
                // rejected stations: $totalStations - $totalStationsSaved
                $rejectedStations = $totalStations - $totalStationsSaved;
                $this->info("Rejected {$rejectedStations} stations due to invalid data.");
            } else {
                $this->error('Failed to fetch radio stations. API responded with error.');
            }
        } else {
            $this->error('No radio API server settings found. Or you have not retried the API servers yet. Run "php artisan app:retrieve-api-servers" to fetch the API servers.');
        }
    }
}
