<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class MigrateAndSeed extends Command
{
    protected $signature = 'app:migrate-and-seed';

    protected $description = 'Run migrate:fresh, retrieve API servers, and update radio stations';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Running migrate:fresh...');
        $output = Artisan::call('migrate:fresh');
        $this->info(Artisan::output());

        $this->info('Running app:retrieve-api-servers...');
        $output = Artisan::call('app:retrieve-api-servers');
        $this->info(Artisan::output());

        $this->info('Running app:update-radio-stations...');
        $output = Artisan::call('app:update-radio-stations');
        $this->info(Artisan::output());

        $this->info('Migration and seeding completed.');
    }
}
