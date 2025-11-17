'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { parseCSV } from '../lib/parser'

export function UploadPanel() {
  const { setData } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV válido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parsedData = await parseCSV(file)
      setData(parsedData)
      console.log('Datos cargados:', parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    
    if (!file) return

    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV válido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parsedData = await parseCSV(file)
      setData(parsedData)
      console.log('Datos cargados:', parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Cargar Datos
      </h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="text-gray-600 dark:text-gray-300">
            <p className="text-lg font-medium mb-2">
              Arrastra tu archivo CSV aquí
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              o haz clic para seleccionar un archivo
            </p>
          </div>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
            disabled={loading}
          />
          
          <label
            htmlFor="csv-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Seleccionar Archivo'}
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <h3 className="font-medium mb-2">Formatos soportados:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Archivos CSV con encabezados</li>
          <li>Separador de comas o punto y coma</li>
          <li>Codificación UTF-8</li>
        </ul>
      </div>
    </div>
  )
}