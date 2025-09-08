import React, { useState, useEffect, useRef } from 'react'
import { useForm, router, Link } from '@inertiajs/react'
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
    const messagesContainerRef = useRef(null)
    const echoRef = useRef(null)
    const pendingMessageRef = useRef(null)

    const { data, setData, post, reset } = useForm({
        station_uuid: stationUuid,
        message: '',
    })

    const scrollToBottom = (smooth = true) => {
        const container = messagesContainerRef.current
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            })
        }
    }

    useEffect(() => {
        if (messages.length === 0) return
        // Do not auto-jump the page on initial load; only enable after
        // the first batch has rendered or when we are actively sending
        if (isInitialLoad && !isSending) {
            setIsInitialLoad(false)
            return
        }
        scrollToBottom(true)
    }, [messages, isInitialLoad, isSending])

    useEffect(() => {
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
                    
                    if (e.user_id === auth.user?.id && pendingMessageRef.current === e.message) {
                        setIsSending(false)
                        pendingMessageRef.current = null
                    }
                })
                .listen('.chat.message.deleted', (e) => {
                    setMessages(prev => prev.filter(msg => msg.id !== e.messageId))
                })

            if (auth.user) {
                window.Echo.private(`user.${auth.user.id}`)
                    .listen('.user.muted', (e) => {
                        window.location.reload()
                    })
                    .listen('.user.unmuted', (e) => {
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
            },
            onError: (errors) => {
                console.error('Chat error:', errors)
                setIsSending(false)
                pendingMessageRef.current = null
                if (errors.message) {}
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
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        
        router.delete(route('moderation.chat.delete', messageId), {
            preserveScroll: true,
            onError: (errors) => {
                console.log('Delete error:', errors)
            }
        })
    }

    const showMuteModal = (userId, username) => {
        const modal = document.getElementById(`mute_modal_${userId}`)
        if (modal) modal.showModal()
    }

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
        <div className="card bg-base-200 h-full flex flex-col border border-primary/20 min-h-[20rem] lg:min-h-0">
            <div className="card-header p-4 border-b border-primary/20">
                <h3 className="card-title text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faComments} className="text-xl" />
                    Station Chat
                    <div className={`badge badge-sm ${isConnected ? 'badge-success' : 'badge-error'}`}>
                        {isConnected ? 'LIVE' : 'Offline'}
                    </div>
                </h3>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                    {messages.length === 0 ? (
                        <div className="text-center text-base-content/60 py-8">
                            <div className="text-4xl mb-2"><FontAwesomeIcon icon={faWaveSquare} /></div>
                            <p>No messages yet. Be the first to say hello!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`chat ${message.user_id === auth.user?.id ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-image avatar">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        {message.user?.avatar_url ? (
                                            <img 
                                                src={message.user.avatar_url} 
                                                alt={`${message.username}'s avatar`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`${message.user_id === auth.user?.id ? 'bg-primary text-primary-content' : 'bg-neutral text-neutral-content'} w-full h-full flex items-center justify-center`}>
                                                <span className="text-xs">
                                                    {message.username ? message.username[0].toUpperCase() : 'A'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`chat-bubble ${message.user_id === auth.user?.id ? 'chat-bubble-primary' : ''}`}>
                                    <div className="text-[11px] opacity-80 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-base-content">
                                                {message.username || 'Anonymous'}
                                            </span>
                                            {message.user?.isModerator && (
                                                <span className="badge badge-info badge-xs">MOD</span>
                                            )}
                                        </div>
                                        <time className="opacity-60 ml-2 flex-shrink-0">
                                            {formatTime(message.created_at)}
                                        </time>
                                    </div>
                                    <div className="whitespace-pre-wrap break-words">
                                        {message.message}
                                    </div>
                                </div>
                                {auth.user?.isModerator && (
                                    <div className="chat-footer opacity-60 mt-1 flex gap-1">
                                        <button
                                            onClick={() => deleteChatMessage(message.id)}
                                            className="btn btn-ghost btn-xs text-error"
                                            title="Delete message"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                        {message.user_id && (
                                            <>
                                                <button
                                                    onClick={() => showMuteModal(message.user_id, message.username)}
                                                    className="btn btn-ghost btn-xs text-warning"
                                                    title="Mute user"
                                                >
                                                    <FontAwesomeIcon icon={faVolumeMute} />
                                                </button>
                                                <button
                                                    onClick={() => router.post(route('moderation.users.unmute', message.user_id))}
                                                    className="btn btn-ghost btn-xs text-success"
                                                    title="Unmute user"
                                                >
                                                    <FontAwesomeIcon icon={faVolumeHigh} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-primary/20">
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
                                    className="input input-bordered flex-1"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    maxLength={500}
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSending || !data.message.trim()}
                                >
                                    {isSending ? (
                                        <span className="loading loading-spinner loading-sm" />
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
                            <Link href={route('login')} className="btn btn-primary btn-sm">Sign In</Link>
                        </div>
                    )}
                </div>
            </div>
            
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
