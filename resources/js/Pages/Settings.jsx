import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import FlashMessage from '../Components/FlashMessage'
import FormField from '../Components/FormField'

export default function Settings({ user }) {
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

                        <div className="mb-2">
                          <FlashMessage />
                        </div>

                        {/* Account Information */}
                        <div className="card bg-base-200 shadow-xl mb-6 border border-primary/20">
                            <div className="card-body py-4">
                                <h2 className="text-lg font-bold text-center mb-4">Account Information</h2>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Username:</span>
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
                        <div className="card bg-base-200 shadow-xl mb-6 border border-primary/20">
                            <div className="card-body">
                                <h2 className="text-xl font-bold text-center mb-6">Change Password</h2>
                                
                                <form onSubmit={handlePasswordReset} className="space-y-4">
                                    <FormField
                                      label="Current Password"
                                      type="password"
                                      name="current_password"
                                      value={data.current_password}
                                      onChange={(e) => setData('current_password', e.target.value)}
                                      error={errors.current_password}
                                      required
                                    />

                                    <FormField
                                      label="New Password"
                                      type="password"
                                      name="password"
                                      value={data.password}
                                      onChange={(e) => setData('password', e.target.value)}
                                      error={errors.password}
                                      required
                                    />

                                    <FormField
                                      label="Confirm New Password"
                                      type="password"
                                      name="password_confirmation"
                                      value={data.password_confirmation}
                                      onChange={(e) => setData('password_confirmation', e.target.value)}
                                      error={errors.password_confirmation}
                                      required
                                    />

                                    <div className="form-control mt-6 w-full">
                                        <button className="btn btn-primary w-full" disabled={processing}>
                                            {processing ? 'Updating Password...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
