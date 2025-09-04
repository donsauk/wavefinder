export default function XPStats({ user }) {
    if (!user) return null;

    const currentLevel = user.level || 1;
    const currentXP = user.xp || 0;
    const xpToNextLevel = user.xpToNextLevel || 0;
    const progressPercent = user.progressPercent || 0;
    const totalListeningHours = user.totalListeningHours || 0;
    
    // Format listening time as hours and minutes
    const formatListeningTime = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        
        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    };

    return (
        <div className="card bg-base-100 shadow-lg border w-full max-w-sm">
            <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-title text-lg">Level {currentLevel}</h3>
                    <div className="badge badge-primary badge-lg">{currentXP.toLocaleString()} XP</div>
                </div>
                
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progress to Level {currentLevel + 1}</span>
                        <span>{xpToNextLevel.toLocaleString()} XP needed</span>
                    </div>
                    <progress 
                        className="progress progress-primary w-full" 
                        value={progressPercent} 
                        max="100"
                    ></progress>
                    <div className="text-xs text-center mt-1 opacity-70">
                        {progressPercent}% complete
                    </div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="opacity-70">Total Listening:</span>
                    <span className="font-semibold">{formatListeningTime(totalListeningHours)}</span>
                </div>
            </div>
        </div>
    );
}
