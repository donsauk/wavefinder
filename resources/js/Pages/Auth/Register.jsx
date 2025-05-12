import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                        
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={processing}
                                >
                                    Register
                                </button>
                            </div>
                            
                            <div className="text-center mt-4">
                                <Link href={route('login')} className="text-sm text-blue-500 hover:underline">
                                    Already have an account? Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}