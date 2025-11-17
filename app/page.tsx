'use client'
import { useState } from 'react'
import { UploadPanel } from '../src/components/UploadPanel'
import { ChartTypeSelector } from '../src/components/ChartTypeSelector'
import { MappingSidebar } from '../src/components/MappingSidebar'
import { ChartCanvas } from '../src/components/ChartCanvas'
import { GraphicEditor } from '../src/components/GraphicEditor'
import { DataTransformPanel } from '../src/components/DataTransformPanel'
import { DatasetManager } from '../src/components/DatasetManager'
import { ExportPanelAdvanced } from '../src/components/ExportPanelAdvanced'
import { NotificationProvider } from '../src/components/ui/NotificationSystem'

type TabType = 'upload' | 'datasets' | 'mapping' | 'editor' | 'transform' | 'export'

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('upload')

  const tabs = [
    { id: 'upload', label: 'Datos', description: 'Cargar y configurar datos' },
    { id: 'datasets', label: 'Datasets', description: 'Gestionar múltiples archivos' },
    { id: 'mapping', label: 'Mapeo', description: 'Mapear campos a variables visuales' },
    { id: 'editor', label: 'Editor', description: 'Personalizar apariencia del gráfico' },
    { id: 'transform', label: 'Transformar', description: 'Agrupar, ordenar y filtrar datos' },
    { id: 'export', label: 'Exportar', description: 'Descargar gráficos y datos' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-6">
            <UploadPanel />
            <ChartTypeSelector />
          </div>
        )
      case 'datasets':
        return <DatasetManager />
      case 'mapping':
        return <MappingSidebar />
      case 'editor':
        return <GraphicEditor />
      case 'transform':
        return <DataTransformPanel />
      case 'export':
        return <ExportPanelAdvanced />
      default:
        return null
    }
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <a 
          href="#main-content" 
          className="skip-link"
        >
          Saltar al contenido principal
        </a>
      
      <header 
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                role="img"
                aria-label="VegaMapper logo"
              >
                <span className="text-white font-bold text-sm" aria-hidden="true">V</span>
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
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                aria-label="Abrir documentación de Vega-Lite en nueva pestaña"
              >
                Powered by Vega-Lite
              </button>
            </div>
          </div>
        </div>
      </header>

      <main 
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-label="Área principal de la aplicación VegaMapper"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar with Tabs */}
          <aside 
            className="lg:col-span-1 space-y-6"
            role="complementary"
            aria-label="Panel de configuración de datos y gráficos"
          >
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <nav 
                className="space-y-1"
                role="tablist"
                aria-label="Configuración de visualización"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                  >
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              {renderTabContent()}
            </div>
          </aside>

          {/* Main Content - Chart */}
          <section 
            className="lg:col-span-3"
            role="region"
            aria-label="Área de visualización del gráfico"
          >
            <ChartCanvas />
          </section>
        </div>
      </main>

      <footer 
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© 2024 VegaMapper</span>
              <span aria-hidden="true">•</span>
              <span>Hecho con Next.js + Vega-Lite</span>
            </div>
            <div className="flex items-center space-x-4">
              <span aria-label="Versión actual">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </NotificationProvider>
  )
}