import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Vega Mapper',
  description: 'RAWGraphs-like mapper using Vega-Lite and Plotly'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}