import React from 'react'
import { Link } from '@inertiajs/react'

export default function Navbar() {
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
                    <li>
                        <a className="btn btn-ghost">Favorites</a>
                    </li>
                </ul>
            </div>
            
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                            <span className="text-sm font-bold">U</span>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}