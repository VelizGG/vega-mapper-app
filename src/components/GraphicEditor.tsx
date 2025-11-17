'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// Definir interfaces para mejor tipado
interface ChartProperty {
  id: string
  label: string
  description: string
  type: 'select' | 'color' | 'number' | 'text' | 'boolean'
  options?: string[]
  default?: any
  min?: number
  max?: number
  step?: number
}

const CHART_PROPERTIES: Record<string, ChartProperty[]> = {
  scatter: [
    { id: 'pointSize', label: 'Tamaño de punto', description: 'Tamaño base de los puntos', type: 'number', default: 50, min: 10, max: 200, step: 10 },
    { id: 'pointOpacity', label: 'Opacidad', description: 'Transparencia de los puntos', type: 'number', default: 0.8, min: 0, max: 1, step: 0.1 },
    { id: 'pointShape', label: 'Forma', description: 'Forma de los puntos', type: 'select', options: ['circle', 'square', 'triangle-up', 'diamond'], default: 'circle' },
    { id: 'showGrid', label: 'Mostrar cuadrícula', description: 'Mostrar líneas de cuadrícula', type: 'boolean', default: true }
  ],
  line: [
    { id: 'lineWidth', label: 'Grosor de línea', description: 'Grosor de las líneas', type: 'number', default: 2, min: 1, max: 10, step: 1 },
    { id: 'lineColor', label: 'Color de línea', description: 'Color principal de la línea', type: 'color', default: '#3b82f6' },
    { id: 'showPoints', label: 'Mostrar puntos', description: 'Mostrar puntos en la línea', type: 'boolean', default: false },
    { id: 'interpolation', label: 'Interpolación', description: 'Tipo de interpolación', type: 'select', options: ['linear', 'step', 'step-before', 'step-after', 'basis', 'cardinal', 'monotone'], default: 'linear' }
  ],
  bar: [
    { id: 'barColor', label: 'Color de barras', description: 'Color de las barras', type: 'color', default: '#3b82f6' },
    { id: 'barOpacity', label: 'Opacidad', description: 'Transparencia de las barras', type: 'number', default: 0.8, min: 0, max: 1, step: 0.1 },
    { id: 'barCornerRadius', label: 'Esquinas redondeadas', description: 'Radio de las esquinas', type: 'number', default: 0, min: 0, max: 20, step: 1 },
    { id: 'showValues', label: 'Mostrar valores', description: 'Mostrar valores en las barras', type: 'boolean', default: false }
  ],
  area: [
    { id: 'areaOpacity', label: 'Opacidad del área', description: 'Transparencia del área', type: 'number', default: 0.3, min: 0, max: 1, step: 0.1 },
    { id: 'areaColor', label: 'Color del área', description: 'Color de relleno del área', type: 'color', default: '#3b82f6' },
    { id: 'showLine', label: 'Mostrar línea', description: 'Mostrar línea del borde', type: 'boolean', default: true },
    { id: 'lineWidth', label: 'Grosor de línea', description: 'Grosor de la línea del borde', type: 'number', default: 2, min: 1, max: 10, step: 1 }
  ]
}

export function GraphicEditor() {
  const { chartType, data, mapping, chartConfig, setChartConfig } = useStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appearance: true,
    axes: false,
    legend: false,
    interaction: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateProperty = (propertyId: string, value: any) => {
    setChartConfig({
      ...chartConfig,
      [propertyId]: value
    } as any)
  }

  const renderPropertyControl = (property: ChartProperty) => {
    const currentValue = (chartConfig as any)[property.id] ?? property.default

    switch (property.type) {
      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={currentValue}
              onChange={(e) => updateProperty(property.id, e.target.value)}
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              aria-label={`Seleccionar color para ${property.label}`}
            />
            <input
              type="text"
              value={currentValue}
              onChange={(e) => updateProperty(property.id, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        )

      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              value={currentValue}
              onChange={(e) => updateProperty(property.id, parseFloat(e.target.value))}
              min={property.min}
              max={property.max}
              step={property.step}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label={`Ajustar ${property.label}`}
            />
            <input
              type="number"
              value={currentValue}
              onChange={(e) => updateProperty(property.id, parseFloat(e.target.value))}
              min={property.min}
              max={property.max}
              step={property.step}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => updateProperty(property.id, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            aria-label={`Seleccionar ${property.label}`}
          >
            {property.options?.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        )

      case 'boolean':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue}
              onChange={(e) => updateProperty(property.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-describedby={`${property.id}-description`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentValue ? 'Activado' : 'Desactivado'}
            </span>
          </label>
        )

      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => updateProperty(property.id, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder={property.label}
            aria-label={property.label}
          />
        )
    }
  }

  const properties = CHART_PROPERTIES[chartType] || []

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Editor de Gráficos
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>Carga primero un archivo CSV para comenzar la edición</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Editor de Gráficos
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Sección de Apariencia */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => toggleSection('appearance')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            aria-expanded={expandedSections.appearance}
          >
            <span className="font-medium text-gray-800 dark:text-white">
              Apariencia
            </span>
            {expandedSections.appearance ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.appearance && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 space-y-4">
              {properties.map(property => (
                <div key={property.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {property.label}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                      ({property.description})
                    </span>
                  </label>
                  {renderPropertyControl(property)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Ejes */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => toggleSection('axes')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            aria-expanded={expandedSections.axes}
          >
            <span className="font-medium text-gray-800 dark:text-white">
              Configuración de Ejes
            </span>
            {expandedSections.axes ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.axes && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título Eje X
                </label>
                <input
                  type="text"
                  value={chartConfig.xAxisTitle || ''}
                  onChange={(e) => updateProperty('xAxisTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Título del eje X"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título Eje Y
                </label>
                <input
                  type="text"
                  value={chartConfig.yAxisTitle || ''}
                  onChange={(e) => updateProperty('yAxisTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Título del eje Y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sección de Leyenda */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => toggleSection('legend')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            aria-expanded={expandedSections.legend}
          >
            <span className="font-medium text-gray-800 dark:text-white">
              Leyenda y Títulos
            </span>
            {expandedSections.legend ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.legend && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título del Gráfico
                </label>
                <input
                  type="text"
                  value={chartConfig.title || ''}
                  onChange={(e) => updateProperty('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Título del gráfico"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartConfig.showLegend ?? true}
                    onChange={(e) => updateProperty('showLegend', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrar leyenda
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vista previa rápida */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Configuración Actual
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Tipo:</strong> {chartType}</p>
          <p><strong>Propiedades activas:</strong> {Object.keys(chartConfig).length}</p>
        </div>
      </div>
    </div>
  )
}