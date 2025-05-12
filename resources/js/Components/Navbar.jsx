import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Navbar() {
	const { auth } = usePage().props;

	const handleLogout = () => {
		router.post(route("logout"));
	};

	return (
		<div className="navbar bg-base-100 shadow-sm">
			<div className="navbar-start">
				<div className="dropdown">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
						<li>
							<a>Item 1</a>
						</li>
						<li>
							<a>Parent</a>
							<ul className="p-2">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu 2</a>
								</li>
							</ul>
						</li>
						<li>
							<a>Item 3</a>
						</li>
					</ul>
				</div>
				<Link href={route("home")} className="btn btn-ghost text-xl">
					Wavefinder
				</Link>
			</div>
			<div className="navbar-center hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<a>Item 1</a>
					</li>
					<li>
						<details>
							<summary>Parent</summary>
							<ul className="p-2">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu 2</a>
								</li>
							</ul>
						</details>
					</li>
					<li>
						<a>Item 3</a>
					</li>
				</ul>
			</div>
			<div className="navbar-end gap-2">
				{auth.user ? (
					<>
						<span className="text-sm font-medium mr-2">
							Hi, {auth.user.name}
						</span>
						<button
							onClick={handleLogout}
							className="btn btn-outline">
							Logout
						</button>
					</>
				) : (
					<>
						<Link
							href={route("register")}
							className="btn btn-outline">
							Register
						</Link>
						<Link href={route("login")} className="btn btn-primary">
							Login
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
