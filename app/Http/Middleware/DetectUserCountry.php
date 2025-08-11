<?php

namespace App\Http\Middleware;

use Closure;
use GeoIp2\Database\Reader;
use GeoIp2\Exception\AddressNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DetectUserCountry
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if ($user && !$user->country_code) {
            $this->detectAndStoreCountry($request, $user);
        }
        
        return $next($request);
    }
    
    private function detectAndStoreCountry(Request $request, $user): void
    {
        try {
            $ip = $request->ip();
            
            // For localhost testing, hardcode Lithuania
            if ($this->isLocalIp($ip)) {
                $user->update([
                    'country_code' => 'LT',
                    'country_name' => 'Lithuania'
                ]);
                return;
            }
            
            // Use GeoIP2 database for real IP addresses
            $databasePath = storage_path('app/geoip/GeoLite2-Country.mmdb');
            
            if (file_exists($databasePath)) {
                $reader = new Reader($databasePath);
                $record = $reader->country($ip);
                
                $countryCode = $record->country->isoCode;
                $countryName = $record->country->name;
                
                if ($countryCode) {
                    $user->update([
                        'country_code' => $countryCode,
                        'country_name' => $countryName
                    ]);
                }
            }
        } catch (AddressNotFoundException $e) {
            // IP not found in database - skip silently
        } catch (\Exception $e) {
            // Silently fail - country detection is not critical
        }
    }
    
    private function isLocalIp(string $ip): bool
    {
        return in_array($ip, ['127.0.0.1', '::1']) || 
               str_starts_with($ip, '192.168.') || 
               str_starts_with($ip, '10.') ||
               str_starts_with($ip, '172.');
    }
    
}
