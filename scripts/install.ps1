# ══════════════════════════════════════════════════════════════════════════════
# CHE·NU — Governed Intelligence Operating System
# Installation Script (Windows PowerShell)
# REQUIRES: Python 3.12 (NOT 3.13, NOT 3.14!)
# ══════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CHE·NU — Governed Intelligence Operating System                 ║" -ForegroundColor Cyan
Write-Host "║  Installation Script                                             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  L'IA assiste. L'humain décide. Toujours." -ForegroundColor DarkGray
Write-Host ""

# Get project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host "📁 Project Root: $ProjectRoot" -ForegroundColor Gray
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK PYTHON 3.12 SPECIFICALLY
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  CHECKING PYTHON 3.12" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

# Try py -3.12 first
$python312 = $null
try {
    $python312 = py -3.12 --version 2>&1
    if ($LASTEXITCODE -eq 0 -and $python312 -match "3\.12") {
        Write-Host "✅ Found Python 3.12 via py launcher: $python312" -ForegroundColor Green
        $pythonCmd = "py -3.12"
    }
} catch {}

# If not found, try python3.12
if (-not $pythonCmd) {
    try {
        $python312 = python3.12 --version 2>&1
        if ($LASTEXITCODE -eq 0 -and $python312 -match "3\.12") {
            Write-Host "✅ Found Python 3.12: $python312" -ForegroundColor Green
            $pythonCmd = "python3.12"
        }
    } catch {}
}

# Check if Python 3.12 was found
if (-not $pythonCmd) {
    Write-Host ""
    Write-Host "❌ ERROR: Python 3.12 NOT FOUND!" -ForegroundColor Red
    Write-Host ""
    Write-Host "   CHE·NU requires Python 3.12 specifically." -ForegroundColor Yellow
    Write-Host "   Python 3.13 and 3.14 are NOT compatible yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Please download Python 3.12 from:" -ForegroundColor White
    Write-Host "   https://www.python.org/downloads/release/python-3128/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   During installation:" -ForegroundColor White
    Write-Host "   ✓ Check 'Add Python to PATH'" -ForegroundColor Gray
    Write-Host "   ✓ Check 'Install py launcher for all users'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Check Node.js
Write-Host ""
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# SETUP BACKEND
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  SETTING UP BACKEND (Python 3.12)" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

$BackendDir = Join-Path $ProjectRoot "backend"
Set-Location $BackendDir

# Remove old venv if exists
if (Test-Path ".\venv") {
    Write-Host "🗑️  Removing old virtual environment..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".\venv"
}

# Create virtual environment with Python 3.12
Write-Host "🐍 Creating Python 3.12 virtual environment..." -ForegroundColor Yellow
if ($pythonCmd -eq "py -3.12") {
    py -3.12 -m venv venv
} else {
    python3.12 -m venv venv
}

if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "❌ Failed to create virtual environment!" -ForegroundColor Red
    exit 1
}

# Verify venv Python version
$venvPython = .\venv\Scripts\python.exe --version
Write-Host "✅ Virtual environment created: $venvPython" -ForegroundColor Green

# Activate and install
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip first
python -m pip install --upgrade pip --quiet

# Install requirements
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

# Create .env
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Created .env file" -ForegroundColor Green
}

Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# SETUP FRONTEND
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  SETTING UP FRONTEND" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

$FrontendDir = Join-Path $ProjectRoot "frontend"
if (Test-Path $FrontendDir) {
    Set-Location $FrontendDir
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend directory not found — skipping" -ForegroundColor Yellow
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# DONE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "  1. Edit backend\.env and add your API keys" -ForegroundColor Gray
Write-Host "  2. Run: .\scripts\start-backend.ps1" -ForegroundColor Gray
Write-Host "  3. Run: .\scripts\start-frontend.ps1 (new terminal)" -ForegroundColor Gray
Write-Host ""
Write-Host "  URLs:" -ForegroundColor White
Write-Host "  • Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "  • API Docs:  http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Demo Login:" -ForegroundColor White
Write-Host "  • Email:    demo@chenu.app" -ForegroundColor Gray
Write-Host "  • Password: demo123" -ForegroundColor Gray
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Foundation Freeze v1.0.0 — ACTIF                                ║" -ForegroundColor Cyan
Write-Host "║  L'humain reste souverain.                                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
