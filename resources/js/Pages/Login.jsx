import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    
    // Use form remembering with unique key for state persistence
    const { data, setData, post, processing, errors, reset } = useForm('LoginForm', {
        email: '',
        password: '',
        remember: false,
    });

    // Enhanced form submission with latest Inertia.js patterns
    const submit = (e) => {
        e.preventDefault();
        // Using global route() function from @routes directive
        post(route('login'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('password'); // Clear sensitive data on success
            },
            onError: (errors) => {
                // Focus first error field for better UX
                if (errors.email) {
                    document.querySelector('input[type="email"]')?.focus();
                } else if (errors.password) {
                    document.querySelector('input[type="password"]')?.focus();
                }
            }
        });
    };

    return (
        <>
            <Head title="Login - WAVEFINDER" />
            <div className="h-screen w-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center px-4 overflow-hidden fixed inset-0">
                {/* Decorative blobs - same as landing */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 -right-32 w-64 h-64 bg-secondary opacity-15 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent opacity-10 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full w-full">
                    <div className="w-full max-w-sm px-4">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="text-4xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            WAVEFINDER
                        </Link>
                        <p className="text-base-content/70 mt-2">Welcome back to your radio waves</p>
                    </div>

                    {/* Login Form */}
                    <div className="card bg-base-200 shadow-xl w-full border border-primary/20">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                            
                            <form onSubmit={submit} className="space-y-4">
                                {/* Email */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input w-full ${errors.email ? 'input-error' : ''}`}
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
                                        type="password"
                                        className={`input w-full ${errors.password ? 'input-error' : ''}`}
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

                                {/* Remember + Forgot (inline) */}
                                <div className="flex items-center justify-between w-full mt-1">
                                    <label className="label cursor-pointer justify-start gap-3 p-0">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="label-text">Remember me</span>
                                    </label>
                                    <Link href={route('password.request')} className="link link-primary text-sm">
                                        Forgot your password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <div className="form-control mt-6 w-full">
                                    <button
                                        className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                        disabled={processing}
                                    >
                                        {processing ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>

                            {/* Register Link */}
                            <div className="text-center mt-4">
                                <span className="text-base-content/70">Don't have an account? </span>
                                <Link href={route('register')} className="link link-primary">
                                    Register here
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
