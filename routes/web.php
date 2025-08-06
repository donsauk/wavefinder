<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\RadioStation;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrowseController;
use App\Http\Controllers\StationController;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::get('/browse', [BrowseController::class, 'index'])->name('browse');
Route::get('/station/{stationuuid}', [StationController::class, 'show'])->name('station');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:8,1');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});