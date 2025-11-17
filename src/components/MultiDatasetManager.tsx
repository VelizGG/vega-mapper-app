'use client'
import { useState } from 'react'
import { useStore, ParsedTable } from '../store/useStore'
import { parseCSV } from '../lib/parser'
import { useNotificationHelpers } from './ui/NotificationSystem'
import { 
  TrashIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  PlusIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline'
import { Tooltip } from './ui/Tooltip'

interface Dataset {
  id: string
  name: string
  data: ParsedTable
  uploadDate: Date
  isActive: boolean
}

export function MultiDatasetManager() {
  const { data: currentData, setData } = useStore()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const { notifySuccess, notifyError, notifyWarning } = useNotificationHelpers()

  const addDataset = async (file: File) => {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      notifyError('Archivo inválido', 'Por favor selecciona un archivo CSV válido')
      return
    }

    setLoading(true)

    try {
      const parsedData = await parseCSV(file)
      const newDataset: Dataset = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        data: parsedData,
        uploadDate: new Date(),
        isActive: datasets.length === 0 // First dataset becomes active
      }

      setDatasets(prev => {
        const updated = prev.map(d => ({ ...d, isActive: false }))
        return [...updated, newDataset]
      })

      if (datasets.length === 0) {
        setData(parsedData)
      }

      notifySuccess(
        'Dataset agregado',
        `${file.name} cargado con ${parsedData.rows.length} filas y ${parsedData.fields.length} columnas`
      )
    } catch (err) {
      notifyError(
        'Error al cargar archivo',
        err instanceof Error ? err.message : 'Error desconocido'
      )
    } finally {
      setLoading(false)
    }
  }

  const setActiveDataset = (datasetId: string) => {
    setDatasets(prev => prev.map(d => ({
      ...d,
      isActive: d.id === datasetId
    })))

    const activeDataset = datasets.find(d => d.id === datasetId)
    if (activeDataset) {
      setData(activeDataset.data)
      notifySuccess('Dataset activado', `Ahora usando: ${activeDataset.name}`)
    }
  }

  const removeDataset = (datasetId: string) => {
    const datasetToRemove = datasets.find(d => d.id === datasetId)
    if (!datasetToRemove) return

    setDatasets(prev => {
      const filtered = prev.filter(d => d.id !== datasetId)
      
      // If we're removing the active dataset, activate the first remaining one
      if (datasetToRemove.isActive && filtered.length > 0) {
        filtered[0].isActive = true
        setData(filtered[0].data)
        notifyWarning('Dataset eliminado', `${datasetToRemove.name} eliminado. Activando: ${filtered[0].name}`)
      } else if (filtered.length === 0) {
        // No datasets left
        notifyWarning('Dataset eliminado', `${datasetToRemove.name} eliminado. No quedan datasets`)
      } else {
        notifySuccess('Dataset eliminado', `${datasetToRemove.name} eliminado exitosamente`)
      }
      
      return filtered
    })
  }

  const duplicateDataset = (datasetId: string) => {
    const originalDataset = datasets.find(d => d.id === datasetId)
    if (!originalDataset) return

    const duplicated: Dataset = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${originalDataset.name} (copia)`,
      data: { ...originalDataset.data },
      uploadDate: new Date(),
      isActive: false
    }

    setDatasets(prev => [...prev, duplicated])
    notifySuccess('Dataset duplicado', `Creada copia de ${originalDataset.name}`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDatasetStats = (data: ParsedTable) => {
    const sizeEstimate = JSON.stringify(data).length
    return {
      rows: data.rows.length,
      columns: data.fields.length,
      size: formatFileSize(sizeEstimate)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gestión de Datasets
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <PlusIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Agregar nuevo dataset
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && addDataset(e.target.files[0])}
                className="sr-only"
                id="multi-dataset-upload"
                disabled={loading}
              />
              <label
                htmlFor="multi-dataset-upload"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              >
                {loading ? 'Cargando...' : 'Seleccionar CSV'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Datasets List */}
      {datasets.length > 0 ? (
        <div className="space-y-3">
          {datasets.map(dataset => {
            const stats = getDatasetStats(dataset.data)
            return (
              <div
                key={dataset.id}
                className={`border rounded-lg p-4 transition-all ${
                  dataset.isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <TableCellsIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                          {dataset.name}
                          {dataset.isActive && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Activo
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {stats.rows} filas • {stats.columns} columnas • {stats.size}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Cargado: {dataset.uploadDate.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!dataset.isActive && (
                      <Tooltip content="Activar este dataset">
                        <button
                          onClick={() => setActiveDataset(dataset.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          aria-label={`Activar dataset ${dataset.name}`}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}

                    <Tooltip content="Duplicar dataset">
                      <button
                        onClick={() => duplicateDataset(dataset.id)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        aria-label={`Duplicar dataset ${dataset.name}`}
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>

                    <Tooltip content="Eliminar dataset">
                      <button
                        onClick={() => removeDataset(dataset.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label={`Eliminar dataset ${dataset.name}`}
                        disabled={datasets.length === 1}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Dataset Preview */}
                {dataset.isActive && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Campos disponibles:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {dataset.data.fields.slice(0, 10).map(field => (
                        <span
                          key={field}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {field}
                        </span>
                      ))}
                      {dataset.data.fields.length > 10 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          +{dataset.data.fields.length - 10} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <TableCellsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No hay datasets cargados</p>
          <p className="text-xs mt-1">Carga tu primer archivo CSV para comenzar</p>
        </div>
      )}

      {/* Summary */}
      {datasets.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resumen
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Total de datasets: {datasets.length}</p>
            <p>• Dataset activo: {datasets.find(d => d.isActive)?.name || 'Ninguno'}</p>
            <p>• Total de registros: {datasets.reduce((sum, d) => sum + d.data.rows.length, 0)}</p>
          </div>
        </div>
      )}
    </div>
  )
}