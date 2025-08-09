import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { Howl } from 'howler'

const AudioContext = createContext()

export function useAudio() {
    const context = useContext(AudioContext)
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider')
    }
    return context
}

export function AudioProvider({ children }) {
    // Current station state
    const [currentStation, setCurrentStation] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [volume, setVolume] = useState(0.05) // Default volume
    
    // Howler instance reference
    const howlerRef = useRef(null)

    // Play a station - can be called from anywhere in the app
    const playStation = (station) => {
        const streamUrl = station.url_resolved || station.url
        if (!streamUrl) {
            alert('No stream URL available for this station.')
            return
        }

        setIsLoading(true)
        console.log('Playing station:', station.name, 'URL:', streamUrl)
        
        // Stop any existing audio with proper cleanup
        if (howlerRef.current) {
            try {
                howlerRef.current.stop()
                howlerRef.current.unload()
                howlerRef.current = null
            } catch (error) {
                console.warn('Error cleaning up previous audio:', error)
                howlerRef.current = null
            }
        }

        // Set current station
        setCurrentStation(station)

        // Add small delay to ensure cleanup is complete
        setTimeout(() => {
            // Create new Howler instance
            howlerRef.current = new Howl({
                src: [streamUrl],
                html5: true,
                format: ['mp3', 'aac'],
                volume: volume,
                onload: () => {
                    setIsLoading(false)
                    setIsPlaying(true)
                },
                onplay: () => {
                    setIsPlaying(true)
                },
                onpause: () => {
                    setIsPlaying(false)
                },
                onstop: () => {
                    setIsPlaying(false)
                },
                onloaderror: (id, error) => {
                    console.error('Audio load error:', error)
                    setIsLoading(false)
                    setIsPlaying(false)
                    alert('Failed to load audio stream. Please try again.')
                },
                onplayerror: (id, error) => {
                    console.error('Audio play error:', error)
                    setIsLoading(false)
                    setIsPlaying(false)
                    alert('Failed to play audio stream. Please try again.')
                }
            })

            // Start playing
            try {
                howlerRef.current.play()
            } catch (error) {
                console.error('Error starting playback:', error)
                setIsLoading(false)
                setIsPlaying(false)
                alert('Failed to start playback. Please try again.')
            }
        }, 50)
    }

    // Pause current audio (completely stops the stream)
    const pauseStation = () => {
        if (howlerRef.current) {
            try {
                howlerRef.current.stop()
                setIsPlaying(false)
            } catch (error) {
                console.warn('Error pausing audio:', error)
                setIsPlaying(false)
            }
        }
    }

    // Resume current audio (restarts the stream from beginning)
    const resumeStation = () => {
        if (currentStation) {
            playStation(currentStation)
        }
    }


    // Handle volume change
    const changeVolume = (newVolume) => {
        setVolume(newVolume)
        if (howlerRef.current) {
            howlerRef.current.volume(newVolume)
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (howlerRef.current) {
                try {
                    howlerRef.current.stop()
                    howlerRef.current.unload()
                    howlerRef.current = null
                } catch (error) {
                    console.warn('Error during audio cleanup:', error)
                    howlerRef.current = null
                }
            }
        }
    }, [])

    const value = {
        // State
        currentStation,
        isPlaying,
        isLoading,
        volume,
        
        // Actions
        playStation,
        pauseStation,
        resumeStation,
        changeVolume
    }

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    )
}