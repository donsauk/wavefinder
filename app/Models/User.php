<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_path',
        'xp',
        'level',
        'country_code',
        'country_name',
        'isModerator',
        'muted_until',
        'muted_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'xp' => 'integer',
            'level' => 'integer',
            'isModerator' => 'boolean',
            'muted_until' => 'datetime',
        ];
    }
    
    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    // Relationship: User has many Comments (comments authored by this user)
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Relationship: User has many listening sessions
    public function listeningSessions()
    {
        return $this->hasMany(ListeningSession::class);
    }

    public function mutedBy()
    {
        return $this->belongsTo(User::class, 'muted_by');
    }

    public function isMuted()
    {
        return $this->muted_until && $this->muted_until > now();
    }

    public function muteUser($hours, $moderatorId)
    {
        $this->muted_until = now()->addHours($hours);
        $this->muted_by = $moderatorId;
        $this->save();
    }

    public function unmute()
    {
        $this->muted_until = null;
        $this->muted_by = null;
        $this->save();
    }

    public function getXpForLevel($level)
    {
        if ($level <= 1) return 0;
        
        $xp = 0;
        for ($i = 1; $i < $level; $i++) {
            $xp += floor($i + 300 * pow(2, $i / 7.0));
        }
        return floor($xp / 4);
    }

    public function getLevelFromXp($xp)
    {
        $level = 1;
        while ($level < 99 && $this->getXpForLevel($level + 1) <= $xp) {
            $level++;
        }
        return $level;
    }

    public function addXp($minutes)
    {
        $xpGained = $minutes;
        $this->xp += $xpGained;
        $this->level = $this->getLevelFromXp($this->xp);
        $this->save();
        
        return $xpGained;
    }

    public function getXpToNextLevel()
    {
        if ($this->level >= 99) return 0;
        
        $currentLevelXp = $this->getXpForLevel($this->level);
        $nextLevelXp = $this->getXpForLevel($this->level + 1);
        
        return $nextLevelXp - $this->xp;
    }

    public function getXpProgressPercent()
    {
        if ($this->level >= 99) return 100;
        
        $currentLevelXp = $this->getXpForLevel($this->level);
        $nextLevelXp = $this->getXpForLevel($this->level + 1);
        $currentProgress = $this->xp - $currentLevelXp;
        $totalNeeded = $nextLevelXp - $currentLevelXp;
        
        if ($totalNeeded <= 0) return 100;
        
        return round(($currentProgress / $totalNeeded) * 100);
    }

    public function getTotalListeningHours()
    {
        return round($this->xp / 60, 1);
    }

    public function getAvatarUrlAttribute()
    {
        if ($this->avatar_path) {
            return config('app.url') . '/storage/' . $this->avatar_path;
        }
        return null;
    }
}
