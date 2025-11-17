# 🤝 Contributing to VegaMapper

¡Gracias por tu interés en contribuir a VegaMapper! Cada contribución hace que este proyecto sea mejor para toda la comunidad de visualización de datos.

## 📋 Tabla de Contenidos

- [Code of Conduct](#code-of-conduct)
- [Cómo Contribuir](#cómo-contribuir)
- [Desarrollo Local](#desarrollo-local)
- [Guías de Código](#guías-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

## 📜 Code of Conduct

Este proyecto sigue un código de conducta. Al participar, te comprometes a mantener un ambiente respetuoso e inclusivo para todos.

## 🚀 Cómo Contribuir

### Tipos de Contribución

1. **🐛 Fixing Bugs**: Corrección de errores reportados
2. **✨ New Features**: Nuevas funcionalidades
3. **📝 Documentation**: Mejoras en documentación
4. **🎨 UI/UX**: Mejoras en diseño e interfaz
5. **⚡ Performance**: Optimizaciones de rendimiento
6. **🧪 Testing**: Agregar o mejorar tests
7. **🌐 Localization**: Traducciones

### Áreas de Contribución Prioritarias

#### 📊 Nuevos Tipos de Gráficos
- Sankey diagrams
- Network/Graph visualizations
- Geographic maps
- Treemaps
- Parallel coordinates
- Radar/Spider charts

#### 🛠️ Mejoras Técnicas
- Performance optimization para datasets grandes
- Accessibility (WCAG 2.1)
- PWA capabilities
- API integrations
- Real-time collaboration

#### 🎨 UX/UI Enhancements
- Drag & drop improvements
- Better mobile experience
- Animation system
- Custom themes
- Guided tutorials

## 💻 Desarrollo Local

### Prerrequisitos

```bash
Node.js 18+
Git
npm o yarn
```

### Setup del Ambiente

```bash
# 1. Fork el repositorio en GitHub
# 2. Clone tu fork
git clone https://github.com/VelizGG/vega-mapper-app.git
cd vega-mapper-app

# 3. Agregar upstream
git remote add upstream https://github.com/VelizGG/vega-mapper-app.git

# 4. Instalar dependencias
npm install

# 5. Ejecutar en desarrollo
npm run dev

# 6. Abrir http://localhost:3000
```

### Estructura del Proyecto

```
vega-mapper-app/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página home
│   └── globals.css         # Estilos globales
├── src/
│   ├── components/         # Componentes React
│   │   ├── UploadPanel.tsx      # Carga de archivos
│   │   ├── ChartTypeSelector.tsx # Selector de gráficos
│   │   ├── MappingSidebar.tsx   # Mapeo de variables
│   │   └── ChartCanvas.tsx      # Canvas de visualización
│   ├── lib/               # Utilidades
│   │   └── parser.ts      # Parser CSV
│   └── store/             # Estado global
│       └── useStore.ts    # Zustand store
├── samples/               # Datasets de ejemplo
├── __tests__/             # Tests unitarios
├── docs/                  # Documentación adicional
└── public/                # Assets estáticos
```

## 📏 Guías de Código

### TypeScript

- ✅ **Strict mode**: Mantén el typado estricto
- ✅ **Interfaces**: Define interfaces para objetos complejos
- ✅ **Enums**: Usa enums para constantes
- ✅ **Generics**: Aprovecha generics cuando sea apropiado

```typescript
// ✅ Bueno
interface ChartConfig {
  type: ChartType
  mapping: VariableMapping
  data: ParsedData
}

// ❌ Evitar
const config: any = { ... }
```

### React Components

- ✅ **Functional components**: Usa hooks en lugar de classes
- ✅ **TypeScript**: Tipos explícitos para props
- ✅ **Client directive**: Usa 'use client' cuando necesario
- ✅ **Destructuring**: Destructura props para legibilidad

```typescript
// ✅ Bueno
'use client'
interface Props {
  data: ParsedData
  onUpdate: (config: ChartConfig) => void
}

export function ChartComponent({ data, onUpdate }: Props) {
  // ...
}
```

### Estilos (TailwindCSS)

- ✅ **Utility classes**: Prefiere utilities sobre CSS custom
- ✅ **Responsive**: Incluye breakpoints cuando sea necesario
- ✅ **Dark mode**: Usa `dark:` variants
- ✅ **Semantic colors**: Usa el sistema de colores de Tailwind

```jsx
// ✅ Bueno
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md 
                hover:shadow-lg transition-shadow md:p-6">
```

### Commits

Seguimos [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): descripción

feat(charts): add sankey diagram support
fix(upload): resolve CSV parsing issue with special characters
docs(readme): update installation instructions
style(ui): improve mobile responsive design
refactor(store): simplify state management
test(parser): add unit tests for CSV parser
perf(canvas): optimize rendering for large datasets
```

**Tipos válidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato/estilos
- `refactor`: Refactoring de código
- `test`: Agregar/modificar tests
- `perf`: Mejoras de performance
- `chore`: Tareas de mantenimiento

## 🔄 Proceso de Pull Request

### 1. Preparación

```bash
# Asegúrate de estar en la última versión
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollo

- Haz cambios incrementales
- Commit frecuentemente con mensajes claros
- Mantén los commits lógicamente separados
- Agrega tests para nueva funcionalidad

### 3. Testing

```bash
# Ejecutar todos los tests
npm test

# Verificar linting
npm run lint

# Build de producción
npm run build
```

### 4. Pull Request

1. **Push** tu rama: `git push origin feature/nueva-funcionalidad`
2. **Crear PR** en GitHub
3. **Completar plantilla** de PR
4. **Agregar reviewers** apropiados
5. **Responder feedback** constructivamente

### 5. Plantilla de PR

```markdown
## 📋 Descripción
Descripción clara de los cambios realizados.

## 🔧 Tipo de Cambio
- [ ] Bug fix (cambio que no rompe funcionalidad existente)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe funcionalidad existente)
- [ ] Documentación

## 🧪 Testing
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Probado manualmente en navegador
- [ ] Responsive design verificado

## 📱 Screenshots (si aplica)
[Agregar capturas de pantalla]

## ✅ Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He hecho self-review de mi código
- [ ] He comentado código complejo
- [ ] He agregado tests que prueban mi cambio
- [ ] Nuevos y existentes tests pasan localmente
- [ ] He actualizado documentación relevante
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Buscar** issues existentes similares
2. **Verificar** que no sea un problema local
3. **Reproducir** el bug consistentemente
4. **Actualizar** a la última versión

### Plantilla de Bug Report

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del bug.

## 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz click en '....'
3. Scroll hasta '....'
4. Ver error

## ✅ Comportamiento Esperado
Descripción de qué esperabas que pasara.

## ❌ Comportamiento Actual
Descripción de qué realmente pasó.

## 📱 Entorno
- OS: [ej. iOS, Windows, Linux]
- Navegador: [ej. chrome, safari]
- Versión: [ej. 22]
- VegaMapper Version: [ej. v1.0.0]

## 📄 Logs/Screenshots
Agregar logs de consola o screenshots si ayudan.

## ➕ Contexto Adicional
Cualquier otra información relevante.
```

## 💡 Sugerir Features

### Plantilla de Feature Request

```markdown
## 🚀 Feature Request

### 📋 Resumen
Descripción breve de la feature propuesta.

### 🎯 Motivación
¿Por qué sería útil esta feature? ¿Qué problema resuelve?

### 💭 Descripción Detallada
Descripción completa de cómo debería funcionar.

### 🎨 Mockups/Wireframes (opcional)
Imágenes que ilustren la feature propuesta.

### 🔧 Implementación Sugerida (opcional)
Ideas sobre cómo podría implementarse técnicamente.

### 📊 Alternativas Consideradas
Otras soluciones que consideraste.

### ➕ Contexto Adicional
Cualquier información adicional relevante.
```

## 🏷️ Labels y Prioridades

### Labels de Issues
- `bug`: Errores confirmados
- `enhancement`: Nuevas features
- `documentation`: Mejoras en docs
- `good first issue`: Ideal para nuevos contribuyentes
- `help wanted`: Se busca ayuda de la comunidad
- `priority:high`: Prioridad alta
- `priority:low`: Prioridad baja

### Labels de PRs
- `work in progress`: PR en desarrollo
- `ready for review`: Listo para revisión
- `needs changes`: Requiere modificaciones
- `approved`: Aprobado para merge

## 🎯 Roadmap y Prioridades

### Q1 2026 - Core Features
- [ ] Sankey diagrams
- [ ] Network visualizations
- [ ] Performance optimization
- [ ] Mobile improvements

### Q2 2026 - Integration
- [ ] API connectors
- [ ] Google Sheets integration
- [ ] Real-time collaboration
- [ ] PWA capabilities

### Q3 2026 - Advanced
- [ ] Custom themes system
- [ ] Animation framework
- [ ] Advanced analytics
- [ ] Embedding system

## 🙋‍♀️ Preguntas Frecuentes

### ❓ ¿Cómo puedo agregar un nuevo tipo de gráfico?

1. Agregar tipo en `ChartTypeSelector.tsx`
2. Implementar lógica en `ChartCanvas.tsx`
3. Agregar tests correspondientes
4. Actualizar documentación

### ❓ ¿Cómo optimizar performance para datasets grandes?

Considera:
- Virtualization para listas largas
- Sampling inteligente de datos
- Lazy loading de componentes
- Memoización de cálculos costosos

### ❓ ¿Cómo agregar un nuevo parser de datos?

1. Extender `src/lib/parser.ts`
2. Agregar tipos TypeScript
3. Implementar tests unitarios
4. Documentar formato soportado

## 🎉 Reconocimiento

Todos los contribuyentes serán reconocidos en:
- **README.md**: Lista de contribuyentes
- **Release Notes**: Menciones en cada release
- **GitHub**: Contributor graph y statistics

---

<div align="center">

## 🙏 ¡Gracias por Contribuir!

Tu ayuda hace que VegaMapper sea mejor para todos.  
**Cada contribución cuenta, sin importar el tamaño.**

[🌟 Ver Contribuyentes](https://github.com/VelizGG/vega-mapper-app/contributors) | 
[📋 Issues Abiertos](https://github.com/VelizGG/vega-mapper-app/issues) |
[🔄 Pull Requests](https://github.com/VelizGG/vega-mapper-app/pulls)

</div>
