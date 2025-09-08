<?php

return [
    // Time-based retention: delete chat messages older than this many hours
    'retention_hours' => env('CHAT_RETENTION_HOURS', 24),

    // Optional: how many messages to keep per station (used for reads/UI; pruning is time-based)
    'max_per_station' => env('CHAT_MAX_PER_STATION', 200),
];

