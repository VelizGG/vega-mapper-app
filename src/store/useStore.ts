import { create } from 'zustand'

export type ParsedTable = {
  fields: string[]
  rows: Record<string, any>[]
}

export type Mapping = {
  x?: string
  y?: string
  color?: string
  size?: string
  opacity?: string
  shape?: string
}

type State = {
  data?: ParsedTable
  fields: string[]
  mapping: Mapping
  chartType: string
  setData: (d: ParsedTable) => void
  setMapping: (m: Mapping) => void
  setChartType: (t: string) => void
}

export const useStore = create<State>((set) => ({
  data: undefined,
  fields: [],
  mapping: {},
  chartType: 'scatter',
  setData: (d) => {
    set({ data: d, fields: d.fields })
    // Autoguardado básico
    try { 
      localStorage.setItem('vega-mapper:data-fields', JSON.stringify(d.fields))
    } catch (e) {}
  },
  setMapping: (m) => {
    set({ mapping: m })
    try { 
      localStorage.setItem('vega-mapper:mapping', JSON.stringify(m)) 
    } catch (e) {}
  },
  setChartType: (t) => set({ chartType: t })
}))