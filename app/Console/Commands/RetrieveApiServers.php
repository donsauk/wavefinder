<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class RetrieveApiServers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:retrieve-api-servers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Retrieve all available Radio Browser API servers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Perform DNS lookup to get the list of servers
        $servers = dns_get_record('all.api.radio-browser.info', DNS_A);

        // Check if any DNS records were found
        if (! $servers) {
            $this->error('No DNS servers found for all.api.radio-browser.info');

            return 1;
        }

        // Perform reverse DNS lookup to get hostnames
        $serverNames = [];
        foreach ($servers as $server) {
            if (isset($server['ip'])) {
                $hostname = gethostbyaddr($server['ip']);
                $serverNames[] = $hostname;
            }
        }

        // Check if any server names were found
        if (empty($serverNames)) {
            $this->error('No servers found');

            return 1;
        } else {
            // Print the list of server names
            $this->info('Sucessfully fetched Radio Browser API servers:');
            foreach ($serverNames as $server) {
                $this->line($server);
            }

            // Delete old entries related to radio servers
            Setting::where('key', 'like', 'radio.%')->delete();

            // Save the main server and backups in the settings table
            Setting::updateOrCreate(
                ['key' => 'radio.main_server'],
                ['value' => $serverNames[0]]
            );

            Setting::updateOrCreate(
                ['key' => 'radio.backup_server_1'],
                ['value' => $serverNames[1] ?? null]
            );

            Setting::updateOrCreate(
                ['key' => 'radio.backup_server_2'],
                ['value' => $serverNames[2] ?? null]
            );

            return 0;
        }
    }
}
