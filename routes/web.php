<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\RadioStation;
use App\Http\Controllers\AuthController;

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

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});