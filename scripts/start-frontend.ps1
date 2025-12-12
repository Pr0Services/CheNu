# ══════════════════════════════════════════════════════════════════════════════
# CHE·NU — Governed Intelligence Operating System
# Frontend Startup Script (Windows PowerShell)
# ══════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CHE·NU — Starting Frontend Server                               ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendDir = Join-Path (Split-Path -Parent $ScriptDir) "frontend"

Set-Location $FrontendDir
Write-Host "📁 Directory: $FrontendDir" -ForegroundColor Gray

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start dev server
Write-Host ""
Write-Host "🌌 Starting CHE·NU Universe View..." -ForegroundColor Green
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev
