<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RadioStation extends Model
{
    protected $fillable = [
        'changeuuid',
        'stationuuid',
        'name',
        'url',
        'url_resolved',
        'homepage',
        'favicon',
        'tags',
        'country',
        'countrycode',
        'iso_3166_2',
        'state',
        'language',
        'languagecodes',
        'votes',
        'lastchangetime',
        'lastchangetime_iso8601',
        'codec',
        'bitrate',
        'hls',
        'lastcheckok',
        'lastchecktime',
        'lastchecktime_iso8601',
        'lastcheckoktime',
        'lastcheckoktime_iso8601',
        'lastlocalchecktime',
        'lastlocalchecktime_iso8601',
        'clicktimestamp',
        'clicktimestamp_iso8601',
        'clickcount',
        'clicktrend',
        'ssl_error',
        'geo_lat',
        'geo_long',
        'geo_distance',
        'has_extended_info',
    ];

    protected $casts = [
        'hls' => 'boolean',
        'lastcheckok' => 'boolean',
        'ssl_error' => 'boolean',
        'has_extended_info' => 'boolean',
        'votes' => 'integer',
        'bitrate' => 'integer',
        'clickcount' => 'integer',
        'clicktrend' => 'integer',
        'geo_lat' => 'decimal:7',
        'geo_long' => 'decimal:7',
        'geo_distance' => 'decimal:5',
        'lastchangetime' => 'datetime',
        'lastchecktime' => 'datetime',
        'lastcheckoktime' => 'datetime',
        'lastlocalchecktime' => 'datetime',
        'clicktimestamp' => 'datetime',
    ];
}