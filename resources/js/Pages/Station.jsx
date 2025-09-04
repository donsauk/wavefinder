import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faHandPointer, faFire } from '@fortawesome/free-solid-svg-icons'
import StationComments from '../Components/StationComments'
import StationHeader from '../Components/StationHeader'
import StationChat from '../Components/StationChat'
import AppLayout from '../Layouts/AppLayout'

// Small helpers to reduce repetition
const InfoItem = ({ label, children }) => (
  <div className="flex-1 flex items-center justify-between p-2 rounded-box bg-base-100 border">
    <span className="opacity-70">{label}</span>
    <span className="font-semibold">{children}</span>
  </div>
)

const AvatarTiny = ({ user, getInitials }) => (
  <div className="avatar">
    {user?.avatar_url ? (
      <div className="w-6 h-6 rounded-full overflow-hidden">
        <img src={user.avatar_url} alt={`${user.name}'s avatar`} className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="placeholder w-6 h-6 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
        <span className="text-[10px]">{getInitials(user?.name)}</span>
      </div>
    )}
  </div>
)


export default function Station({ station, isFavorited, canVote, nextVoteTime, comments, userXP }) {
    const { auth } = usePage().props
    const getInitials = (name) => name?.split(' ').map(w => w.charAt(0)).join('').toUpperCase() || '?'

    let homepageDomain = ''
    try {
        homepageDomain = station?.homepage ? new URL(station.homepage).hostname.replace(/^www\./, '') : ''
    } catch {}

    const languageLabel = (() => {
        const s = station?.language ? String(station.language).trim() : ''
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
    })()

    const showBitrate = Number(station?.bitrate) > 0

    const stats = [
        { title: 'Votes', color: 'text-primary', icon: faThumbsUp, value: station.votes },
        { title: 'Clicks', color: 'text-secondary', icon: faHandPointer, value: station.clickcount },
        { title: 'Trend', color: 'text-accent', icon: faFire, value: station.clicktrend },
    ]

    return (
        <>
            <Head title={`${station.name} - WAVEFINDER`} />
            <AppLayout>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6">
                    <div className="space-y-8">
                                <div className="hero rounded-box bg-base-200 relative overflow-hidden shadow-xl">
                                    <Link href={route('browse')} className="btn btn-primary btn-sm absolute left-4 top-4 z-10">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to Browse
                                    </Link>
                                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                                    <div className="hero-content py-8">
                                        <StationHeader 
                                            station={station} 
                                            isFavorited={isFavorited} 
                                            canVote={canVote} 
                                            nextVoteTime={nextVoteTime} 
                                        />
                                    </div>
                                </div>

                                <div className="card bg-base-200 shadow-lg">
                                    <div className="card-body gap-4">
                                        <div className="stats stats-vertical md:stats-horizontal w-full">
                                            {stats.map((s) => (
                                                <div className="stat" key={s.title}>
                                                    <div className="stat-title">{s.title}</div>
                                                    <div className={`stat-value ${s.color} flex items-center gap-2`}>
                                                        <FontAwesomeIcon icon={s.icon} /> {s.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {station.tags && (
                                            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                                                {station.tags.split(',').map((raw, index) => {
                                                    const t = raw.trim();
                                                    if (!t) return null;
                                                    return (
                                                        <Link
                                                            key={`${t}-${index}`}
                                                            href={`${route('browse')}?search=${encodeURIComponent(t)}`}
                                                            className="badge badge-primary badge-sm"
                                                        >
                                                            {t}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3">
                                            {station.codec && (<InfoItem label="Codec">{station.codec}</InfoItem>)}
                                            {showBitrate && (<InfoItem label="Bitrate">{Number(station.bitrate)} kbps</InfoItem>)}
                                            {languageLabel && (<InfoItem label="Language">{languageLabel}</InfoItem>)}
                                            {station.homepage && (
                                                <a
                                                    href={station.homepage}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-primary btn-sm gap-2 w-full sm:w-auto"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <span className="truncate max-w-[14rem]">{homepageDomain || 'Visit Homepage'}</span>
                                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {userXP && (
                                    <div className="bg-base-200 rounded-box shadow p-3 flex items-center gap-3">
                                        {auth?.user && (
                                            <div className="flex items-center gap-2 min-w-0">
                                                <AvatarTiny user={auth.user} getInitials={getInitials} />
                                                <span className="text-sm font-medium truncate max-w-[10rem]" title={auth.user.name}>
                                                    {auth.user.name}
                                                </span>
                                            </div>
                                        )}
                                        <div className="font-semibold whitespace-nowrap">Level {userXP.level || 1}</div>
                                        <progress className="progress progress-primary flex-1" value={userXP.progressPercent || 0} max="100" />
                                        <div className="badge badge-primary whitespace-nowrap">{(userXP.xp || 0).toLocaleString()} XP</div>
                                    </div>
                                )}

                                <div className="mt-2">
                                    <StationComments stationUuid={station.stationuuid} comments={comments} />
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <div className="sticky h-[calc(100vh-15rem)]">
                                    <StationChat stationUuid={station.stationuuid} />
                                </div>
                            </div>
                        </div>
            </AppLayout>
        </>
    )
}
