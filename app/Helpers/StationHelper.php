<?php

namespace App\Helpers;

class StationHelper
{
    /**
     * Clean station data by converting empty strings to null for datetime fields
     * and ensuring certain fields do not exceed 2048 characters.
     */
    public static function cleanStationData(array $stationData): ?array
    {
        $datetimeFields = [
            'lastchangetime',
            'lastchecktime',
            'lastcheckoktime',
            'lastlocalchecktime',
            'clicktimestamp',
        ];

        $maxLengthFields = [
            'url' => 2048, // Maximum URL length allowed
            'url_resolved' => 2048,
            'homepage' => 2048,
            'favicon' => 2048,
            'name' => 2048,
            'tags' => 2048,
            'country' => 2048,
            'language' => 2048,
        ];

        // Check if any maxLengthField exceeds the limit, then skip the station
        foreach ($maxLengthFields as $field => $maxLength) {
            if (isset($stationData[$field]) && strlen($stationData[$field]) > $maxLength) {
                return null; // Skip the station by returning null
            }
        }

        // Clean datetime fields by converting empty strings to null
        foreach ($datetimeFields as $field) {
            if (isset($stationData[$field]) && $stationData[$field] === '') {
                $stationData[$field] = null;
            }
        }

        // Return cleaned station data
        return $stationData;
    }
}
