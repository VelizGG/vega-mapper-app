'use client'
import { useStore } from '../store/useStore'

const mappingOptions = {
  x: { label: 'Eje X', description: 'Variable horizontal' },
  y: { label: 'Eje Y', description: 'Variable vertical' },
  color: { label: 'Color', description: 'Variable para color' },
  size: { label: 'Tamaño', description: 'Variable para tamaño' },
  opacity: { label: 'Opacidad', description: 'Variable para transparencia' },
  shape: { label: 'Forma', description: 'Variable para forma' },
}

export function MappingSidebar() {
  const { data, mapping, setMapping, chartType } = useStore()

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Mapeo de Variables
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>Carga primero un archivo CSV para comenzar el mapeo</p>
        </div>
      </div>
    )
  }

  const getRequiredMappings = () => {
    switch (chartType) {
      case 'scatter':
      case 'line':
        return ['x', 'y']
      case 'bar':
      case 'histogram':
        return ['x', 'y']
      case 'area':
        return ['x', 'y']
      case 'box':
        return ['y']
      case 'heatmap':
        return ['x', 'y']
      default:
        return ['x', 'y']
    }
  }

  const getOptionalMappings = () => {
    switch (chartType) {
      case 'scatter':
        return ['color', 'size', 'opacity', 'shape']
      case 'line':
      case 'area':
        return ['color', 'opacity']
      case 'bar':
        return ['color', 'opacity']
      case 'box':
        return ['x', 'color']
      case 'heatmap':
        return ['color']
      default:
        return ['color']
    }
  }

  const requiredMappings = getRequiredMappings()
  const optionalMappings = getOptionalMappings()

  const handleMappingChange = (key: string, value: string) => {
    setMapping({ ...mapping, [key]: value || undefined })
  }

  const isValidMapping = () => {
    return requiredMappings.every(key => mapping[key as keyof typeof mapping])
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Mapeo de Variables
        </h2>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isValidMapping() 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {isValidMapping() ? '✓ Completo' : '⚠ Incompleto'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Required Mappings */}
        {requiredMappings.map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mappingOptions[key as keyof typeof mappingOptions].label} *
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                ({mappingOptions[key as keyof typeof mappingOptions].description})
              </span>
            </label>
            <select
              value={mapping[key as keyof typeof mapping] || ''}
              onChange={(e) => handleMappingChange(key, e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar campo...</option>
              {data.fields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Optional Mappings */}
        {optionalMappings.length > 0 && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Mapeos Opcionales
              </h3>
            </div>
            {optionalMappings.map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {mappingOptions[key as keyof typeof mappingOptions].label}
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                    ({mappingOptions[key as keyof typeof mappingOptions].description})
                  </span>
                </label>
                <select
                  value={mapping[key as keyof typeof mapping] || ''}
                  onChange={(e) => handleMappingChange(key, e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin mapear</option>
                  {data.fields.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Data Preview */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vista Previa de Datos
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Campos disponibles:</strong> {data.fields.join(', ')}</p>
          <p><strong>Total de filas:</strong> {data.rows.length}</p>
        </div>
      </div>
    </div>
  )
}