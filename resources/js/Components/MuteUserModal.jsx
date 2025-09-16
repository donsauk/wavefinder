import React from 'react'
import { useForm } from '@inertiajs/react'

export default function MuteUserModal({ userId, username }) {
    const { data, setData, post, processing } = useForm({
        hours: 1,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('moderation.users.mute', userId), {
            onSuccess: () => {
                document.getElementById(`mute_modal_${userId}`).close()
                setData('hours', 1)
            }
        })
    }

    const handleHoursChange = (e) => {
        const value = parseFloat(e.target.value)
        setData('hours', value)
    }

    return (
        <dialog id={`mute_modal_${userId}`} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Mute User: {username}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Duration: {data.hours} hour{data.hours !== 1 ? 's' : ''}</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="24"
                            step="0.1"
                            value={data.hours}
                            onChange={handleHoursChange}
                            className="range range-warning w-full"
                        />
                        <div className="flex justify-between text-xs px-2 mt-1">
                            <span>6min</span>
                            <span>12h</span>
                            <span>24h</span>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => document.getElementById(`mute_modal_${userId}`).close()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-warning ${processing ? 'loading' : ''}`}
                            disabled={processing}
                        >
                            Mute User
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
