import { Head, Link } from '@inertiajs/react'
import BackgroundBlobs from '../Components/BackgroundBlobs'

export default function Landing() {
  return (
    <>
      <Head title="WAVEFINDER" />
      <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-base-100 to-base-200">
        <BackgroundBlobs extraCircles showDots />

        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
          <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl xl:text-9xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                WAVEFINDER
              </h1>
              <div className="mt-4 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-8 py-8 lg:py-0">
            <div className="max-w-md text-center space-y-6 lg:space-y-8">
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-base-content font-light italic relative">
                <span className="text-primary text-4xl sm:text-6xl absolute -top-2 sm:-top-4 -left-2 sm:-left-4 opacity-20">"</span>
                Discover and listen to radio stations from around the world.
                <span className="text-primary text-4xl sm:text-6xl absolute -bottom-6 sm:-bottom-8 -right-2 sm:-right-4 opacity-20">"</span>
              </blockquote>

              <Link href={route('browse')} className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
