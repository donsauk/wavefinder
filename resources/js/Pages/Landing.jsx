import { Head, Link } from '@inertiajs/react';

export default function Landing() {
    return (
        <>
            <Head title="WAVEFINDER" />
            <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-base-100 to-base-200">
                {/* Decorative blobs */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 -right-32 w-64 h-64 bg-secondary opacity-15 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-1/3 w-32 h-32 bg-primary opacity-25 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-info opacity-5 rounded-full blur-3xl"></div>
                </div>

                {/* Main content */}
                <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
                    {/* WAVEFINDER title */}
                    <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
                        <div className="text-center">
                            <h1 className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                WAVEFINDER
                            </h1>
                            <div className="mt-4 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                        </div>
                    </div>

                    {/* Quote and button */}
                    <div className="flex-1 flex items-center justify-center px-8 py-8 lg:py-0">
                        <div className="max-w-md text-center space-y-6 lg:space-y-8">
                            <blockquote className="text-lg sm:text-xl lg:text-2xl text-base-content font-light italic relative">
                                <span className="text-primary text-4xl sm:text-6xl absolute -top-2 sm:-top-4 -left-2 sm:-left-4 opacity-20">"</span>
                               Ride your perfect radio wave.
                                <span className="text-primary text-4xl sm:text-6xl absolute -bottom-6 sm:-bottom-8 -right-2 sm:-right-4 opacity-20">"</span>
                            </blockquote>

                            <Link 
                                href={route('browse')} 
                                className="btn btn-primary btn-lg px-8 py-4 bg-gradient-to-r from-primary to-secondary border-none hover:scale-105 transition-transform"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Subtle dots */}
                <div className="absolute bottom-10 left-10 w-4 h-4 bg-primary rounded-full opacity-50"></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-secondary rounded-full opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-accent rounded-full opacity-40"></div>

            </div>
        </>
    );
}
