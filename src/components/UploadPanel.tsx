'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { parseCSV } from '../lib/parser'
import { useNotificationHelpers } from './ui/NotificationSystem'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { Tooltip } from './ui/Tooltip'

export function UploadPanel() {
  const { setData } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { notifySuccess, notifyError, notifyInfo } = useNotificationHelpers()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    await processFile(file)
  }

  const processFile = async (file: File) => {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      const errorMsg = 'Por favor selecciona un archivo CSV válido'
      setError(errorMsg)
      notifyError('Archivo inválido', errorMsg)
      return
    }

    setLoading(true)
    setError(null)
    setUploadedFile(file.name)
    setUploadProgress(0)

    notifyInfo('Procesando archivo', `Cargando ${file.name}...`)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const parsedData = await parseCSV(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setData(parsedData)
      notifySuccess(
        'Archivo cargado exitosamente',
        `${parsedData.rows.length} filas y ${parsedData.fields.length} columnas procesadas`
      )
      
      console.log('Datos cargados:', parsedData)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al procesar el archivo'
      setError(errorMsg)
      setUploadedFile(null)
      notifyError(
        'Error al procesar archivo',
        errorMsg,
        {
          label: 'Reintentar',
          onClick: () => setError(null)
        }
      )
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      document.getElementById('csv-upload')?.click()
    }
  }

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      role="region"
      aria-labelledby="upload-heading"
    >
      <h2 
        id="upload-heading"
        className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Cargar Datos
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onKeyDown={handleKeyDown}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
        role="button"
        tabIndex={0}
        aria-label="Área de carga de archivos. Puedes arrastrar un archivo CSV aquí o presionar Enter para seleccionar uno"
        aria-describedby="upload-description upload-status"
      >
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <LoadingSpinner 
              size="lg" 
              message="Procesando archivo" 
              progress={uploadProgress} 
            />
          ) : (
            <>
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <div className="text-gray-600 dark:text-gray-300" id="upload-description">
                <p className="text-lg font-medium mb-2">
                  Arrastra tu archivo CSV aquí
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  o haz clic para seleccionar un archivo
                </p>
              </div>
            </>
          )}

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="sr-only"
            id="csv-upload"
            disabled={loading}
            aria-describedby="upload-status"
          />

          {!loading && (
            <Tooltip content="Haz clic para seleccionar un archivo CSV desde tu computadora">
              <label
                htmlFor="csv-upload"
                className={`
                  bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                role="button"
                aria-disabled={loading}
              >
                Seleccionar Archivo
              </label>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Status messages */}
      <div id="upload-status" aria-live="polite" aria-atomic="true">
        {error && (
          <div 
            className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg"
            role="alert"
            aria-labelledby="error-heading"
          >
            <div className="flex">
              <svg 
                className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <h3 id="error-heading" className="text-red-800 dark:text-red-400 font-medium text-sm">
                  Error al cargar archivo
                </h3>
                <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {uploadedFile && !error && (
          <div 
            className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg"
            role="status"
            aria-labelledby="success-heading"
          >
            <div className="flex">
              <svg 
                className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <h3 id="success-heading" className="text-green-800 dark:text-green-400 font-medium text-sm">
                  Archivo cargado exitosamente
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                  {uploadedFile} - Listo para crear visualizaciones
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <h3 className="font-medium mb-2">Formatos soportados:</h3>
        <ul className="list-disc list-inside space-y-1" role="list">
          <li>Archivos CSV con encabezados</li>
          <li>Separador de comas o punto y coma</li>
          <li>Codificación UTF-8</li>
        </ul>
      </div>
    </section>
  )
}