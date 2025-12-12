# ══════════════════════════════════════════════════════════════════════════════
# CHE·NU — Backend Startup Script
# ══════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CHE·NU — Starting Backend Server                                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path (Split-Path -Parent $ScriptDir) "backend"

Set-Location $BackendDir
Write-Host "📁 Directory: $BackendDir" -ForegroundColor Gray

# Check if venv exists
if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host "   Run: .\scripts\install.ps1" -ForegroundColor Yellow
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env not found, copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Created .env — Please add your API keys!" -ForegroundColor Yellow
}

# Activate virtual environment
Write-Host "🐍 Activating virtual environment..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

# Verify Python version
$pythonVersion = python --version
Write-Host "   Python: $pythonVersion" -ForegroundColor Gray

if ($pythonVersion -notmatch "3\.12") {
    Write-Host "⚠️  WARNING: Expected Python 3.12, got $pythonVersion" -ForegroundColor Yellow
    Write-Host "   Consider re-running install.ps1 with Python 3.12" -ForegroundColor Yellow
}

# Start server
Write-Host ""
Write-Host "🚀 Starting CHE·NU GIOS Backend..." -ForegroundColor Green
Write-Host "   http://localhost:8000" -ForegroundColor Cyan
Write-Host "   http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""

python main.py
