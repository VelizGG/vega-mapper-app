import Papa from 'papaparse'
import { ParsedTable } from '../store/useStore'

export function parseCSV(file: File | string): Promise<ParsedTable> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, any>>) => {
        if (results.errors && results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`))
          return
        }
        const fields = results.meta.fields || []
        const rows = results.data
        resolve({ fields, rows })
      }
    })
  })
}

export function inferFieldTypes(data: Record<string, any>[]): Record<string, 'number' | 'string' | 'date'> {
  const types: Record<string, 'number' | 'string' | 'date'> = {}
  
  if (data.length === 0) return types
  
  Object.keys(data[0]).forEach(field => {
    let numCount = 0
    let dateCount = 0
    let sampleSize = Math.min(data.length, 100)
    
    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][field]
      if (value === null || value === undefined || value === '') continue
      
      // Check if it's a number
      if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
        numCount++
      }
      
      // Check if it's a date
      if (new Date(value).toString() !== 'Invalid Date') {
        dateCount++
      }
    }
    
    if (numCount / sampleSize > 0.7) {
      types[field] = 'number'
    } else if (dateCount / sampleSize > 0.7) {
      types[field] = 'date'
    } else {
      types[field] = 'string'
    }
  })
  
  return types
}