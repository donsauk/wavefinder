import React, { useState, useEffect, useRef } from 'react'
import { useForm } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

export default function StationChat({ stationUuid }) {
    const { auth } = usePage().props
    const [messages, setMessages] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const messagesEndRef = useRef(null)
    const echoRef = useRef(null)

    const { data, setData, post, processing, reset } = useForm({
        station_uuid: stationUuid,
        message: '',
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
                        created_at: e.created_at
                    }])
                })

            setIsConnected(true)
        }

        return () => {
            if (echoRef.current) {
                window.Echo.leave(`station-chat.${stationUuid}`)
            }
        }
    }, [stationUuid])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!data.message.trim()) return

        // Store the message before clearing
        const messageText = data.message

        // Add message optimistically to UI
        const tempMessage = {
            id: Date.now(),
            message: messageText,
            username: auth.user?.name || 'Anonymous',
            user_id: auth.user?.id || null,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, tempMessage])

        // Clear the input immediately for better UX
        reset('message')

        post(route('chat.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setData('message', '')
            },
            onError: (errors) => {
                console.error('Chat error:', errors)
                // Remove the optimistic message if send failed
                setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
                // Restore the message if sending failed
                setData('message', messageText)
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

    return (
        <div className="card bg-base-200 h-full flex flex-col">
            <div className="card-header p-4 border-b border-base-300">
                <h3 className="card-title text-lg flex items-center gap-2">
                    <span className="text-2xl">💬</span>
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
                            <div className="text-4xl mb-2">👋</div>
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
                                    <time className="text-xs opacity-50">
                                        {formatTime(message.created_at)}
                                    </time>
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
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="input input-bordered flex-1"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                maxLength={500}
                                disabled={processing}
                            />
                            <button
                                type="submit"
                                className={`btn btn-primary ${processing ? 'loading' : ''}`}
                                disabled={processing || !data.message.trim()}
                            >
                                {processing ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </form>
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
        </div>
    )
}