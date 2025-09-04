import React from 'react'
import Navbar from '../Components/Navbar'
import FlashMessage from '../Components/FlashMessage'

export default function AppLayout({ children, top = null, containerClass = 'max-w-7xl mx-auto p-6', className = '' }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <FlashMessage />
      {top}
      <main className={`flex-1 overflow-y-auto pb-20 ${className}`}>
        <div className={containerClass}>{children}</div>
      </main>
    </div>
  )
}

