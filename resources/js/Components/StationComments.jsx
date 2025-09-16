import React from 'react'
import { usePage, useForm, router, Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function StationComments({ stationUuid, comments = [] }) {
    const { auth, flash, errors } = usePage().props
    
    // Don't use form remembering for comments to prevent old text from persisting
    const { data, setData, post, processing, reset, clearErrors } = useForm({
        content: '',
    })

    // Enhanced form submission with latest Inertia.js patterns
    const handleSubmitComment = (e) => {
        e.preventDefault()
        if (!auth.user) {
            // Use global route() function for login redirect
            router.visit(route('login'), {
                data: { intended: window.location.pathname },
                preserveScroll: true
            })
            return
        }
        
        if (!data.content.trim()) return

        // Use global route() function for dynamic route generation
        post(route('station.comments.store', { stationuuid: stationUuid }), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                clearErrors()
                setData('content', '')
                // Flash success message handled by backend
            },
            onError: (errors) => {
                // Focus textarea if there's a content error
                if (errors.content) {
                    document.querySelector('textarea[name="content"]')?.focus()
                }
            }
        })
    }

    // Enhanced comment deletion with better UX
    const handleDeleteComment = (commentId, isModerator = false) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        // Use moderation route for moderators, regular route for comment authors
        const deleteRoute = isModerator 
            ? route('moderation.comments.delete', commentId)
            : route('station.comments.destroy', { stationuuid: stationUuid, comment: commentId })

        router.delete(deleteRoute, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Success handled by flash message from backend
            },
            onError: (errors) => {
                console.error('Failed to delete comment:', errors)
            }
        })
    }

    // Generate initials from username for placeholder avatar
    const getInitials = (name) => {
        return name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || '?'
    }

    // Date and time formatting to include YYYY-MM-DD alongside HH:mm
    const formatDate = (timestamp) => {
        const d = new Date(timestamp)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    const formatDateTime = (timestamp) => `${formatDate(timestamp)} ${formatTime(timestamp)}`

    return (
        <div className="card bg-base-200 border border-primary/20">
            <div className="card-body">
                <h2 className="card-title text-lg mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comments {comments.length > 0 && `(${comments.length})`}
                </h2>

                {/* Comment Input Form - only show if user is authenticated */}
                {auth.user ? (
                    <form onSubmit={handleSubmitComment} className="mb-6">
                        <div className="flex gap-3">
                            {/* User Avatar */}
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    {auth.user.avatar_url ? (
                                        <img 
                                            src={auth.user.avatar_url} 
                                            alt={`${auth.user.name}'s avatar`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                                            <span className="text-sm">{getInitials(auth.user.name)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Comment Input */}
                            <div className="flex-1">
                                <textarea
                                    name="content"
                                    className={`textarea textarea-bordered w-full resize-none ${errors.content ? 'textarea-error' : ''}`}
                                    placeholder="Add a comment..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    onFocus={() => clearErrors('content')} 
                                    rows="3"
                                    maxLength="1000"
                                    disabled={processing}
                                />
                                
                                {/* Show validation error */}
                                {errors.content && (
                                    <div className="text-error text-xs mt-1">{errors.content}</div>
                                )}
                                
                                {/* Submit Button and Character Count */}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs opacity-60">{data.content.length}/1000</span>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-sm ${processing ? 'loading' : ''}`}
                                        disabled={!data.content.trim() || processing}
                                    >
                                        {processing ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    // Login prompt for unauthenticated users
                    <div className="text-center py-6 mb-6 bg-base-100 rounded-lg border border-primary/20">
                        <p className="text-sm opacity-70 mb-3">Join the conversation!</p>
                        <Link href="/login" className="btn btn-primary btn-sm mr-2">Login</Link>
                        <Link href="/register" className="btn btn-outline btn-sm">Sign Up</Link>
                    </div>
                )}

                {/* Comments List */}
                {/* Align message visuals with StationChat bubbles */}
                {comments.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                        {comments.map((comment) => {
                            const isOwner = comment.user.id === auth.user?.id
                            return (
                            <div key={comment.id} className="chat chat-end">
                                {/* Avatar (match chat sizes/colors) */}
                                <div className="chat-image avatar">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {comment.user.avatar_url ? (
                                            <img
                                                src={comment.user.avatar_url}
                                                alt={`${comment.user.name}'s avatar`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`${comment.user.id === auth.user?.id ? 'bg-primary text-primary-content' : 'bg-neutral text-neutral-content'} w-full h-full flex items-center justify-center`}>
                                                <span className="text-xs">{comment.user?.name ? comment.user.name[0].toUpperCase() : 'A'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bubble with username/time header to match chat */}
                                <div className={`chat-bubble ${isOwner ? 'chat-bubble-primary' : ''} text-right`}>
                                    <div className="text-[11px] opacity-80 flex items-center justify-end gap-2 text-right">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${isOwner ? 'text-primary-content' : 'text-base-content'}`}>{comment.user.name}</span>
                                            {comment.user?.isModerator && (
                                                <span className="badge badge-accent badge-xs text-accent-content">MOD</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <time className={`opacity-60 flex-shrink-0 ${isOwner ? 'text-primary-content' : ''}`}>{formatDateTime(comment.created_at)}</time>
                                            {auth.user && (auth.user.id === comment.user.id || auth.user.isModerator) && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id, auth.user.isModerator && auth.user.id !== comment.user.id)}
                                                    className="p-1 rounded hover:bg-base-300/50 text-error opacity-80 hover:opacity-100"
                                                    title="Delete comment"
                                                    aria-label="Delete comment"
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="whitespace-pre-wrap break-words text-right">
                                        {comment.content}
                                    </div>
                                </div>

                                {/* Only show moderator actions that remain (mute) below bubble */}
                            </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 opacity-60">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">No comments yet.</p>
                        <p className="text-xs mt-1">Be the first to share your thoughts about this station!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
