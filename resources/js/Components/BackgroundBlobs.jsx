import React from 'react'

export default function BackgroundBlobs({ extraCircles = false, showDots = false }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary opacity-20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-secondary opacity-15 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent opacity-10 rounded-full blur-xl" />

      {extraCircles && (
        <>
          <div className="absolute bottom-10 right-1/3 w-32 h-32 bg-primary opacity-25 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-info opacity-5 rounded-full blur-3xl" />
        </>
      )}

      {showDots && (
        <>
          <div className="absolute bottom-10 left-10 w-4 h-4 bg-primary rounded-full opacity-50" />
          <div className="absolute top-20 right-20 w-2 h-2 bg-secondary rounded-full opacity-60" />
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-accent rounded-full opacity-40" />
        </>
      )}
    </div>
  )
}

