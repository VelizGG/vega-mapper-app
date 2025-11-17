'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { parseCSV } from '../lib/parser'
import { TrashIcon, EyeIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { Tooltip } from './ui/Tooltip'

interface DataPreviewProps {
  dataset: any
  onClose: () => void
}

function DataPreview({ dataset, onClose }: DataPreviewProps) {
  const { data } = dataset
  const previewRows = data.rows.slice(0, 5)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Vista Previa: {dataset.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Cerrar vista previa"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Filas: {data.rows.length} | Columnas: {data.fields.length}</p>
          <p>Subido: {dataset.uploadedAt.toLocaleDateString()}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {data.fields.map((field: string) => (
                  <th
                    key={field}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row: any, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                  {data.fields.map((field: string) => (
                    <td
                      key={field}
                      className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-600"
                    >
                      {String(row[field] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.rows.length > 5 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Mostrando las primeras 5 filas de {data.rows.length} total
          </p>
        )}
      </div>
    </div>
  )
}

export function DatasetManager() {
  const { datasets, activeDatasetId, addDataset, removeDataset, setActiveDataset } = useStore()
  const [isUploading, setIsUploading] = useState(false)
  const [previewDataset, setPreviewDataset] = useState<any>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
          console.warn(`Archivo ${file.name} no es un CSV válido, omitiendo...`)
          continue
        }

        const parsedData = await parseCSV(file)
        
        const dataset = {
          id: `dataset-${Date.now()}-${i}`,
          name: file.name.replace('.csv', ''),
          data: parsedData,
          uploadedAt: new Date(),
          fileSize: file.size
        }

        addDataset(dataset)
      }
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setIsUploading(false)
      // Clear the input
      event.target.value = ''
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Desconocido'
    const kb = bytes / 1024
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gestión de Datasets
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Upload Area */}
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
        {isUploading ? (
          <LoadingSpinner message="Procesando archivos..." />
        ) : (
          <div className="space-y-3">
            <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <input
                type="file"
                id="multi-csv-upload"
                accept=".csv"
                onChange={handleFileUpload}
                multiple
                className="sr-only"
              />
              <label
                htmlFor="multi-csv-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Cargar CSV(s)
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Selecciona uno o múltiples archivos CSV
            </p>
          </div>
        )}
      </div>

      {/* Dataset List */}
      {datasets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <DocumentTextIcon className="w-12 h-12 mx-auto mb-3" />
          <p>No hay datasets cargados</p>
          <p className="text-sm">Carga uno o más archivos CSV para comenzar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`p-4 rounded-lg border transition-colors ${
                activeDatasetId === dataset.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveDataset(dataset.id)}
                      className={`font-medium text-sm truncate ${
                        activeDatasetId === dataset.id
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-800 dark:text-white hover:text-blue-600'
                      }`}
                      title={`Activar dataset: ${dataset.name}`}
                    >
                      {dataset.name}
                    </button>
                    {activeDatasetId === dataset.id && (
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{dataset.data.rows.length} filas</span>
                    <span>{dataset.data.fields.length} columnas</span>
                    <span>{formatFileSize(dataset.fileSize)}</span>
                    <span>{dataset.uploadedAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Tooltip content="Vista previa de datos">
                    <button
                      onClick={() => setPreviewDataset(dataset)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={`Vista previa de ${dataset.name}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Eliminar dataset">
                    <button
                      onClick={() => removeDataset(dataset.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      aria-label={`Eliminar ${dataset.name}`}
                      disabled={datasets.length === 1}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Dataset Info */}
      {activeDatasetId && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Dataset Activo
          </h4>
          {(() => {
            const activeDataset = datasets.find(d => d.id === activeDatasetId)
            if (!activeDataset) return null
            
            return (
              <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <p><strong>Nombre:</strong> {activeDataset.name}</p>
                <p><strong>Campos:</strong> {activeDataset.data.fields.join(', ')}</p>
                <p><strong>Registros:</strong> {activeDataset.data.rows.length}</p>
              </div>
            )
          })()}
        </div>
      )}

      {/* Data Preview Modal */}
      {previewDataset && (
        <DataPreview
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
        />
      )}
    </div>
  )
}