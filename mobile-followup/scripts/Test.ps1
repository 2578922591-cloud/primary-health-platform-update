$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$python = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$node = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
Push-Location $root
try {
    & $python -m unittest discover -s tests -p 'test_*.py'
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    $server = Start-Process -FilePath $python -ArgumentList @('-m','http.server','4173','--bind','127.0.0.1') -WorkingDirectory $root -WindowStyle Hidden -PassThru
    try {
        Start-Sleep -Seconds 2
        & $node '.\tests\browser-smoke.mjs'
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    } finally { if (-not $server.HasExited) { Stop-Process -Id $server.Id } }
} finally { Pop-Location }
exit 0
