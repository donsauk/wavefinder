<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    // Mass assignable attributes for comment creation
    protected $fillable = [
        'station_uuid',
        'user_id', 
        'content',
    ];

    // Relationship: Comment belongs to a User (author of the comment)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
