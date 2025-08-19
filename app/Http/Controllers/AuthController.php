<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use GeoIp2\Database\Reader;
use GeoIp2\Exception\AddressNotFoundException;
class AuthController extends Controller
{
    public function showLogin() 
    {
        return Inertia::render('Login');
    }

    public function showRegister()
    {
        return Inertia::render('Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            // Detect and store user's country if not already set
            $user = Auth::user();
            if (!$user->country_code) {
                $this->detectAndStoreCountry($request, $user);
            }
            
            return to_route('browse');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);
        
        // Detect and store user's country
        $this->detectAndStoreCountry($request, $user);

        return to_route('browse');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
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
