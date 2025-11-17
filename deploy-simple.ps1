# Script de Deploy Automatizado para VegaMapper
# ================================================

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
$package = Get-Content "package.json" | ConvertFrom-Json
Write-Host "   Nombre: $($package.name)"
Write-Host "   Versión: $($package.version)"
Write-Host "   Descripción: $($package.description)"

Write-Host ""
Write-Host "🔍 Verificando autenticación de GitHub CLI..." -ForegroundColor Blue

# Verificar autenticación de GitHub CLI
try {
    $authOutput = gh auth status 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI autenticado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ GitHub CLI no autenticado. Iniciando proceso de autenticación..." -ForegroundColor Yellow
        Write-Host "🔐 Abriendo navegador para autenticación..."
        gh auth login --web
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Autenticación exitosa" -ForegroundColor Green
        } else {
            Write-Host "❌ Error en la autenticación" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "❌ Error verificando autenticación: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando proceso de deploy..." -ForegroundColor Cyan

# Crear el repositorio en GitHub si no existe
Write-Host "📦 Creando repositorio en GitHub..." -ForegroundColor Blue
try {
    $repoOutput = gh repo view VelizGG/vega-mapper-app 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Repositorio no existe. Creándolo..." -ForegroundColor Yellow
        gh repo create VelizGG/vega-mapper-app --public --description "Interactive data visualization tool using Vega-Lite for creating dynamic charts and graphs" --clone=false
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Repositorio creado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "❌ Error creando repositorio" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Repositorio ya existe" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error verificando/creando repositorio: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Configurar el remote origin si no existe
Write-Host "🔗 Configurando remote origin..." -ForegroundColor Blue
try {
    $remoteOutput = git remote get-url origin 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        git remote add origin https://github.com/VelizGG/vega-mapper-app.git
        Write-Host "✅ Remote origin configurado" -ForegroundColor Green
    } else {
        Write-Host "✅ Remote origin ya configurado: $($remoteOutput.Trim())" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error configurando remote: $($_.Exception.Message)" -ForegroundColor Red
}

# Preparar y hacer commit de todos los cambios
Write-Host "📝 Preparando archivos para commit..." -ForegroundColor Blue
git add .

$commitMessage = "feat: Initial release of VegaMapper application"

git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado exitosamente" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No hay cambios para hacer commit o commit ya realizado" -ForegroundColor Yellow
}

# Push al repositorio
Write-Host "📤 Subiendo código a GitHub..." -ForegroundColor Blue
git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Código subido exitosamente a GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ Error subiendo código a GitHub" -ForegroundColor Red
    Write-Host "   Intentando con force push..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Force push exitoso" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en force push" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 Información de deployment:" -ForegroundColor Cyan
Write-Host "   📦 GitHub: https://github.com/VelizGG/vega-mapper-app"
Write-Host "   🔄 Actions: https://github.com/VelizGG/vega-mapper-app/actions"
Write-Host "   ⚡ Vercel: https://vercel.com/new/git/external?repository-url=https://github.com/VelizGG/vega-mapper-app"

Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Ve a Vercel y conecta tu repositorio"
Write-Host "   2. Las variables de entorno se configurarán automáticamente"
Write-Host "   3. El CI/CD se ejecutará en cada push"

Write-Host ""
Write-Host "¡Proyecto liberado exitosamente! 🚀" -ForegroundColor Green

# Opcional: Abrir el repositorio en GitHub
$openGitHub = Read-Host "¿Quieres abrir el repositorio en GitHub? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/VelizGG/vega-mapper-app"
}