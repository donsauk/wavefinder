<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RadioStation extends Model
{
    use HasFactory;

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
        'state',
        'language',
        'languagecodes',
        'votes',
        'lastchangetime',
        'codec',
        'bitrate',
        'hls',
        'lastcheckok',
        'lastchecktime',
        'lastcheckoktime',
        'lastlocalchecktime',
        'clicktimestamp',
        'clickcount',
        'clicktrend',
        'ssl_error',
        'geo_lat',
        'geo_long',
        'has_extended_info',
        'slug',
    ];

    protected $primaryKey = 'stationuuid'; // Assuming 'stationuuid' is the primary key

    public $incrementing = false; // Assuming 'stationuuid' is not auto-incrementing

    protected $keyType = 'string'; // Assuming 'stationuuid' is of type string

    protected $casts = [
        'hls' => 'boolean', // Cast 'hls' field to boolean
        'lastcheckok' => 'boolean', // Cast 'lastcheckok' field to boolean
        'has_extended_info' => 'boolean', // Cast 'has_extended_info' field to boolean
    ];

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'onUpdate' => true,
                'separator' => '-',
            ],
        ];
    }
}
