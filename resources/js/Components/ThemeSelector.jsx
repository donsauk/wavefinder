import React, { useState, useEffect } from 'react'

const THEMES = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave',
    'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua',
    'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula',
    'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
    'dim', 'nord', 'sunset', 'abyss', 'caramellatte', 'silk'
];

export default function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setCurrentTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const changeTheme = (theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-accent btn-sm">
                Theme
            </div>
            <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] w-96 p-3 shadow">
                <div className="grid grid-cols-2 gap-1 max-h-80 overflow-y-auto">
                    {THEMES.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => changeTheme(theme)}
                            className="btn btn-sm btn-ghost justify-start capitalize"
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}