'use client'
import { useStore } from '../store/useStore'

const chartTypes = [
  {
    id: 'scatter',
    name: 'Dispersión',
    description: 'Relación entre dos variables numéricas',
    icon: '⬟',
    ariaLabel: 'Gráfico de dispersión - Muestra la relación entre dos variables numéricas'
  },
  {
    id: 'line',
    name: 'Líneas',
    description: 'Tendencias en el tiempo',
    icon: '📈',
    ariaLabel: 'Gráfico de líneas - Ideal para mostrar tendencias a lo largo del tiempo'
  },
  {
    id: 'bar',
    name: 'Barras',
    description: 'Comparación de categorías',
    icon: '📊',
    ariaLabel: 'Gráfico de barras - Perfecto para comparar valores entre categorías'
  },
  {
    id: 'area',
    name: 'Área',
    description: 'Volumen en el tiempo',
    icon: '📈',
    ariaLabel: 'Gráfico de área - Muestra volúmenes y cambios a lo largo del tiempo'
  },
  {
    id: 'histogram',
    name: 'Histograma',
    description: 'Distribución de frecuencias',
    icon: '📋',
    ariaLabel: 'Histograma - Visualiza la distribución de frecuencias de los datos'
  },
  {
    id: 'box',
    name: 'Caja',
    description: 'Distribución estadística',
    icon: '⬛',
    ariaLabel: 'Diagrama de caja - Muestra la distribución estadística y valores atípicos'
  },
  {
    id: 'heatmap',
    name: 'Mapa de Calor',
    description: 'Correlación entre variables',
    icon: '🌡️',
    ariaLabel: 'Mapa de calor - Visualiza correlaciones e intensidades entre variables'
  }
]

export function ChartTypeSelector() {
  const { chartType, setChartType } = useStore()

  const handleChartTypeChange = (newType: string) => {
    setChartType(newType as any)
    // Announce the change for screen readers
    const announcement = `Tipo de gráfico cambiado a ${chartTypes.find(t => t.id === newType)?.name}`
    const announcer = document.getElementById('chart-type-announcer')
    if (announcer) {
      announcer.textContent = announcement
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, typeId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleChartTypeChange(typeId)
    }
  }

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      role="region"
      aria-labelledby="chart-type-heading"
    >
      <h2 
        id="chart-type-heading"
        className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Tipo de Gráfico
      </h2>

      {/* Screen reader announcements */}
      <div 
        id="chart-type-announcer" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>

      <fieldset>
        <legend className="sr-only">
          Selecciona el tipo de visualización para tus datos
        </legend>
        
        <div 
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-labelledby="chart-type-heading"
        >
          {chartTypes.map((type, index) => (
            <button
              key={type.id}
              onClick={() => handleChartTypeChange(type.id)}
              onKeyDown={(e) => handleKeyDown(e, type.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                chartType === type.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
              role="radio"
              aria-checked={chartType === type.id}
              aria-describedby={`chart-desc-${type.id}`}
              aria-label={type.ariaLabel}
              tabIndex={chartType === type.id ? 0 : -1}
            >
              <div className="flex items-start space-x-3">
                <span 
                  className="text-xl" 
                  aria-hidden="true"
                  role="img"
                  aria-label={type.icon}
                >
                  {type.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {type.name}
                    {chartType === type.id && (
                      <span className="sr-only"> (seleccionado)</span>
                    )}
                  </p>
                  <p 
                    id={`chart-desc-${type.id}`}
                    className={`text-xs mt-1 ${
                      chartType === type.id
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {type.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </fieldset>

      <div 
        className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        role="note"
        aria-labelledby="tip-heading"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span 
            id="tip-heading"
            className="font-semibold"
            aria-label="Consejo importante"
          >
            💡 Tip:
          </span>{' '}
          Cada tipo de gráfico requiere diferentes tipos de datos.
          Asegúrate de mapear las variables correctas en la sección de mapping.
        </p>
      </div>

      {/* Instructions for keyboard users */}
      <div className="sr-only">
        <p>
          Usa las teclas de flecha para navegar entre opciones de gráfico.
          Presiona Espacio o Enter para seleccionar un tipo de gráfico.
        </p>
      </div>
    </section>
  )
}