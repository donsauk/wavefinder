import React from 'react'
import { Link, useForm, usePage } from '@inertiajs/react'

export default function Navbar() {
    const { auth } = usePage().props;
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    return (
        <div className="navbar bg-base-200 border-b border-base-300 h-16 flex-shrink-0">
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    WAVEFINDER
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href={route('browse')} className="btn btn-ghost">
                            Browse
                        </Link>
                    </li>
                    <li>
                        <a className="btn btn-ghost">Random</a>
                    </li>
                    {auth.user && (
                        <li>
                            <a className="btn btn-ghost">Favorites</a>
                        </li>
                    )}
                </ul>
            </div>
            
            <div className="navbar-end">
                {auth.user ? (
                    // Logged in user
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="avatar">
                                <div className="w-10 rounded-full bg-primary">
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <span className="text-sm font-bold">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <div className="px-4 py-2 text-sm text-base-content/70 border-b border-base-300">
                                    {auth.user.name}
                                </div>
                            </li>
                            <li><a>Profile</a></li>
                            <li><a>Settings</a></li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    // Guest user
                    <div className="flex gap-2">
                        <Link href={route('login')} className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link href={route('register')} className="btn btn-primary btn-sm">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}