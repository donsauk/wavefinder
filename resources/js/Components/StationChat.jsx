import React, { useState, useEffect, useRef } from 'react'
import { useForm, router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faWaveSquare, faTrashCan, faVolumeMute, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import MuteUserModal from './MuteUserModal'

export default function StationChat({ stationUuid }) {
    const { auth } = usePage().props
    const [messages, setMessages] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef(null)
    const echoRef = useRef(null)
    const sendingTimeoutRef = useRef(null)
    const pendingMessageRef = useRef(null)

    const { data, setData, post, processing, reset } = useForm({
        station_uuid: stationUuid,
        message: '',
    })

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ 
            behavior: smooth ? "smooth" : "instant" 
        })
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom(!isInitialLoad)
            if (isInitialLoad) {
                setIsInitialLoad(false)
            }
        }
    }, [messages, isInitialLoad])

    useEffect(() => {
        // Fetch initial messages
        fetch(route('chat.messages', stationUuid))
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error('Error fetching messages:', error))

        // Set up WebSocket connection
        if (window.Echo) {
            echoRef.current = window.Echo.channel(`station-chat.${stationUuid}`)
                .listen('MessageSent', (e) => {
                    setMessages(prev => [...prev, {
                        id: e.id,
                        message: e.message,
                        username: e.username,
                        user_id: e.user_id,
                        user: e.user,
                        created_at: e.created_at
                    }])
                    
                    // Clear loading state when our own message appears
                    if (e.user_id === auth.user?.id && pendingMessageRef.current === e.message) {
                        setIsSending(false)
                        pendingMessageRef.current = null
                    }
                })
                .listen('.chat.message.deleted', (e) => {
                    setMessages(prev => prev.filter(msg => msg.id !== e.messageId))
                })

            // Listen for user mute/unmute events on private channel
            if (auth.user) {
                window.Echo.private(`user.${auth.user.id}`)
                    .listen('.user.muted', (e) => {
                        // Reload page immediately when user gets muted
                        window.location.reload()
                    })
                    .listen('.user.unmuted', (e) => {
                        // Reload page immediately when user gets unmuted
                        window.location.reload()
                    })
            }

            setIsConnected(true)
        }

        return () => {
            if (echoRef.current) {
                window.Echo.leave(`station-chat.${stationUuid}`)
                if (auth.user) {
                    window.Echo.leave(`user.${auth.user.id}`)
                }
            }
        }
    }, [stationUuid, auth.user?.id])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!data.message.trim() || isSending) return

        const messageText = data.message
        setIsSending(true)
        pendingMessageRef.current = messageText

        post(route('chat.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setData('message', '')
                // Don't clear isSending here - wait for WebSocket confirmation
            },
            onError: (errors) => {
                console.error('Chat error:', errors)
                setIsSending(false)
                pendingMessageRef.current = null
                // Show flash error message for rate limiting
                if (errors.message) {
                    // The error will be handled by the global flash message system
                }
            }
        })
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        })
    }

    const deleteChatMessage = (messageId) => {
        // Remove from UI immediately
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        
        router.delete(route('moderation.chat.delete', messageId), {
            preserveScroll: true,
            onError: (errors) => {
                console.log('Delete error:', errors)
                // If delete failed, we could restore the message here if needed
            }
        })
    }

    const showMuteModal = (userId, username) => {
        const modal = document.getElementById(`mute_modal_${userId}`)
        if (modal) modal.showModal()
    }

    // Update countdown timer for muted users
    useEffect(() => {
        if (!auth.user?.muted_until) {
            setTimeRemaining(null)
            return
        }

        const updateTimer = () => {
            const mutedUntil = new Date(auth.user.muted_until)
            const now = new Date()
            const diff = mutedUntil - now

            if (diff <= 0) {
                setTimeRemaining(null)
                // Reload page to refresh user auth data
                window.location.reload()
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [auth.user?.muted_until])

    return (
        <div className="card bg-base-200 h-full flex flex-col">
            <div className="card-header p-4 border-b border-base-300">
                <h3 className="card-title text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faComments} className="text-xl" />
                    Station Chat
                    <div className={`badge badge-sm ${isConnected ? 'badge-success' : 'badge-error'}`}>
                        {isConnected ? 'Online' : 'Offline'}
                    </div>
                </h3>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                    {messages.length === 0 ? (
                        <div className="text-center text-base-content/60 py-8">
                            <div className="text-4xl mb-2"><FontAwesomeIcon icon={faWaveSquare} /></div>
                            <p>No messages yet. Be the first to say hello!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className="chat chat-start">
                                <div className="chat-image avatar placeholder">
                                    <div className="bg-primary text-primary-content w-8 h-8 rounded-full">
                                        <span className="text-xs">
                                            {message.username ? message.username[0].toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-header flex items-center gap-2">
                                    <span className="font-semibold">
                                        {message.username || 'Anonymous'}
                                    </span>
                                    {message.user?.isModerator && (
                                        <span className="badge badge-warning badge-xs">MOD</span>
                                    )}
                                    <time className="text-xs opacity-50">
                                        {formatTime(message.created_at)}
                                    </time>
                                    {auth.user?.isModerator && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => deleteChatMessage(message.id)}
                                                className="btn btn-xs btn-error"
                                                title="Delete message"
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                            {message.user_id && (
                                                <>
                                                    <button
                                                        onClick={() => showMuteModal(message.user_id, message.username)}
                                                        className="btn btn-xs btn-warning"
                                                        title="Mute user"
                                                    >
                                                        <FontAwesomeIcon icon={faVolumeMute} />
                                                    </button>
                                                    <button
                                                        onClick={() => router.post(route('moderation.users.unmute', message.user_id))}
                                                        className="btn btn-xs btn-success"
                                                        title="Unmute user"
                                                    >
                                                        <FontAwesomeIcon icon={faVolumeHigh} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="chat-bubble bg-base-100 text-base-content border border-base-300">
                                    {message.message}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-base-300">
                    {auth.user ? (
                        timeRemaining ? (
                            <div className="text-center py-4">
                                <div className="alert alert-warning">
                                    <FontAwesomeIcon icon={faVolumeMute} />
                                    <div>
                                        <h3 className="font-bold">You are muted</h3>
                                        <div className="text-sm">Unmuted in {timeRemaining}</div>
                                        {auth.user.isModerator && (
                                            <button
                                                onClick={() => router.post(route('moderation.users.unmute', auth.user.id))}
                                                className="btn btn-sm btn-success mt-2"
                                            >
                                                Unmute Myself
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className={`input input-bordered flex-1 ${isSending ? 'input-disabled opacity-50' : ''}`}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    maxLength={500}
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${isSending ? 'loading' : ''}`}
                                    disabled={isSending || !data.message.trim()}
                                >
                                    {isSending ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        )
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-base-content/60 mb-3">Sign in to join the chat</p>
                            <a href={route('login')} className="btn btn-primary btn-sm">
                                Sign In
                            </a>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mute User Modals - only create one per unique user */}
            {auth.user?.isModerator && 
                [...new Map(messages.filter(m => m.user_id).map(m => [m.user_id, m])).values()]
                .map((message) => (
                    <MuteUserModal 
                        key={`mute-${message.user_id}`}
                        userId={message.user_id} 
                        username={message.username}
                    />
                ))
            }
        </div>
    )
}