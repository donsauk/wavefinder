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
        Schema::create('user_station_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('station_uuid')->nullable(); // Radio station UUID
            $table->ipAddress('ip_address'); // Track IP for rate limiting
            $table->timestamps();
            
            // Foreign key constraint - nullify vote when station is deleted (preserve voting history)
            $table->foreign('station_uuid')->references('stationuuid')->on('radio_stations')->onDelete('set null');
            
            // Index for rate limiting queries
            $table->index(['ip_address', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_station_votes');
    }
};
