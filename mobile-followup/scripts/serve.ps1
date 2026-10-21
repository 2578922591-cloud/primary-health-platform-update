$ErrorActionPreference = 'Stop'
$python = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    & $python -m http.server 4173 --bind 127.0.0.1
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally { Pop-Location }

