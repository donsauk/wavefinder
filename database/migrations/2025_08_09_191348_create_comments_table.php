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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            // Foreign key to radio_stations table - references the station being commented on
            $table->string('station_uuid')->index();
            // Foreign key to users table - references the user who made the comment
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // The actual comment text content
            $table->text('content');
            $table->timestamps();
            
            // Index for efficient queries by station
            $table->index(['station_uuid', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
