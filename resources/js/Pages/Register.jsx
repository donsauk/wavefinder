import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    
    // Use form remembering with unique key for state persistence
    const { data, setData, post, processing, errors, reset } = useForm('RegisterForm', {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Enhanced form submission with latest Inertia.js patterns
    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('password', 'password_confirmation'); // Clear sensitive data on success
            },
            onError: (errors) => {
                // Focus first error field for better UX
                if (errors.name) {
                    document.querySelector('input[name="name"]')?.focus();
                } else if (errors.email) {
                    document.querySelector('input[type="email"]')?.focus();
                } else if (errors.password) {
                    document.querySelector('input[name="password"]')?.focus();
                } else if (errors.password_confirmation) {
                    document.querySelector('input[name="password_confirmation"]')?.focus();
                }
            }
        });
    };

    return (
        <>
            <Head title="Register - WAVEFINDER" />
            <div className="h-screen w-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center px-4 overflow-hidden fixed inset-0">
                {/* Decorative blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 -right-32 w-64 h-64 bg-secondary opacity-15 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent opacity-10 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full w-full">
                    <div className="w-full max-w-sm px-4">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href={route('home')} className="text-4xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            WAVEFINDER
                        </Link>
                        <p className="text-base-content/70 mt-2">Join the radio wave community</p>
                    </div>

                    {/* Register Form */}
                    <div className="card bg-base-200 shadow-xl w-full border border-primary/20">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                            
                            <form onSubmit={submit} className="space-y-4">
                                {/* Name */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Name</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.name}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.email}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.password}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Confirm Password</span>
                                    </label>
                                    <input
                                        name="password_confirmation"
                                        type="password"
                                        className={`input input-bordered w-full ${errors.password_confirmation ? 'input-error' : ''}`}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.password_confirmation}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="form-control mt-6 w-full">
                                    <button
                                        className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating Account...' : 'Register'}
                                    </button>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="text-center mt-4">
                                <span className="text-base-content/70">Already have an account? </span>
                                <Link href={route('login')} className="link link-primary">
                                    Login here
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
