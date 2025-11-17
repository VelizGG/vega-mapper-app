'use client'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { ChevronDownIcon, ChevronUpIcon, FunnelIcon } from '@heroicons/react/24/outline'

export function DataTransformPanel() {
  const { data, chartConfig, setChartConfig } = useStore()
  const [showFilters, setShowFilters] = useState(false)
  const [tempFilters, setTempFilters] = useState<Record<string, string>>({})

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Transformación de Datos
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>Carga primero un archivo CSV para comenzar</p>
        </div>
      </div>
    )
  }

  const updateConfig = (key: keyof typeof chartConfig, value: any) => {
    setChartConfig({
      ...chartConfig,
      [key]: value || undefined
    })
  }

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...tempFilters, [field]: value }
    if (!value) {
      delete newFilters[field]
    }
    setTempFilters(newFilters)
    updateConfig('filters', Object.keys(newFilters).length > 0 ? newFilters : undefined)
  }

  const getFieldType = (fieldName: string) => {
    const sampleValue = data.rows[0]?.[fieldName]
    if (typeof sampleValue === 'number') return 'number'
    if (typeof sampleValue === 'string') {
      // Check if it's a date
      const dateValue = new Date(sampleValue)
      if (!isNaN(dateValue.getTime())) return 'date'
      return 'string'
    }
    return 'string'
  }

  const getUniqueValues = (fieldName: string) => {
    const values = data.rows.map(row => row[fieldName]).filter(v => v != null)
    return [...new Set(values)].sort().slice(0, 20) // Limit to first 20 unique values
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Transformación de Datos
      </h2>

      <div className="space-y-6">
        {/* Ordenamiento */}
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Ordenamiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por campo
              </label>
              <select
                value={chartConfig.sortField || ''}
                onChange={(e) => updateConfig('sortField', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                aria-label="Seleccionar campo para ordenar"
              >
                <option value="">Sin ordenar</option>
                {data.fields.map(field => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            
            {chartConfig.sortField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Orden
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateConfig('sortOrder', 'asc')}
                    className={`flex-1 flex items-center justify-center p-2 border rounded-lg transition-colors ${
                      chartConfig.sortOrder === 'asc'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    aria-pressed={chartConfig.sortOrder === 'asc'}
                    aria-label="Ordenar ascendente"
                  >
                    <ChevronUpIcon className="w-4 h-4 mr-1" />
                    Ascendente
                  </button>
                  <button
                    onClick={() => updateConfig('sortOrder', 'desc')}
                    className={`flex-1 flex items-center justify-center p-2 border rounded-lg transition-colors ${
                      chartConfig.sortOrder === 'desc'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    aria-pressed={chartConfig.sortOrder === 'desc'}
                    aria-label="Ordenar descendente"
                  >
                    <ChevronDownIcon className="w-4 h-4 mr-1" />
                    Descendente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agrupación */}
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Agrupación y Agregación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agrupar por
              </label>
              <select
                value={chartConfig.groupBy || ''}
                onChange={(e) => updateConfig('groupBy', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                aria-label="Seleccionar campo para agrupar"
              >
                <option value="">Sin agrupar</option>
                {data.fields.filter(field => getFieldType(field) === 'string').map(field => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            
            {chartConfig.groupBy && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Función de agregación
                </label>
                <select
                  value={chartConfig.aggregation || 'count'}
                  onChange={(e) => updateConfig('aggregation', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  aria-label="Seleccionar función de agregación"
                >
                  <option value="count">Contar</option>
                  <option value="sum">Sumar</option>
                  <option value="avg">Promedio</option>
                  <option value="min">Mínimo</option>
                  <option value="max">Máximo</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Filtros
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              aria-expanded={showFilters}
              aria-label="Mostrar/ocultar filtros"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} filtros</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              {data.fields.map(field => {
                const fieldType = getFieldType(field)
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filtrar {field}
                    </label>
                    
                    {fieldType === 'string' ? (
                      <select
                        value={tempFilters[field] || ''}
                        onChange={(e) => handleFilterChange(field, e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        aria-label={`Filtrar por ${field}`}
                      >
                        <option value="">Todos los valores</option>
                        {getUniqueValues(field).map(value => (
                          <option key={String(value)} value={String(value)}>
                            {String(value)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={fieldType === 'number' ? 'number' : 'text'}
                        value={tempFilters[field] || ''}
                        onChange={(e) => handleFilterChange(field, e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder={`Valor para ${field}`}
                        aria-label={`Filtrar por ${field}`}
                      />
                    )}
                  </div>
                )
              })}
              
              {Object.keys(tempFilters).length > 0 && (
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setTempFilters({})
                      updateConfig('filters', undefined)
                    }}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de transformaciones activas */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          Transformaciones Activas
        </h4>
        <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          {chartConfig.sortField && (
            <p>• Ordenado por: {chartConfig.sortField} ({chartConfig.sortOrder || 'asc'})</p>
          )}
          {chartConfig.groupBy && (
            <p>• Agrupado por: {chartConfig.groupBy} ({chartConfig.aggregation || 'count'})</p>
          )}
          {chartConfig.filters && Object.keys(chartConfig.filters).length > 0 && (
            <p>• Filtros activos: {Object.keys(chartConfig.filters).length}</p>
          )}
          {!chartConfig.sortField && !chartConfig.groupBy && (!chartConfig.filters || Object.keys(chartConfig.filters).length === 0) && (
            <p>• Sin transformaciones aplicadas</p>
          )}
        </div>
      </div>
    </div>
  )
}