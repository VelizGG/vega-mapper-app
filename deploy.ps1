# 🚀 VegaMapper - Script de Deploy Automático para PowerShell
# Este script automatiza el proceso completo de deployment

Write-Host "🧮 VegaMapper - Deploy Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Verificando estado del proyecto..." -ForegroundColor Blue

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Proyecto encontrado" -ForegroundColor Green

# Verificar Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No se encontró repositorio Git." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Repositorio Git configurado" -ForegroundColor Green

# Mostrar información del proyecto
Write-Host "📊 Información del proyecto:" -ForegroundColor Blue
$packageJson = Get-Content "package.json" | ConvertFrom-Json
Write-Host "- Nombre: $($packageJson.name)"
Write-Host "- Versión: $($packageJson.version)"
$remoteUrl = git remote get-url origin
Write-Host "- Remote: $remoteUrl"
Write-Host ""

Write-Host "🔗 PASO 1: Crear repositorio en GitHub" -ForegroundColor Yellow
Write-Host "Ve a: https://github.com/new"
Write-Host "Configuración:"
Write-Host "  - Repository name: vega-mapper-app"
Write-Host "  - Description: 🧮 VegaMapper - Visualización de datos estilo RAWGraphs con Vega-Lite + Next.js"
Write-Host "  - Public: ✅"
Write-Host "  - NO marcar: Add a README file"
Write-Host "  - NO marcar: Add .gitignore"
Write-Host "  - NO marcar: Choose a license"
Write-Host ""

# Abrir GitHub automáticamente
Start-Process "https://github.com/new"

Read-Host "Presiona Enter cuando hayas creado el repositorio en GitHub"

Write-Host ""
Write-Host "🚀 PASO 2: Haciendo push del código..." -ForegroundColor Blue

# Push principal
Write-Host "Subiendo rama main..."
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Código principal subido correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al subir el código principal:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    
    # Intentar con autenticación
    Write-Host "💡 Intentando con autenticación..." -ForegroundColor Yellow
    Write-Host "Si aparece una ventana de login, ingresa tus credenciales de GitHub"
    
    $pushResult2 = git push -u origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Código subido correctamente después de autenticación" -ForegroundColor Green
    } else {
        Write-Host "❌ Error persistente. Verifica tu autenticación de GitHub." -ForegroundColor Red
        Write-Host "Puedes intentar manualmente: git push -u origin main" -ForegroundColor Yellow
        exit 1
    }
}

# Push tags
Write-Host "Subiendo tags..."
$tagsResult = git push --tags 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tags subidos correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠️  Error al subir tags (puede ser normal si el repo es nuevo)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "☁️ PASO 3: Configurar Vercel" -ForegroundColor Blue
Write-Host "1. Ve a: https://vercel.com"
Write-Host "2. Login con GitHub"
Write-Host "3. Click 'Add New Project'"
Write-Host "4. Import 'vega-mapper-app'"
Write-Host "5. Deploy (configuración automática)"
Write-Host ""

# Abrir Vercel automáticamente
Start-Process "https://vercel.com/new"

Write-Host "🎉 ¡Deploy completado!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs importantes:"
Write-Host "📂 GitHub: https://github.com/VelizGG/vega-mapper-app"
Write-Host "🌐 Vercel: (se generará después del deploy)"
Write-Host "📊 Demo: (se generará después del deploy)"
Write-Host ""
Write-Host "📋 Próximos pasos opcionales:" -ForegroundColor Blue
Write-Host "- Configurar dominios customizados en Vercel"
Write-Host "- Habilitar GitHub Discussions"
Write-Host "- Configurar GitHub Pages para documentación"
Write-Host "- Añadir badges al README"
Write-Host ""
Write-Host "¡Proyecto liberado exitosamente! 🚀" -ForegroundColor Green

# Opcional: Abrir el repositorio en GitHub
$openGitHub = Read-Host "¿Quieres abrir el repositorio en GitHub? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/VelizGG/vega-mapper-app"
}