#!/bin/bash

# 🚀 VegaMapper - Script de Deploy Automático
# Este script automatiza el proceso completo de deployment

echo "🧮 VegaMapper - Deploy Script"
echo "================================="

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Verificando estado del proyecto...${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proyecto encontrado${NC}"

# Verificar Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: No se encontró repositorio Git.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Repositorio Git configurado${NC}"

# Mostrar información del proyecto
echo -e "${BLUE}📊 Información del proyecto:${NC}"
echo "- Nombre: $(grep -o '"name": "[^"]*' package.json | cut -d'"' -f4)"
echo "- Versión: $(grep -o '"version": "[^"]*' package.json | cut -d'"' -f4)"
echo "- Remote: $(git remote get-url origin)"

echo ""
echo -e "${YELLOW}🔗 PASO 1: Crear repositorio en GitHub${NC}"
echo "Ve a: https://github.com/new"
echo "Configuración:"
echo "  - Repository name: vega-mapper-app"
echo "  - Description: 🧮 VegaMapper - Visualización de datos estilo RAWGraphs con Vega-Lite + Next.js"
echo "  - Public: ✅"
echo "  - NO marcar: Add a README file"
echo "  - NO marcar: Add .gitignore"
echo "  - NO marcar: Choose a license"
echo ""

read -p "Presiona Enter cuando hayas creado el repositorio en GitHub..."

echo -e "${BLUE}🚀 PASO 2: Haciendo push del código...${NC}"

# Push principal
echo "Subiendo rama main..."
if git push -u origin main; then
    echo -e "${GREEN}✅ Código principal subido correctamente${NC}"
else
    echo -e "${RED}❌ Error al subir el código principal${NC}"
    exit 1
fi

# Push tags
echo "Subiendo tags..."
if git push --tags; then
    echo -e "${GREEN}✅ Tags subidos correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  Error al subir tags (puede ser normal si el repo es nuevo)${NC}"
fi

echo ""
echo -e "${BLUE}☁️ PASO 3: Configurar Vercel${NC}"
echo "1. Ve a: https://vercel.com"
echo "2. Login con GitHub"
echo "3. Click 'Add New Project'"
echo "4. Import 'vega-mapper-app'"
echo "5. Deploy (configuración automática)"
echo ""

echo -e "${GREEN}🎉 ¡Deploy completado!${NC}"
echo ""
echo "🔗 URLs importantes:"
echo "📂 GitHub: https://github.com/VelizGG/vega-mapper-app"
echo "🌐 Vercel: (se generará después del deploy)"
echo "📊 Demo: (se generará después del deploy)"
echo ""
echo -e "${BLUE}📋 Próximos pasos opcionales:${NC}"
echo "- Configurar dominios customizados en Vercel"
echo "- Habilitar GitHub Discussions"
echo "- Configurar GitHub Pages para documentación"
echo "- Añadir badges al README"
echo ""
echo -e "${GREEN}¡Proyecto liberado exitosamente! 🚀${NC}"