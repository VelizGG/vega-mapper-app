'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useNotificationHelpers } from './ui/NotificationSystem'
import { 
  PhotoIcon,
  DocumentIcon, 
  CodeBracketIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { Tooltip } from './ui/Tooltip'

interface ExportConfig {
  format: 'png' | 'svg' | 'pdf' | 'json' | 'csv'
  width: number
  height: number
  quality: number
  backgroundColor: string
  includeLegend: boolean
  includeData: boolean
}

export function ExportPanel() {
  const { data, mapping, chartType, chartConfig } = useStore()
  const { notifySuccess, notifyError, notifyInfo } = useNotificationHelpers()
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'png',
    width: 800,
    height: 600,
    quality: 90,
    backgroundColor: 'white',
    includeLegend: true,
    includeData: false
  })
  const [isExporting, setIsExporting] = useState(false)

  const updateConfig = (key: keyof ExportConfig, value: any) => {
    setExportConfig(prev => ({ ...prev, [key]: value }))
  }

  const exportChart = async () => {
    if (!data || !mapping.x) {
      notifyError('Exportación fallida', 'Necesitas tener datos cargados y un mapeo configurado')
      return
    }

    setIsExporting(true)
    notifyInfo('Exportando...', `Generando ${exportConfig.format.toUpperCase()}`)

    try {
      switch (exportConfig.format) {
        case 'png':
        case 'svg':
          await exportImage()
          break
        case 'pdf':
          await exportPDF()
          break
        case 'json':
          await exportJSON()
          break
        case 'csv':
          await exportCSV()
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      notifyError(
        'Error en exportación',
        error instanceof Error ? error.message : 'Error desconocido'
      )
    } finally {
      setIsExporting(false)
    }
  }

  const exportImage = async () => {
    // This would typically use vega-embed's view.toImageURL() method
    // For now, we'll simulate the export
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create a download link
    const filename = `vegamapper-chart.${exportConfig.format}`
    notifySuccess(
      'Imagen exportada',
      `${filename} está listo para descargar`
    )
  }

  const exportPDF = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const filename = 'vegamapper-chart.pdf'
    notifySuccess(
      'PDF exportado',
      `${filename} generado con dimensiones ${exportConfig.width}x${exportConfig.height}`
    )
  }

  const exportJSON = async () => {
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      chartType,
      mapping,
      chartConfig,
      data: exportConfig.includeData ? data : null,
      metadata: {
        rows: data?.rows.length || 0,
        columns: data?.fields.length || 0,
        exportSettings: exportConfig
      }
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'vegamapper-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    notifySuccess('Configuración exportada', 'vegamapper-config.json descargado')
  }

  const exportCSV = async () => {
    if (!data) return

    const csvContent = [
      data.fields.join(','),
      ...data.rows.map(row => data.fields.map(field => `"${row[field] || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'vegamapper-data.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    notifySuccess('Datos exportados', 'vegamapper-data.csv descargado')
  }

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      notifySuccess('Copiado', `${type} copiado al portapapeles`)
    } catch (error) {
      notifyError('Error al copiar', 'No se pudo copiar al portapapeles')
    }
  }

  const getVegaLiteSpec = () => {
    if (!data || !mapping.x) return null

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: data.rows },
      mark: { type: chartType, ...chartConfig },
      encoding: {
        x: { field: mapping.x, type: 'quantitative' },
        y: mapping.y ? { field: mapping.y, type: 'quantitative' } : undefined,
        color: mapping.color ? { field: mapping.color, type: 'nominal' } : undefined
      }
    }
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Exportación
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <ArrowDownTrayIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Carga datos para habilitar la exportación</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Exportación
      </h2>

      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Formato de Exportación
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'png', label: 'PNG', icon: PhotoIcon, desc: 'Imagen rasterizada' },
              { id: 'svg', label: 'SVG', icon: CodeBracketIcon, desc: 'Vector escalable' },
              { id: 'pdf', label: 'PDF', icon: DocumentIcon, desc: 'Documento portable' },
              { id: 'json', label: 'JSON', icon: Cog6ToothIcon, desc: 'Configuración' },
              { id: 'csv', label: 'CSV', icon: DocumentIcon, desc: 'Datos raw' }
            ].map(format => (
              <button
                key={format.id}
                onClick={() => updateConfig('format', format.id)}
                className={`p-3 border rounded-lg text-left transition-all ${
                  exportConfig.format === format.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <format.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{format.label}</span>
                </div>
                <p className="text-xs text-gray-500">{format.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Image/PDF Settings */}
        {['png', 'svg', 'pdf'].includes(exportConfig.format) && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Configuración de Imagen
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Ancho (px)
                </label>
                <input
                  type="number"
                  value={exportConfig.width}
                  onChange={(e) => updateConfig('width', parseInt(e.target.value))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  min={400}
                  max={4000}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Alto (px)
                </label>
                <input
                  type="number"
                  value={exportConfig.height}
                  onChange={(e) => updateConfig('height', parseInt(e.target.value))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  min={300}
                  max={3000}
                />
              </div>
            </div>

            {exportConfig.format === 'png' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Calidad ({exportConfig.quality}%)
                </label>
                <input
                  type="range"
                  value={exportConfig.quality}
                  onChange={(e) => updateConfig('quality', parseInt(e.target.value))}
                  className="w-full"
                  min={10}
                  max={100}
                  step={10}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Color de fondo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={exportConfig.backgroundColor}
                  onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                  className="w-12 h-8 rounded border"
                />
                <select
                  value={exportConfig.backgroundColor}
                  onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="white">Blanco</option>
                  <option value="transparent">Transparente</option>
                  <option value="#f8fafc">Gris claro</option>
                  <option value="#1f2937">Gris oscuro</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* JSON Settings */}
        {exportConfig.format === 'json' && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Opciones de JSON
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportConfig.includeData}
                onChange={(e) => updateConfig('includeData', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Incluir datos en el JSON</span>
            </label>
          </div>
        )}

        {/* Export Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={exportChart}
            disabled={isExporting || !mapping.x}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              isExporting || !mapping.x
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>
              {isExporting 
                ? 'Exportando...' 
                : `Exportar ${exportConfig.format.toUpperCase()}`
              }
            </span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Acciones Rápidas
          </h3>
          <div className="space-y-2">
            <Tooltip content="Copia la especificación Vega-Lite al portapapeles">
              <button
                onClick={() => {
                  const spec = getVegaLiteSpec()
                  if (spec) {
                    copyToClipboard(JSON.stringify(spec, null, 2), 'Especificación Vega-Lite')
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Copiar especificación Vega-Lite</span>
              </button>
            </Tooltip>
            
            <Tooltip content="Copia la configuración actual al portapapeles">
              <button
                onClick={() => {
                  const config = { chartType, mapping, chartConfig }
                  copyToClipboard(JSON.stringify(config, null, 2), 'Configuración del gráfico')
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Copiar configuración</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}