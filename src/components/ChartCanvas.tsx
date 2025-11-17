'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

// Importación dinámica de Vega-Embed para evitar problemas SSR
let vegaEmbed: any = null

export function ChartCanvas() {
  const { data, mapping, chartType, chartConfig } = useStore()
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar vega-embed dinámicamente en el cliente
    const loadVegaEmbed = async () => {
      try {
        const vegaEmbedModule = await import('vega-embed')
        vegaEmbed = vegaEmbedModule.default
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading vega-embed:', err)
        setError('Error cargando la librería de visualización')
        setIsLoading(false)
      }
    }

    loadVegaEmbed()
  }, [])

  useEffect(() => {
    if (!data || !chartRef.current || !mapping.x || !vegaEmbed || isLoading) return

    const spec = generateVegaLiteSpec()
    if (!spec) return

    setError(null)

    vegaEmbed(chartRef.current, spec, {
      actions: {
        export: true,
        source: true,
        compiled: true,
        editor: true
      },
      renderer: 'svg',
      tooltip: { theme: 'dark' }
    }).catch((error: any) => {
      console.error('Error rendering chart:', error)
      setError('Error renderizando el gráfico')
    })

  }, [data, mapping, chartType, chartConfig, vegaEmbed, isLoading])

  const applyDataTransformations = (rawData: any[]) => {
    let processedData = [...rawData]

    // Apply filters
    if (chartConfig.filters) {
      Object.entries(chartConfig.filters).forEach(([field, value]) => {
        if (value) {
          processedData = processedData.filter(row => {
            const fieldValue = row[field]
            if (typeof fieldValue === 'string') {
              return fieldValue.toLowerCase().includes(value.toLowerCase())
            }
            return fieldValue === value || fieldValue === Number(value)
          })
        }
      })
    }

    // Apply sorting
    if (chartConfig.sortField) {
      processedData.sort((a, b) => {
        const aVal = a[chartConfig.sortField!]
        const bVal = b[chartConfig.sortField!]
        
        let comparison = 0
        if (aVal < bVal) comparison = -1
        if (aVal > bVal) comparison = 1
        
        return chartConfig.sortOrder === 'desc' ? -comparison : comparison
      })
    }

    // Apply grouping and aggregation
    if (chartConfig.groupBy) {
      const grouped = processedData.reduce((acc, row) => {
        const groupKey = row[chartConfig.groupBy!]
        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(row)
        return acc
      }, {} as Record<string, any[]>)

      processedData = Object.entries(grouped).map(([groupKey, groupData]) => {
        const groupDataArray = groupData as any[]
        const result: any = { [chartConfig.groupBy!]: groupKey }
        
        if (chartConfig.aggregation && mapping.y) {
          const values = groupDataArray.map(row => row[mapping.y!]).filter(v => !isNaN(Number(v)))
          
          switch (chartConfig.aggregation) {
            case 'sum':
              result[mapping.y!] = values.reduce((sum, val) => sum + Number(val), 0)
              break
            case 'avg':
              result[mapping.y!] = values.length > 0 ? values.reduce((sum, val) => sum + Number(val), 0) / values.length : 0
              break
            case 'min':
              result[mapping.y!] = Math.min(...values.map(Number))
              break
            case 'max':
              result[mapping.y!] = Math.max(...values.map(Number))
              break
            case 'count':
            default:
              result[mapping.y!] = groupDataArray.length
              break
          }
        } else {
          result[mapping.y!] = groupDataArray.length
        }
        
        return result
      })
    }

    return processedData
  }

  const generateVegaLiteSpec = () => {
    if (!data || !mapping.x) return null

    const processedData = applyDataTransformations(data.rows)

    const baseSpec: any = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: processedData },
      width: 700,
      height: 450,
      padding: 20,
      background: 'transparent'
    }

    // Add title if configured
    if (chartConfig.title) {
      baseSpec.title = {
        text: chartConfig.title,
        fontSize: 16,
        fontWeight: 'bold'
      }
    }

    const encoding: any = {
      x: {
        field: mapping.x,
        type: inferFieldType(mapping.x),
        title: chartConfig.xAxisTitle || mapping.x,
        axis: {
          grid: chartConfig.showGrid ?? true
        }
      }
    }

    // Add Y encoding if available
    if (mapping.y) {
      encoding.y = {
        field: mapping.y,
        type: inferFieldType(mapping.y),
        title: chartConfig.yAxisTitle || mapping.y,
        axis: {
          grid: chartConfig.showGrid ?? true
        }
      }
    }

    // Add optional encodings
    if (mapping.color) {
      encoding.color = {
        field: mapping.color,
        type: inferFieldType(mapping.color),
        title: mapping.color,
        legend: chartConfig.showLegend ?? true ? undefined : null
      }
    }

    if (mapping.size) {
      encoding.size = {
        field: mapping.size,
        type: inferFieldType(mapping.size),
        title: mapping.size
      }
    }

    if (mapping.opacity) {
      encoding.opacity = {
        field: mapping.opacity,
        type: inferFieldType(mapping.opacity),
        title: mapping.opacity
      }
    }

    // Generate mark based on chart type with configuration
    let mark: any
    switch (chartType) {
      case 'scatter':
        mark = {
          type: 'point',
          size: chartConfig.pointSize || 100,
          opacity: chartConfig.pointOpacity || 0.7,
          shape: chartConfig.pointShape || 'circle'
        }
        break
      case 'line':
        mark = {
          type: 'line',
          point: chartConfig.showPoints ?? false,
          strokeWidth: chartConfig.lineWidth || 2,
          color: chartConfig.lineColor || '#3b82f6',
          interpolate: chartConfig.interpolation || 'linear'
        }
        break
      case 'bar':
        mark = {
          type: 'bar',
          opacity: chartConfig.barOpacity || 0.8,
          color: chartConfig.barColor || '#3b82f6',
          cornerRadius: chartConfig.barCornerRadius || 0
        }
        break
      case 'area':
        mark = {
          type: 'area',
          opacity: chartConfig.areaOpacity || 0.6,
          color: chartConfig.areaColor || '#3b82f6',
          line: chartConfig.showLine ?? true
        }
        if (chartConfig.showLine && chartConfig.lineWidth) {
          mark.strokeWidth = chartConfig.lineWidth
        }
        break
      case 'histogram':
        mark = { 
          type: 'bar',
          opacity: chartConfig.barOpacity || 0.8,
          color: chartConfig.barColor || '#3b82f6'
        }
        if (encoding.x) {
          encoding.x.bin = true
        }
        if (encoding.y) {
          encoding.y = { aggregate: 'count', title: 'Count' }
        }
        break
      case 'box':
        mark = {
          type: 'boxplot',
          extent: 'min-max'
        }
        break
      case 'heatmap':
        mark = { type: 'rect' }
        if (encoding.color) {
          encoding.color.scale = { scheme: 'blues' }
        }
        break
      default:
        mark = { type: 'point' }
    }

    // Add value labels if configured
    const layers = [{ mark, encoding }]
    
    if (chartConfig.showValues && (chartType === 'bar' || chartType === 'area')) {
      layers.push({
        mark: {
          type: 'text',
          align: 'center',
          baseline: 'bottom',
          dy: -5,
          fontSize: 10
        },
        encoding: {
          ...encoding,
          text: { field: mapping.y!, type: 'quantitative' as const }
        }
      })
    }

    if (layers.length > 1) {
      return {
        ...baseSpec,
        layer: layers
      }
    }

    return {
      ...baseSpec,
      mark,
      encoding
    }
  }

  const inferFieldType = (fieldName: string): 'quantitative' | 'ordinal' | 'nominal' | 'temporal' => {
    if (!data) return 'nominal'

    const sampleValues = data.rows.slice(0, 10).map(row => row[fieldName])

    // Check if it's a number
    const numericValues = sampleValues.filter(v => !isNaN(Number(v)) && v !== '' && v !== null)
    if (numericValues.length > sampleValues.length * 0.7) {
      return 'quantitative'
    }

    // Check if it's a date
    const dateValues = sampleValues.filter(v => {
      const date = new Date(v)
      return date instanceof Date && !isNaN(date.getTime())
    })
    if (dateValues.length > sampleValues.length * 0.7) {
      return 'temporal'
    }

    // Check if it's ordinal (numbers as strings or small set of values)
    const uniqueValues = new Set(sampleValues)
    if (uniqueValues.size < sampleValues.length * 0.5 && uniqueValues.size > 1) {
      return 'ordinal'
    }

    return 'nominal'
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">Sin datos</h3>
          <p>Carga un archivo CSV para comenzar a visualizar</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-medium mb-2">Cargando visualizador...</h3>
          <p>Preparando Vega-Lite</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <div className="text-6xl mb-4">⌫</div>
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!mapping.x) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium mb-2">Mapeo incompleto</h3>
          <p>Configura el mapeo de variables para generar el gráfico</p>
          <p className="text-sm mt-2">Ve a la pestaña "Mapeo" para comenzar</p>
        </div>
      </div>
    )
  }

  const processedData = applyDataTransformations(data.rows)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Visualización
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Gráfico de {chartType}</span>
          <span>•</span>
          <span>{processedData.length} de {data.rows.length} registros</span>
          {Object.keys(chartConfig).length > 0 && (
            <>
              <span>•</span>
              <span>{Object.keys(chartConfig).length} configuraciones</span>
            </>
          )}
        </div>
      </div>

      <div
        ref={chartRef}
        className="w-full min-h-[500px] flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        role="img"
        aria-label={`Gráfico de ${chartType} mostrando ${mapping.x} ${mapping.y ? `versus ${mapping.y}` : ''}`}
      />

      {/* Export options */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          💡 Tip: Usa los controles de arriba a la derecha del gráfico para exportar o ver código
        </div>
        {chartConfig.title && (
          <div>
            Título: "{chartConfig.title}"
          </div>
        )}
      </div>
    </div>
  )
}