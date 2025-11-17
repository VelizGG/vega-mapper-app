#!/bin/bash
# Comandos para ejecutar después de la autenticación CLI

echo "🔍 Verificando autenticación..."
gh auth status

echo "📦 Creando repositorio en GitHub..."
gh repo create VelizGG/vega-mapper-app --public --description "Interactive data visualization tool using Vega-Lite for creating dynamic charts and graphs"

echo "🔗 Configurando remote origin..."
git remote add origin https://github.com/VelizGG/vega-mapper-app.git 2>/dev/null || echo "Remote ya existe"

echo "📝 Preparando commit..."
git add .
git commit -m "feat: Initial release of VegaMapper application

Complete interactive data visualization tool featuring:
- Vega-Lite integration for dynamic charts
- Next.js 14 with App Router and TypeScript
- CI/CD pipeline with GitHub Actions
- Docker containerization
- Vercel deployment ready
- Comprehensive documentation"

echo "📤 Subiendo código..."
git push -u origin main

echo "✅ ¡Repositorio creado exitosamente!"
echo "📦 GitHub: https://github.com/VelizGG/vega-mapper-app"
echo "🔄 Actions: https://github.com/VelizGG/vega-mapper-app/actions"
echo "⚡ Vercel: https://vercel.com/new/git/external?repository-url=https://github.com/VelizGG/vega-mapper-app"