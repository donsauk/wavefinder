<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\RadioStation;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrowseController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/browse', [BrowseController::class, 'index'])->name('browse');
Route::get('/random', [StationController::class, 'random'])->name('random');
Route::get('/station/{stationuuid}', [StationController::class, 'show'])->name('station');

// Station interaction routes
Route::post('/station/{stationuuid}/click', [StationController::class, 'click'])->name('station.click');
Route::post('/station/{stationuuid}/vote', [StationController::class, 'vote'])->name('station.vote');

// Comment routes - public read access, authenticated write/delete access
Route::get('/station/{stationuuid}/comments', [CommentController::class, 'index'])->name('comments.index');
Route::middleware('auth')->group(function () {
    Route::post('/station/{stationuuid}/comments', [CommentController::class, 'store'])->name('station.comments.store');
    Route::delete('/station/{stationuuid}/comments/{comment}', [CommentController::class, 'destroy'])->name('station.comments.destroy');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:8,1');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');
    Route::get('/settings', [UserController::class, 'settings'])->name('settings');
    
    // Favorites routes
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
});