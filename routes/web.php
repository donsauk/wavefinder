<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\RadioStation;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrowseController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ListeningSessionController;
use App\Http\Controllers\ModerationController;
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

// Chat routes
Route::get('/api/chat/{stationUuid}/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
Route::middleware('auth')->post('/chat/messages', [ChatController::class, 'store'])->name('chat.store');

// Listening session routes (time tracking)
Route::middleware('auth')->group(function () {
    Route::post('/api/listening/start', [ListeningSessionController::class, 'start'])->name('listening.start');
    Route::post('/api/listening/stop', [ListeningSessionController::class, 'stop'])->name('listening.stop');
    Route::post('/api/listening/heartbeat', [ListeningSessionController::class, 'heartbeat'])->name('listening.heartbeat');
    Route::get('/api/listening/stats', [ListeningSessionController::class, 'getStats'])->name('listening.stats');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:8,1');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    
    // Password Reset Routes
    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email')->middleware('throttle:5,1');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update')->middleware('throttle:5,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');
    Route::post('/profile/avatar', [UserController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::get('/settings', [UserController::class, 'settings'])->name('settings');
    Route::post('/settings/password', [UserController::class, 'updatePassword'])->name('settings.password.update');
    
    // Favorites routes
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    
    // Moderation routes (moderators only)
    Route::middleware('moderator')->group(function () {
        Route::delete('/moderation/comments/{comment}', [ModerationController::class, 'deleteComment'])->name('moderation.comments.delete');
        Route::delete('/moderation/chat/{chatMessage}', [ModerationController::class, 'deleteChatMessage'])->name('moderation.chat.delete');
        Route::post('/moderation/users/{user}/mute', [ModerationController::class, 'muteUser'])->name('moderation.users.mute');
        Route::post('/moderation/users/{user}/unmute', [ModerationController::class, 'unmuteUser'])->name('moderation.users.unmute');
    });
});