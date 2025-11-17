# Vega Mapper App (RAWGraphs-like)

Una web app tipo RAWGraphs para importar CSV, mapear columnas a encodings visuales y renderizar gráficos interactivos usando Vega-Lite y Plotly.

## 🚀 Características

- **Import CSV**: Archivo local, URL o ejemplos incluidos
- **Mapping visual**: Selecciona columnas para X, Y, Color, Size
- **Múltiples tipos**: scatter, line, bar, area, histogram, boxplot, heatmap, treemap, sankey, parallel coordinates
- **Auto-detección**: Tipos de campo (numérico, temporal, nominal, ordinal)
- **Preview instantáneo**: Actualización en tiempo real sin recarga
- **Export**: PNG/SVG usando Vega-Lite y Plotly
- **Persistencia**: Auto-guardado en localStorage + export/import JSON
- **Gallery**: Presets configurados para cargar rápidamente

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Visualización**: Vega-Lite (primario), Plotly (fallback para sankey)
- **Estado**: Zustand store tipado
- **Parser**: PapaParse (streaming, chunks grandes)
- **Tests**: Jest + React Testing Library

## 📦 Instalación y uso

### Requisitos
- Node.js 18+
- npm o yarn

### Setup local
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
# Abrir http://localhost:3000
```

### Scripts disponibles
```bash
npm run dev      # Servidor desarrollo
npm run build    # Build producción  
npm run start    # Servidor producción
npm run test     # Tests unitarios
npm run lint     # Linting
```

## 🎨 Uso básico

1. **Import data**: Cargar CSV desde archivo, URL o usar samples incluidos
2. **Map fields**: Asignar columnas a encodings (X, Y, Color, Size) via selects
3. **Choose chart**: Seleccionar tipo de gráfico desde categorías organizadas
4. **Preview**: Ver actualización instantánea en el canvas principal
5. **Export**: Descargar PNG/SVG o exportar configuración como JSON
6. **Gallery**: Explorar ejemplos preconfigurados

## 📊 Tipos de gráficos soportados

### Básicos (Vega-Lite)
- **scatter**: Puntos en X/Y
- **line**: Series temporales
- **bar**: Barras categóricas  
- **area**: Áreas apiladas

### Estadísticos (Vega-Lite)
- **histogram**: Distribuciones con binning automático
- **boxplot**: Box plots con extensiones

### Matrix (Vega-Lite)
- **heatmap**: Mapas de calor con encoding color

### Hierarchical (Vega-Lite)
- **treemap**: Rectangulares con agregación por tamaño

### Network (Plotly fallback)
- **sankey**: Diagramas de flujo (source → target → value)

### Multivariate (Vega-Lite)
- **parallel**: Coordenadas paralelas para múltiples dimensiones

## 🚢 Deploy

### Vercel (recomendado)
1. Conectar repo en vercel.com
2. Configuración automática detecta Next.js
3. Deploy automático en cada push

### Manual
```bash
npm run build
npm run start
# Servidor en puerto 3000
```

## 🧪 Tests

```bash
npm run test
```

Tests incluidos:
- Parser CSV con PapaParse
- Store Zustand setters/getters
- Detección automática tipos de field

## 📝 Limitaciones conocidas

- **Performance**: Datasets >10k filas usan sampling automático en preview
- **Vega-Lite specs**: Generador básico; casos complejos necesitan extensión manual
- **Plotly integration**: Limitado a sankey; otros tipos network requieren implementación adicional

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 📚 Referencias

- [Vega-Lite Documentation](https://vega.github.io/vega-lite/)
- [RAWGraphs.io](https://rawgraphs.io) (inspiración)
- [Next.js App Router](https://nextjs.org/docs)
- [PapaParse](https://www.papaparse.com/)