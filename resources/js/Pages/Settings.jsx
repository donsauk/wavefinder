import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import Navbar from '../Components/Navbar'

export default function Settings({ user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const [activeTab, setActiveTab] = useState('profile')

    const updateProfile = (e) => {
        e.preventDefault()
        put('/profile/update', {
            onSuccess: () => {
                // Profile updated successfully
            }
        })
    }

    const updatePassword = (e) => {
        e.preventDefault()
        put('/password/update', {
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation')
            }
        })
    }

    return (
        <>
            <Head title="Settings - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area - Takes remaining space, with bottom padding for audio player */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="space-y-6">
                            {/* Settings Header */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h1 className="text-3xl font-bold">Settings</h1>
                                    <p className="text-base-content/70">Manage your account settings and preferences</p>
                                </div>
                            </div>

                            {/* Settings Tabs */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <div className="tabs tabs-lifted">
                                        <button 
                                            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                                            onClick={() => setActiveTab('profile')}
                                        >
                                            Profile
                                        </button>
                                        <button 
                                            className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
                                            onClick={() => setActiveTab('security')}
                                        >
                                            Security
                                        </button>
                                        <button 
                                            className={`tab ${activeTab === 'preferences' ? 'tab-active' : ''}`}
                                            onClick={() => setActiveTab('preferences')}
                                        >
                                            Preferences
                                        </button>
                                    </div>

                                    <div className="mt-6">
                                        {/* Profile Tab */}
                                        {activeTab === 'profile' && (
                                            <form onSubmit={updateProfile} className="space-y-4">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">Name</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input input-bordered w-full"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                        required
                                                    />
                                                    {errors.name && <span className="text-error text-sm">{errors.name}</span>}
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">Email</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="input input-bordered w-full"
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        required
                                                    />
                                                    {errors.email && <span className="text-error text-sm">{errors.email}</span>}
                                                </div>

                                                <div className="form-control mt-6">
                                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                                        {processing ? 'Updating...' : 'Update Profile'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {/* Security Tab */}
                                        {activeTab === 'security' && (
                                            <form onSubmit={updatePassword} className="space-y-4">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">Current Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input input-bordered w-full"
                                                        value={data.current_password}
                                                        onChange={e => setData('current_password', e.target.value)}
                                                        required
                                                    />
                                                    {errors.current_password && <span className="text-error text-sm">{errors.current_password}</span>}
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">New Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input input-bordered w-full"
                                                        value={data.password}
                                                        onChange={e => setData('password', e.target.value)}
                                                        required
                                                    />
                                                    {errors.password && <span className="text-error text-sm">{errors.password}</span>}
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">Confirm New Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input input-bordered w-full"
                                                        value={data.password_confirmation}
                                                        onChange={e => setData('password_confirmation', e.target.value)}
                                                        required
                                                    />
                                                    {errors.password_confirmation && <span className="text-error text-sm">{errors.password_confirmation}</span>}
                                                </div>

                                                <div className="form-control mt-6">
                                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                                        {processing ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {/* Preferences Tab */}
                                        {activeTab === 'preferences' && (
                                            <div className="space-y-6">
                                                {/* Audio Preferences */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Audio Preferences</h3>
                                                    
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Audio Normalization</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Automatically normalize volume levels across stations</span>
                                                        </div>
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Slow Playback Mode</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Reduce playback speed for accessibility</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Display Preferences */}
                                                <div className="divider"></div>
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Display Preferences</h3>
                                                    
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Show Station Icons</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Display station logos and favicon images</span>
                                                        </div>
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Stats for Nerds</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Show detailed technical information about stations</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Privacy Preferences */}
                                                <div className="divider"></div>
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Privacy</h3>
                                                    
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Track Listening Statistics</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Allow tracking of listening time and station preferences</span>
                                                        </div>
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label cursor-pointer">
                                                            <span className="label-text">Public Profile</span>
                                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                                        </label>
                                                        <div className="label">
                                                            <span className="label-text-alt text-base-content/60">Make your profile visible to other users</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="alert alert-info">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>Preference settings will be implemented in future updates</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}