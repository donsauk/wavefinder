<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Promote a user to moderator by email
Artisan::command('user:make-moderator {email}', function (string $email) {
    $user = User::where('email', $email)->first();

    if (!$user) {
        $this->error("User with email {$email} not found.");
        return 1;
    }

    $user->isModerator = true;
    $user->save();

    $this->info("User '{$user->name}' ({$user->email}) is now a moderator.");
})->purpose('Promote a user to moderator by email');
