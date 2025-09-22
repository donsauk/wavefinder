import React from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import ThemeSelector from './ThemeSelector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faUser, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
    const { auth } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'), { }, { preserveScroll: true });
    };

    return (
        <div className="navbar bg-base-200 border-b border-primary/20">
            <div className="navbar-start">
                <Link href={route('browse')} className="btn btn-ghost text-xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    WAVEFINDER
                </Link>
            </div>
            
            <div className="navbar-center flex">
                <ul className="menu menu-horizontal px-1 gap-1 sm:gap-2">
                    <li>
                        <Link href={route('browse')} className="btn btn-primary btn-xs sm:btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 3h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm10 0h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM5 13h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm10 0h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM7 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM7 15.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8.5 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm1.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                            </svg>
                            <span className="hidden sm:inline">Browse</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={route('random')} className="btn btn-primary btn-xs sm:btn-sm gap-2">
                            <FontAwesomeIcon icon={faDice} className="w-4 h-4" />
                            <span className="hidden sm:inline">Random</span>
                        </Link>
                    </li>
                </ul>
            </div>
            
            <div className="navbar-end">
                <ThemeSelector />
                {auth.user ? (
                    <div className="dropdown dropdown-end ml-2">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                            <div className="w-10 rounded-full bg-primary text-primary-content">
                                {auth.user.avatar_url ? (
                                    <img src={auth.user.avatar_url} alt={`${auth.user.name}'s avatar`} />
                                ) : (
                                    <span className="text-sm font-bold">{auth.user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <div tabIndex={0} className="dropdown-content z-[1] mt-3 w-48 p-3 bg-base-200 border border-primary/20 rounded-box shadow-xl">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={route('profile')}
                                    className="btn btn-outline btn-sm w-full justify-start gap-2 hover:bg-base-200/80 hover:border-current"
                                >
                                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link
                                    href={route('settings')}
                                    className="btn btn-outline btn-sm w-full justify-start gap-2 hover:bg-base-200/80 hover:border-current"
                                >
                                    <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
                                    Settings
                                </Link>
                                <button onClick={handleLogout} className="btn btn-error btn-sm w-full justify-start gap-2">
                                    <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Guest user
                    <div className="flex gap-1 sm:gap-2 ml-2">
                        <Link href={route('login')} className="btn btn-ghost btn-xs sm:btn-sm">
                            Login
                        </Link>
                        <Link href={route('register')} className="btn btn-primary btn-xs sm:btn-sm">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
