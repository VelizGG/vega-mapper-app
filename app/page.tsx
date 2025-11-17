'use client'
import { UploadPanel } from '../src/components/UploadPanel'
import { ChartTypeSelector } from '../src/components/ChartTypeSelector'
import { MappingSidebar } from '../src/components/MappingSidebar'
import { ChartCanvas } from '../src/components/ChartCanvas'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  VegaMapper
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Visualización de datos interactiva
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('https://github.com/vega/vega-lite', '_blank')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Powered by Vega-Lite
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Upload and Chart Type */}
          <div className="lg:col-span-1 space-y-6">
            <UploadPanel />
            <ChartTypeSelector />
          </div>

          {/* Main Content - Chart */}
          <div className="lg:col-span-2">
            <ChartCanvas />
          </div>

          {/* Right Sidebar - Mapping */}
          <div className="lg:col-span-1">
            <MappingSidebar />
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© 2024 VegaMapper</span>
              <span>•</span>
              <span>Hecho con Next.js + Vega-Lite</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}