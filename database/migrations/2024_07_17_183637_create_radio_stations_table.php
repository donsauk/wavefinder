<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('radio_stations', function (Blueprint $table) {
            $table->uuid('stationuuid')->primary();
            $table->uuid('changeuuid')->nullable();
            $table->text('name', 2048); //
            $table->text('url', 2048);
            $table->text('url_resolved', 2048);
            $table->text('homepage', 2048)->nullable();
            $table->text('favicon', 2048)->nullable();
            $table->text('tags', 2048)->nullable(); //
            $table->text('country', 2048)->nullable(); //
            $table->string('countrycode', 2)->nullable();
            $table->string('state')->nullable();
            $table->text('language', 2048)->nullable(); //
            $table->string('languagecodes')->nullable();
            $table->integer('votes')->default(0);
            $table->dateTime('lastchangetime');
            $table->string('codec')->nullable();
            $table->integer('bitrate')->nullable();
            $table->boolean('hls')->default(false);
            $table->boolean('lastcheckok')->default(false);
            $table->dateTime('lastchecktime')->nullable();
            $table->dateTime('lastcheckoktime')->nullable();
            $table->dateTime('lastlocalchecktime')->nullable();
            $table->dateTime('clicktimestamp')->nullable();
            $table->integer('clickcount')->default(0);
            $table->integer('clicktrend')->default(0);
            $table->integer('ssl_error')->default(0);
            $table->double('geo_lat')->nullable();
            $table->double('geo_long')->nullable();
            $table->boolean('has_extended_info')->default(false);
            $table->string('slug', 250)->nullable()->unique(); // Slug is nullable and unique
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('radio_stations');
    }
};
