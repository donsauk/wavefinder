import './bootstrap';
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { AudioProvider } from './Contexts/AudioContext'
import AudioPlayer from './Components/AudioPlayer'

createInertiaApp({
    title: (title) => `${title} - Laravel`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el)
        root.render(
            <AudioProvider>
                <App {...props} />
                <AudioPlayer />
            </AudioProvider>
        )
    },
})