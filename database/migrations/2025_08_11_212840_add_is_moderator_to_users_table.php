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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('isModerator')->default(false);
            $table->timestamp('muted_until')->nullable();
            $table->foreignId('muted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('mute_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['isModerator', 'muted_until', 'muted_by', 'mute_reason']);
        });
    }
};
