'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

// Importación dinámica de Vega-Embed para evitar problemas SSR
let vegaEmbed: any = null

export function ChartCanvas() {
  const { data, mapping, chartType } = useStore()
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
      renderer: 'svg'
    }).catch((error: any) => {
      console.error('Error rendering chart:', error)
      setError('Error renderizando el gráfico')
    })

  }, [data, mapping, chartType, vegaEmbed, isLoading])

  const generateVegaLiteSpec = () => {
    if (!data || !mapping.x) return null

    const baseSpec: any = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: data.rows },
      width: 600,
      height: 400,
      padding: 20
    }

    const encoding: any = {
      x: {
        field: mapping.x,
        type: inferFieldType(mapping.x),
        title: mapping.x
      }
    }

    // Add Y encoding if available
    if (mapping.y) {
      encoding.y = {
        field: mapping.y,
        type: inferFieldType(mapping.y),
        title: mapping.y
      }
    }

    // Add optional encodings
    if (mapping.color) {
      encoding.color = {
        field: mapping.color,
        type: inferFieldType(mapping.color),
        title: mapping.color
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

    // Generate mark based on chart type
    let mark: any
    switch (chartType) {
      case 'scatter':
        mark = { 
          type: 'point',
          size: 100,
          opacity: 0.7
        }
        break
      case 'line':
        mark = { 
          type: 'line',
          point: true,
          strokeWidth: 2
        }
        break
      case 'bar':
        mark = { 
          type: 'bar',
          opacity: 0.8
        }
        break
      case 'area':
        mark = { 
          type: 'area',
          opacity: 0.6
        }
        break
      case 'histogram':
        mark = { type: 'bar' }
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
          <div className="text-6xl mb-4">⚡</div>
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
          <div className="text-6xl mb-4">❌</div>
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
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Visualización
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Gráfico de {chartType}</span>
          <span>•</span>
          <span>{data.rows.length} registros</span>
        </div>
      </div>
      
      <div 
        ref={chartRef} 
        className="w-full min-h-[500px] flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg"
      />
    </div>
  )
}