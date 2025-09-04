import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
            onError: (errors) => {
                if (errors.password) {
                    document.querySelector('input[name="password"]')?.focus();
                }
            }
        });
    };

    return (
        <>
            <Head title="Reset Password - WAVEFINDER" />
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
                            <p className="text-base-content/70 mt-2">Choose a new password</p>
                        </div>

                        {/* Reset Password Form */}
                        <div className="card bg-base-200 shadow-xl w-full border border-primary/20">
                            <div className="card-body">
                                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                                
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Hidden email field for Laravel's security verification */}
                                    <input type="hidden" name="email" value={data.email} />

                                    {/* Password */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">New Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className={`input w-full ${errors.password ? 'input-error' : ''}`}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        {errors.password && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.password}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Password Confirmation */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Confirm Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`input w-full ${errors.password_confirmation ? 'input-error' : ''}`}
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
                                            {processing ? 'Resetting...' : 'Reset Password'}
                                        </button>
                                    </div>
                                </form>

                                {/* Back to Login Link */}
                                <div className="text-center mt-4">
                                    <Link href={route('login')} className="link link-primary">
                                        Back to Login
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
