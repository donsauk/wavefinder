import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

const THEMES = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave',
    'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua',
    'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula',
    'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
    'dim', 'nord', 'sunset', 'abyss', 'caramellatte', 'silk'
];

export default function ThemeSelector() {
    // Initialize with saved theme or default to dark for first-time users
    const [currentTheme, setCurrentTheme] = useState(() => {
        try {
            return (
                localStorage.getItem('theme') ||
                (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) ||
                'dark'
            );
        } catch (_) {
            return 'dark';
        }
    });

    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setCurrentTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } catch (_) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const changeTheme = (theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-accent btn-sm gap-2">
                <FontAwesomeIcon
                    icon={/(dark|night|dracula|black|dim|forest|business|coffee|abyss|nord)/i.test(currentTheme) ? faMoon : faSun}
                    className="w-4 h-4"
                />
                Theme
            </div>
            <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] w-80 p-3 shadow">
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
