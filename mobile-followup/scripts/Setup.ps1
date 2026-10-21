$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$deps = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$link = Join-Path $root 'node_modules'
if (-not (Test-Path -LiteralPath $link)) { New-Item -ItemType Junction -Path $link -Target $deps | Out-Null }
if (-not (Test-Path -LiteralPath (Join-Path $root '.git'))) {
    & 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe' -C $root init -b main
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
exit 0
