<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('radio_stations', function (Blueprint $table) {
            $table->id();
            
            // UUIDs
            $table->string('changeuuid')->nullable();
            $table->string('stationuuid')->unique();
            
            // Basic info
            $table->string('name')->nullable();
            $table->text('url')->nullable();
            $table->text('url_resolved')->nullable();
            $table->text('homepage')->nullable();
            $table->text('favicon')->nullable();
            $table->text('tags')->nullable();
            
            // Location
            $table->string('country')->nullable();
            $table->string('countrycode', 2)->nullable();
            $table->string('iso_3166_2')->nullable();
            $table->string('state')->nullable();
            
            // Language
            $table->text('language')->nullable();
            $table->text('languagecodes')->nullable();
            
            // Stats
            $table->integer('votes')->default(0);
            
            // Timestamps (regular format)
            $table->timestamp('lastchangetime')->nullable();
            $table->timestamp('lastchecktime')->nullable();
            $table->timestamp('lastcheckoktime')->nullable();
            $table->timestamp('lastlocalchecktime')->nullable();
            $table->timestamp('clicktimestamp')->nullable();
            
            // Timestamps (ISO8601 format)
            $table->string('lastchangetime_iso8601')->nullable();
            $table->string('lastchecktime_iso8601')->nullable();
            $table->string('lastcheckoktime_iso8601')->nullable();
            $table->string('lastlocalchecktime_iso8601')->nullable();
            $table->string('clicktimestamp_iso8601')->nullable();
            
            // Stream info
            $table->string('codec')->nullable();
            $table->integer('bitrate')->default(0);
            $table->boolean('hls')->default(false);
            $table->boolean('lastcheckok')->default(false);
            
            // Click stats
            $table->integer('clickcount')->default(0);
            $table->integer('clicktrend')->default(0);
            
            // Technical
            $table->boolean('ssl_error')->default(false);
            
            // Geography
            $table->decimal('geo_lat', 10, 7)->nullable();
            $table->decimal('geo_long', 10, 7)->nullable();
            $table->decimal('geo_distance', 15, 5)->nullable();
            
            // Extended info
            $table->boolean('has_extended_info')->default(false);
            
            $table->timestamps();
            
            // Indexes for common searches
            $table->index('country');
            $table->index('countrycode');
            $table->index('lastcheckok');
            $table->index(['geo_lat', 'geo_long']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('radio_stations');
    }
};