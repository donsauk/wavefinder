import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Navbar from '../Components/Navbar'

export default function Settings({ user, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const handlePasswordReset = (e) => {
        e.preventDefault()
        post(route('settings.password.update'), {
            onSuccess: () => {
                reset()
            },
            preserveScroll: true
        })
    }

    return (
        <>
            <Head title="Settings - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-lg mx-auto p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Settings</h1>
                            <p className="text-base-content/70">Manage your account preferences</p>
                        </div>

                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="alert alert-success mb-6">
                                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="alert alert-error mb-6">
                                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{flash.error}</span>
                            </div>
                        )}

                        {/* Account Information */}
                        <div className="card bg-base-200 shadow-xl mb-6">
                            <div className="card-body py-4">
                                <h2 className="text-lg font-bold text-center mb-4">Account Information</h2>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Name:</span>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Email:</span>
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Member since:</span>
                                        <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="card bg-base-200 shadow-xl mb-6">
                            <div className="card-body">
                                <h2 className="text-xl font-bold text-center mb-6">Change Password</h2>
                                
                                <form onSubmit={handlePasswordReset} className="space-y-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Current Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`input input-bordered w-full ${errors.current_password ? 'input-error' : ''}`}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            required
                                        />
                                        {errors.current_password && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.current_password}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">New Password</span>
                                        </label>
                                        <input
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

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Confirm New Password</span>
                                        </label>
                                        <input
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

                                    <div className="form-control mt-6 w-full">
                                        <button
                                            className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                            disabled={processing}
                                        >
                                            {processing ? 'Updating Password...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Future sections placeholder */}
                        <div className="card bg-base-200 shadow-xl opacity-50">
                            <div className="card-body">
                                <h2 className="text-xl font-bold text-center mb-4">Preferences</h2>
                                <p className="text-center text-base-content/50">Additional settings coming soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}