'use client'
import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  progress?: number
}

export function LoadingSpinner({ size = 'md', message, progress }: LoadingSpinnerProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6'
      case 'md':
        return 'w-8 h-8'
      case 'lg':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4" role="status" aria-live="polite">
      <div className="relative">
        <div
          className={`${getSizeClasses()} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
          aria-hidden="true"
        ></div>
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      {message && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}{dots}
          </p>
          {progress !== undefined && (
            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progreso: ${Math.round(progress)}%`}
              ></div>
            </div>
          )}
        </div>
      )}
      
      <span className="sr-only">
        {message ? `${message}. ` : ''}Cargando contenido, por favor espera.
      </span>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
}

export function LoadingOverlay({ isVisible, message, progress }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm mx-4">
        <h2 id="loading-title" className="sr-only">Cargando</h2>
        <LoadingSpinner size="lg" message={message} progress={progress} />
      </div>
    </div>
  )
}