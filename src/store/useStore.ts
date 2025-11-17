import { create } from 'zustand'

export type ParsedTable = {
  fields: string[]
  rows: Record<string, any>[]
}

export type Dataset = {
  id: string
  name: string
  data: ParsedTable
  uploadedAt: Date
  fileSize?: number
}

export type Mapping = {
  x?: string
  y?: string
  color?: string
  size?: string
  opacity?: string
  shape?: string
}

export type ChartConfig = {
  // Appearance properties
  pointSize?: number
  pointOpacity?: number
  pointShape?: string
  showGrid?: boolean
  lineWidth?: number
  lineColor?: string
  showPoints?: boolean
  interpolation?: string
  barColor?: string
  barOpacity?: number
  barCornerRadius?: number
  showValues?: boolean
  areaOpacity?: number
  areaColor?: string
  showLine?: boolean
  
  // Axes properties
  xAxisTitle?: string
  yAxisTitle?: string
  
  // Legend properties
  title?: string
  showLegend?: boolean
  
  // Data transformation
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  groupBy?: string
  aggregation?: 'sum' | 'count' | 'avg' | 'min' | 'max'
  filters?: Record<string, any>
}

type State = {
  // Multi-dataset support
  datasets: Dataset[]
  activeDatasetId?: string
  
  // Current active data (computed from active dataset)
  data?: ParsedTable
  fields: string[]
  
  // Chart configuration
  mapping: Mapping
  chartType: string
  chartConfig: ChartConfig
  
  // Actions
  addDataset: (dataset: Dataset) => void
  removeDataset: (id: string) => void
  setActiveDataset: (id: string) => void
  setMapping: (m: Mapping) => void
  setChartType: (t: string) => void
  setChartConfig: (c: ChartConfig) => void
  
  // Legacy support
  setData: (d: ParsedTable) => void
}

export const useStore = create<State>((set, get) => ({
  datasets: [],
  activeDatasetId: undefined,
  data: undefined,
  fields: [],
  mapping: {},
  chartType: 'scatter',
  chartConfig: {},
  
  addDataset: (dataset) => {
    set((state) => {
      const newDatasets = [...state.datasets, dataset]
      const newActiveDatasetId = dataset.id
      return {
        datasets: newDatasets,
        activeDatasetId: newActiveDatasetId,
        data: dataset.data,
        fields: dataset.data.fields
      }
    })
    
    try {
      const state = get()
      localStorage.setItem('vega-mapper:datasets', JSON.stringify(state.datasets))
      localStorage.setItem('vega-mapper:active-dataset', dataset.id)
    } catch (e) {}
  },
  
  removeDataset: (id) => {
    set((state) => {
      const newDatasets = state.datasets.filter(d => d.id !== id)
      let newActiveDatasetId = state.activeDatasetId
      let newData = state.data
      let newFields = state.fields
      
      if (state.activeDatasetId === id) {
        const firstDataset = newDatasets[0]
        newActiveDatasetId = firstDataset?.id
        newData = firstDataset?.data
        newFields = firstDataset?.data?.fields || []
      }
      
      return {
        datasets: newDatasets,
        activeDatasetId: newActiveDatasetId,
        data: newData,
        fields: newFields
      }
    })
    
    try {
      const state = get()
      localStorage.setItem('vega-mapper:datasets', JSON.stringify(state.datasets))
      if (state.activeDatasetId) {
        localStorage.setItem('vega-mapper:active-dataset', state.activeDatasetId)
      } else {
        localStorage.removeItem('vega-mapper:active-dataset')
      }
    } catch (e) {}
  },
  
  setActiveDataset: (id) => {
    set((state) => {
      const dataset = state.datasets.find(d => d.id === id)
      if (!dataset) return state
      
      return {
        activeDatasetId: id,
        data: dataset.data,
        fields: dataset.data.fields
      }
    })
    
    try {
      localStorage.setItem('vega-mapper:active-dataset', id)
    } catch (e) {}
  },
  
  setMapping: (m) => {
    set({ mapping: m })
    try {
      localStorage.setItem('vega-mapper:mapping', JSON.stringify(m))
    } catch (e) {}
  },
  
  setChartType: (t) => set({ chartType: t }),
  
  setChartConfig: (c) => {
    set({ chartConfig: c })
    try {
      localStorage.setItem('vega-mapper:chart-config', JSON.stringify(c))
    } catch (e) {}
  },
  
  // Legacy support for existing components
  setData: (d) => {
    const dataset: Dataset = {
      id: `dataset-${Date.now()}`,
      name: `Dataset ${Date.now()}`,
      data: d,
      uploadedAt: new Date()
    }
    
    get().addDataset(dataset)
  }
}))