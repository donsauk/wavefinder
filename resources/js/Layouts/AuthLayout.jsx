import React from 'react'
import { Head, Link } from '@inertiajs/react'
import BackgroundBlobs from '../Components/BackgroundBlobs'

export default function AuthLayout({ pageTitle, title = 'WAVEFINDER', subtitle, children }) {
  return (
    <>
      {pageTitle && <Head title={pageTitle} />}
      <div className="min-h-screen w-full bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center px-4 overflow-hidden relative">
        <BackgroundBlobs />

        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href={route('home')} className="text-4xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </Link>
            {subtitle && <p className="text-base-content/70 mt-2">{subtitle}</p>}
          </div>

          <div className="card bg-base-200 shadow-xl w-full border border-primary/20">
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

