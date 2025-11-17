'use client'
import { useState, useEffect, ReactNode } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

import { createContext, useContext } from 'react'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration (default 5 seconds)
    const duration = notification.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div 
      className="fixed top-4 right-4 space-y-4 z-50"
      role="region"
      aria-label="Notificaciones"
    >
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300) // Animation duration
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />
    }
  }

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg rounded-r-lg"
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-600`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 dark:bg-red-900/30 dark:border-red-600`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-600`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-600`
    }
  }

  return (
    <div
      className={`
        ${getStyles()}
        p-4 max-w-sm w-full transition-all duration-300 ease-in-out transform
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Cerrar notificación"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Utility hook for common notification patterns
export function useNotificationHelpers() {
  const { addNotification } = useNotifications()

  const notifySuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message })
  }

  const notifyError = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification({ type: 'error', title, message, duration: 0, action }) // Don't auto-hide errors
  }

  const notifyWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message, duration: 7000 })
  }

  const notifyInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message })
  }

  return { notifySuccess, notifyError, notifyWarning, notifyInfo }
}