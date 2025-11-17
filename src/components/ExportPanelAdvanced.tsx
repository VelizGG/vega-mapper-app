'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { 
  DocumentArrowDownIcon, 
  PhotoIcon, 
  DocumentIcon,
  CogIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { Tooltip } from './ui/Tooltip'

type ExportFormat = 'png' | 'svg' | 'pdf' | 'json-config' | 'json-data' | 'csv'

interface ExportConfig {
  format: ExportFormat
  quality: 'low' | 'medium' | 'high'
  width: number
  height: number
  includeData: boolean
}

export function ExportPanelAdvanced() {
  const { data, mapping, chartType, chartConfig, activeDatasetId, datasets } = useStore()
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'png',
    quality: 'high',
    width: 800,
    height: 600,
    includeData: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string>('')

  const activeDataset = datasets.find(d => d.id === activeDatasetId)

  const exportFormats = [
    { 
      id: 'png', 
      label: 'PNG Image', 
      description: 'Imagen de alta calidad',
      icon: PhotoIcon
    },
    { 
      id: 'svg', 
      label: 'SVG Vector', 
      description: 'Gráfico vectorial escalable',
      icon: DocumentIcon
    },
    { 
      id: 'json-config', 
      label: 'Configuration JSON', 
      description: 'Configuración del gráfico',
      icon: CogIcon
    },
    { 
      id: 'json-data', 
      label: 'Data JSON', 
      description: 'Datos en formato JSON',
      icon: ClipboardDocumentIcon
    },
    { 
      id: 'csv', 
      label: 'CSV Data', 
      description: 'Datos en formato CSV',
      icon: DocumentArrowDownIcon
    }
  ]

  const updateExportConfig = (key: keyof ExportConfig, value: any) => {
    setExportConfig(prev => ({ ...prev, [key]: value }))
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateFileName = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const baseName = `vegamapper-${chartType}-${timestamp}`
    
    switch (exportConfig.format) {
      case 'png': return `${baseName}.png`
      case 'svg': return `${baseName}.svg`
      case 'json-config': return `${baseName}-config.json`
      case 'json-data': return `${baseName}-data.json`
      case 'csv': return `${baseName}-data.csv`
      default: return `${baseName}.${exportConfig.format}`
    }
  }

  const handleExport = async () => {
    if (!data && !['json-config'].includes(exportConfig.format)) {
      setExportStatus('No hay datos para exportar')
      return
    }

    setIsExporting(true)
    setExportStatus('Generando exportación...')

    try {
      let blob: Blob

      switch (exportConfig.format) {
        case 'json-config':
          const configData = {
            chartType,
            mapping,
            chartConfig,
            exportedAt: new Date().toISOString(),
            version: '1.0',
            ...(exportConfig.includeData && data && { data })
          }
          blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
          break

        case 'json-data':
          if (!data) throw new Error('No hay datos para exportar')
          const exportData = {
            dataset: activeDataset?.name || 'dataset',
            fields: data.fields,
            rows: data.rows,
            exportedAt: new Date().toISOString(),
            totalRows: data.rows.length
          }
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          break

        case 'csv':
          if (!data) throw new Error('No hay datos para exportar')
          const headers = data.fields.join(',')
          const rows = data.rows.map(row => 
            data.fields.map(field => {
              const value = row[field]
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            }).join(',')
          )
          const csvContent = [headers, ...rows].join('\n')
          blob = new Blob([csvContent], { type: 'text/csv' })
          break

        case 'png':
        case 'svg':
          setExportStatus('Usa el botón de exportar del gráfico de Vega-Lite para imágenes')
          setTimeout(() => setExportStatus(''), 3000)
          setIsExporting(false)
          return

        default:
          throw new Error(`Formato no soportado: ${exportConfig.format}`)
      }

      const filename = generateFileName()
      downloadBlob(blob, filename)
      setExportStatus(`Exportado como ${filename}`)
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(''), 3000)
    }
  }

  const selectedFormat = exportFormats.find(f => f.id === exportConfig.format)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Exportar Visualización
      </h2>

      {/* Format Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Formato de Exportación
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {exportFormats.map((format) => {
            const Icon = format.icon
            return (
              <button
                key={format.id}
                onClick={() => updateExportConfig('format', format.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  exportConfig.format === format.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
                aria-pressed={exportConfig.format === format.id}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-800 dark:text-white">
                      {format.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* JSON-config specific options */}
      {exportConfig.format === 'json-config' && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Opciones de Configuración
          </h4>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={exportConfig.includeData}
              onChange={(e) => updateExportConfig('includeData', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Incluir datos en la configuración
            </span>
          </label>
        </div>
      )}

      {/* Export Status */}
      {exportStatus && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">{exportStatus}</p>
        </div>
      )}

      {/* Export Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedFormat && (
            <p>Exportar como {selectedFormat.label}</p>
          )}
          {data && (
            <p className="text-xs mt-1">
              {data.rows.length} filas • {data.fields.length} columnas
            </p>
          )}
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting || (!data && exportConfig.format !== 'json-config')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Exportar</span>
            </>
          )}
        </button>
      </div>

      {/* Note about image exports */}
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          💡 <strong>Tip:</strong> Para exportar imágenes PNG/SVG, usa las opciones de exportación 
          que aparecen en la esquina superior derecha del gráfico de Vega-Lite.
        </p>
      </div>

      {/* Export Info */}
      {selectedFormat && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Información de Exportación
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>Formato: {selectedFormat.label}</p>
            {activeDataset && (
              <p>Dataset: {activeDataset.name}</p>
            )}
            <p>Archivo: {generateFileName()}</p>
          </div>
        </div>
      )}
    </div>
  )
}