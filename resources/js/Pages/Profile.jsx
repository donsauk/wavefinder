import React, { useRef, useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Components/Navbar'
import ListeningStats from '../Components/ListeningStats'

export default function Profile({ user }) {
    const { flash, errors } = usePage().props
    const fileInputRef = useRef(null)
    const [processing, setProcessing] = useState(false)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProcessing(true)
            
            // Create FormData and submit using router.post
            const formData = new FormData()
            formData.append('avatar', file)
            
            router.post(route('profile.avatar.update'), formData, {
                onSuccess: () => {
                    setProcessing(false)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                },
                onError: () => {
                    setProcessing(false)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                },
                onFinish: () => {
                    setProcessing(false)
                }
            })
        }
    }

    return (
        <>
            <Head title="Profile - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="alert alert-success">
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="alert alert-error">
                                <span>{flash.error}</span>
                            </div>
                        )}
                        {errors?.avatar && (
                            <div className="alert alert-error">
                                <span>{errors.avatar}</span>
                            </div>
                        )}
                        {/* User Profile Card */}
                        <div className="card bg-base-200 border border-primary/20">
                            <div className="card-body">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div 
                                            className="avatar cursor-pointer transition-all duration-200 hover:opacity-75"
                                            onClick={handleAvatarClick}
                                            title="Click to change avatar"
                                        >
                                            <div className="w-24 rounded-full bg-primary relative overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img 
                                                        src={user.avatar_url} 
                                                        alt={`${user.name}'s avatar`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white">
                                                        <span className="text-3xl font-bold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {processing && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                            </div>
                                        )}
                                        
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl font-bold">{user.name}</h1>
                                            <div className="badge badge-primary badge-lg">
                                                Level {user.level || 1}
                                            </div>
                                        </div>
                                        <p className="text-base-content/70">{user.email}</p>
                                        <p className="text-sm text-base-content/50">
                                            Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        
                                        {/* XP Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-base-content/70 mb-1">
                                                {(user.level || 1) < 99 && (
                                                    <span>{user.xp_to_next_level || 0} XP to level {(user.level || 1) + 1}</span>
                                                )}
                                            </div>
                                            {(user.level || 1) < 99 ? (
                                                <progress 
                                                    className="progress progress-primary w-full" 
                                                    value={user.xp_progress_percent || 0} 
                                                    max="100"
                                                ></progress>
                                            ) : (
                                                <div className="badge badge-accent">Max Level!</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Listening Stats Card */}
                        <ListeningStats />
                    </div>
                </div>
            </div>
        </>
    )
}
