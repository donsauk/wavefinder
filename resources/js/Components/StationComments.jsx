import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'

export default function StationComments({ stationUuid }) {
    const { auth } = usePage().props
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch comments from API when component mounts
    useEffect(() => {
        fetchComments()
    }, [stationUuid])

    // Fetch comments from backend API - gets comments with user data eagerly loaded
    const fetchComments = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/station/${stationUuid}/comments`)
            const data = await response.json()
            if (data.success) {
                setComments(data.comments)
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Submit new comment - requires authentication, validates content, and updates UI
    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!auth.user) {
            alert('Please login to comment')
            return
        }
        
        if (!newComment.trim()) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`/station/${stationUuid}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ content: newComment.trim() })
            })

            const data = await response.json()
            if (data.success) {
                // Add new comment to the beginning of the list (newest first)
                setComments([data.comment, ...comments])
                setNewComment('')
            } else {
                alert('Failed to post comment')
            }
        } catch (error) {
            console.error('Failed to submit comment:', error)
            alert('Failed to post comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete comment - only allows users to delete their own comments
    const handleDeleteComment = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        try {
            const response = await fetch(`/station/${stationUuid}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            })

            const data = await response.json()
            if (data.success) {
                // Remove deleted comment from state
                setComments(comments.filter(comment => comment.id !== commentId))
            } else {
                alert(data.message || 'Failed to delete comment')
            }
        } catch (error) {
            console.error('Failed to delete comment:', error)
            alert('Failed to delete comment')
        }
    }

    // Generate initials from username for placeholder avatar
    const getInitials = (name) => {
        return name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || '?'
    }

    // Format timestamp to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }

    return (
        <div className="card bg-base-200">
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
                            <div className="avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full">
                                    <span className="text-sm">{getInitials(auth.user.name)}</span>
                                </div>
                            </div>
                            
                            {/* Comment Input */}
                            <div className="flex-1">
                                <textarea
                                    className="textarea textarea-bordered w-full resize-none"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows="3"
                                    maxLength="1000"
                                    disabled={isSubmitting}
                                />
                                
                                {/* Submit Button and Character Count */}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs opacity-60">{newComment.length}/1000</span>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-sm ${isSubmitting ? 'loading' : ''}`}
                                        disabled={!newComment.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    // Login prompt for unauthenticated users
                    <div className="text-center py-6 mb-6 bg-base-100 rounded-lg border border-base-300">
                        <p className="text-sm opacity-70 mb-3">Join the conversation!</p>
                        <a href="/login" className="btn btn-primary btn-sm mr-2">Login</a>
                        <a href="/register" className="btn btn-outline btn-sm">Sign Up</a>
                    </div>
                )}

                {/* Comments List */}
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.map((comment) => (
                            <div key={comment.id} className="chat chat-start">
                                {/* User Avatar - placeholder with initials */}
                                <div className="chat-image avatar avatar-placeholder">
                                    <div className="bg-neutral text-neutral-content w-10 rounded-full">
                                        <span className="text-sm">{getInitials(comment.user.name)}</span>
                                    </div>
                                </div>
                                
                                {/* Comment Header - username and timestamp */}
                                <div className="chat-header text-xs opacity-70">
                                    <span className="font-medium">{comment.user.name}</span>
                                    <time className="ml-2">
                                        {formatDate(comment.created_at)}
                                    </time>
                                </div>
                                
                                {/* Comment Bubble */}
                                <div className="chat-bubble chat-bubble-neutral max-w-lg break-words">
                                    {comment.content}
                                </div>
                                
                                {/* Delete Button - only show for comment author */}
                                {auth.user && auth.user.id === comment.user.id && (
                                    <div className="chat-footer opacity-50">
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="btn btn-ghost btn-xs text-error hover:text-error"
                                            title="Delete comment"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
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