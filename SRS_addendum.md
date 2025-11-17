SRS Addendum - Diseño y decisiones

## Decisiones técnicas principales

### 1) Vega-Lite vs Plotly
- **Vega-Lite** es la librería primaria porque ofrece un lenguaje declarativo, compactación de spec y encodings similares a RAWGraphs.
- **Plotly** se usa como fallback para tipos complejos (sankey) o para asegurar export PNG exacto cuando Vega embed no sea suficiente.

### 2) Manejo de grandes datasets
- Se usa **PapaParse** con streaming para parsear CSV grandes.
- En la preview, aplicamos **sampling automático** (por defecto 10k filas) para mantener responsive el render.
- El store mantiene el dataset completo para export pero solo muestra una muestra en la UI.

### 3) Fallbacks y compatibilidad
- Si un chart no tiene buen soporte en Vega-Lite (ej. sankey), intentamos render con Plotly.
- **Auto-detección de tipos** usando heurística estadística (ratio numeric/temporal/ordinal).
- **Autosugerencias** de mappings cuando se carga un dataset por primera vez.

### 4) Arquitectura de estado
- **Zustand store** centralizado con persistencia automática en localStorage
- **Componentes modulares** que se subscriben solo a las partes del estado que necesitan
- **Separación clara** entre logic (lib/) y UI (components/)

### 5) UX y performance
- **Preview en tiempo real** sin recarga usando useEffect reactivo
- **Validación de mappings** con warnings en Inspector panel
- **Gallery de presets** para cargar configuraciones comunes rapidamente
- **Export múltiple**: PNG via Vega-Lite, JSON de configuraciones

### 6) Limitaciones conocidas y trade-offs
- **Specs básicas**: El generador de Vega-Lite cubre casos comunes; specs complejas requieren extensión manual
- **Plotly limitado**: Solo integrado para sankey; otros tipos network requieren desarrollo adicional
- **Tipo detection**: Heurística simple basada en sampling; puede fallar con datos edge case
- **DnD**: UI actual usa selects por simplicidad; drag & drop completo es mejora futura