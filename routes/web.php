<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\RadioStation;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::get('/browse', function () {
    $stations = RadioStation::where('lastcheckok', true)
        ->orderBy('votes', 'desc')
        ->paginate(12);
    
    return Inertia::render('Browse', [
        'stations' => $stations
    ]);
})->name('browse');