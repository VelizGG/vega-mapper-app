# 🚀 VegaMapper v1.0.0 - Release Notes

**Fecha de Release**: Noviembre 16, 2025  
**Tipo**: Primera versión pública estable  

## 🎉 ¡Bienvenidos a VegaMapper!

VegaMapper es una aplicación web moderna inspirada en RAWGraphs para crear visualizaciones de datos interactivas de manera intuitiva. Construida con las últimas tecnologías web, ofrece una experiencia fluida para transformar datos CSV en gráficos profesionales.

---

## ✨ **Características Principales**

### 📊 **Visualización Completa**
- **7 tipos de gráficos**: Scatter, Line, Bar, Area, Histogram, Box Plot, Heatmap
- **Interactividad**: Zoom, pan, tooltips automáticos
- **Exportación**: PNG, SVG, JSON specifications
- **Calidad profesional**: Renderizado SVG optimizado

### 📂 **Importación de Datos**
- **Drag & Drop**: Interfaz intuitiva para arrastrar archivos CSV
- **Validación automática**: Detección de errores y formato
- **Auto-detección de tipos**: Numérico, categórico, temporal
- **Samples incluidos**: 4 datasets listos para experimentar

### 🎯 **Mapeo Visual Avanzado**
- **Variables principales**: X, Y (obligatorias)
- **Variables opcionales**: Color, Size, Opacity, Shape
- **Validación en tiempo real**: Feedback inmediato
- **Configuración inteligente**: Sugerencias automáticas

### 🎨 **Experiencia de Usuario**
- **Interfaz moderna**: Diseño limpio y profesional
- **Dark/Light mode**: Tema automático y manual
- **Responsive design**: Optimizado para todos los dispositivos
- **Performance**: Carga rápida y navegación fluida

---

## 🛠️ **Stack Tecnológico**

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Framework** | Next.js | 14.0 | App Router, SSR, Performance |
| **Lenguaje** | TypeScript | 5.2 | Tipado estático, Developer Experience |
| **Visualización** | Vega-Lite | 5.9 | Grammar of Graphics, Interactividad |
| **Estado** | Zustand | 4.4 | State Management ligero |
| **Procesamiento** | PapaParse | 5.4 | CSV parsing robusto |
| **Estilos** | TailwindCSS | 3.3 | Utility-first, diseño consistente |
| **Testing** | Jest | 29.7 | Unit testing, calidad de código |

---

## 📁 **Datasets Incluidos**

### 🏃‍♂️ **athletes.csv** 
- **Descripción**: Datos de 20 deportistas profesionales
- **Variables**: name, age, height, weight, country, sport
- **Ideal para**: Scatter plots, correlaciones, análisis demográfico

### 🌤️ **weather.csv**
- **Descripción**: Datos meteorológicos de 4 ciudades europeas
- **Variables**: date, temperature, humidity, rainfall, city
- **Ideal para**: Time series, line charts, comparaciones climáticas

### 💼 **sales.csv**
- **Descripción**: Datos de ventas trimestrales por categoría y región
- **Variables**: month, sales, expenses, profit, category, region
- **Ideal para**: Bar charts, análisis de rentabilidad, comparaciones

### 📱 **products.csv**
- **Descripción**: Performance de productos tech en diferentes mercados
- **Variables**: product, sales, profit, quarter, region, category
- **Ideal para**: Análisis multivariable, heatmaps, segmentación

---

## 🚀 **Instalación Rápida**

### Prerrequisitos
- Node.js 18+
- Git
- Navegador moderno

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/VelizGG/vega-mapper-app.git

# 2. Instalar dependencias
cd vega-mapper-app
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

---

## 📊 **Guía Rápida de Uso**

### Paso 1: Cargar Datos
1. Arrastra un archivo CSV al área de carga
2. O selecciona uno de los samples incluidos
3. Verifica que los datos se cargaron correctamente

### Paso 2: Seleccionar Gráfico
1. Elige el tipo de visualización en el panel izquierdo
2. Considera qué tipo de relación quieres explorar
3. Scatter para correlaciones, Line para tendencias, etc.

### Paso 3: Mapear Variables
1. Asigna campos a X e Y (obligatorio)
2. Opcionalmente asigna Color, Size, Opacity
3. Observa la validación en tiempo real

### Paso 4: Explorar Resultado
1. El gráfico se actualiza automáticamente
2. Usa zoom y pan para explorar
3. Exporta en PNG/SVG si necesitas

---

## 🔧 **Para Desarrolladores**

### Scripts Disponibles
```bash
npm run dev      # Desarrollo (http://localhost:3000)
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
npm run test     # Tests unitarios
```

### Estructura del Proyecto
```
vega-mapper-app/
├── app/                 # Next.js App Router
├── src/components/      # Componentes React
├── src/lib/            # Utilidades (CSV parser)
├── src/store/          # Estado global (Zustand)
├── samples/            # Datasets de ejemplo
└── docs/               # Documentación
```

### Extensibilidad
- **Nuevos gráficos**: Agregar en `ChartTypeSelector.tsx`
- **Nuevos parsers**: Extender `src/lib/parser.ts`
- **Nuevos temas**: Configurar en `tailwind.config.js`
- **Nuevos stores**: Agregar a `src/store/`

---

## 🐛 **Issues Conocidos**

### ⚠️ Warnings (No críticos)
- Vega canvas warnings en desarrollo (solo consola)
- TypeScript warnings en archivos legacy (no afectan funcionalidad)

### 🔧 Workarounds
- Los warnings de canvas son normales en entorno de desarrollo
- La aplicación funciona perfectamente en producción
- Los gráficos se renderizan correctamente en el navegador

---

## 📝 **Roadmap v1.1**

### 🔄 Próximas Features
- [ ] **Sankey diagrams**: Para flujos de datos
- [ ] **Geographic maps**: Visualizaciones geoespaciales
- [ ] **Network graphs**: Relaciones y conexiones
- [ ] **Treemaps**: Jerarquías y proporciones
- [ ] **Animation support**: Transiciones suaves

### 🛠️ Mejoras Técnicas
- [ ] **Performance**: Optimización para datasets grandes (10k+ filas)
- [ ] **PWA**: Soporte offline y app-like experience
- [ ] **API integration**: Conectores a Google Sheets, APIs REST
- [ ] **Collaboration**: Compartir proyectos y embedding
- [ ] **Accessibility**: WCAG 2.1 compliance completo

---

## 🤝 **Contribución**

¡Las contribuciones son bienvenidas! Este proyecto sigue las mejores prácticas de open source:

### Como Contribuir
1. **Fork** el repositorio
2. **Crea** una rama feature (`git checkout -b feature/amazing-feature`)
3. **Commit** con mensajes descriptivos
4. **Push** y abre un **Pull Request**
5. **Describe** claramente los cambios realizados

### Areas de Contribución
- **Nuevos tipos de gráficos**
- **Mejoras de UX/UI**
- **Optimizaciones de performance**
- **Tests adicionales**
- **Documentación**
- **Traducciones**

---

## 📄 **Licencia**

VegaMapper está bajo **licencia MIT** - ver [LICENSE](LICENSE) para detalles completos.

Esto significa que puedes:
- ✅ Usar comercialmente
- ✅ Modificar libremente
- ✅ Distribuir
- ✅ Usar privadamente

Con la única condición de mantener el copyright notice.

---

## 🙏 **Reconocimientos**

### Inspiraciones y Referencias
- **[RAWGraphs](https://rawgraphs.io/)** - La inspiración original para la interfaz
- **[Observable](https://observablehq.com/)** - Comunidad y filosofía de viz
- **[Vega-Lite Examples](https://vega.github.io/vega-lite/examples/)** - Galería de gráficos

### Tecnologías Open Source
- **[Next.js](https://nextjs.org/)** por Vercel - Framework increíble
- **[Vega-Lite](https://vega.github.io/vega-lite/)** por UW Interactive Data Lab
- **[TailwindCSS](https://tailwindcss.com/)** por Tailwind Labs
- **[Zustand](https://github.com/pmndrs/zustand)** por Poimandres

---

## 📞 **Soporte y Contacto**

### Documentación
- **README**: Guía completa de instalación y uso
- **TypeScript docs**: Código completamente tipado
- **Inline comments**: Código autodocumentado

### Reportar Issues
- **[GitHub Issues](https://github.com/VelizGG/vega-mapper-app/issues)**: Bugs y feature requests
- **Plantillas**: Usa las plantillas proporcionadas
- **Labels**: Clasifica apropiadamente (bug, enhancement, question)

### Community
- **Discussions**: Para preguntas generales y showcase
- **Pull Requests**: Para contribuciones de código
- **Wiki**: Documentación colaborativa (próximamente)

---

<div align="center">

## 🌟 **¡Gracias por usar VegaMapper!**

**Si te gusta el proyecto, considera darle una ⭐ en GitHub**

[⭐ Star en GitHub](https://github.com/VelizGG/vega-mapper-app) | 
[🐛 Reportar Bug](https://github.com/VelizGG/vega-mapper-app/issues) | 
[💡 Sugerir Feature](https://github.com/VelizGG/vega-mapper-app/issues) |
[📖 Documentación](README.md)

**Hecho con ❤️ para la comunidad de visualización de datos**

</div>
