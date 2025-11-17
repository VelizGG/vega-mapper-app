'use client'
import { useStore } from '../store/useStore'

const chartTypes = [
  { 
    id: 'scatter', 
    name: 'Dispersión', 
    description: 'Relación entre dos variables numéricas',
    icon: '⬟'
  },
  { 
    id: 'line', 
    name: 'Líneas', 
    description: 'Tendencias en el tiempo',
    icon: '📈'
  },
  { 
    id: 'bar', 
    name: 'Barras', 
    description: 'Comparación de categorías',
    icon: '📊'
  },
  { 
    id: 'area', 
    name: 'Área', 
    description: 'Volumen en el tiempo',
    icon: '📈'
  },
  { 
    id: 'histogram', 
    name: 'Histograma', 
    description: 'Distribución de frecuencias',
    icon: '📋'
  },
  { 
    id: 'box', 
    name: 'Caja', 
    description: 'Distribución estadística',
    icon: '⬛'
  },
  { 
    id: 'heatmap', 
    name: 'Mapa de Calor', 
    description: 'Correlación entre variables',
    icon: '🌡️'
  }
]

export function ChartTypeSelector() {
  const { chartType, setChartType } = useStore()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Tipo de Gráfico
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {chartTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setChartType(type.id as any)}
            className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              chartType === type.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl">{type.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {type.name}
                </p>
                <p className={`text-xs mt-1 ${
                  chartType === type.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 <strong>Tip:</strong> Cada tipo de gráfico requiere diferentes tipos de datos. 
          Asegúrate de mapear las variables correctas en la sección de mapping.
        </p>
      </div>
    </div>
  )
}