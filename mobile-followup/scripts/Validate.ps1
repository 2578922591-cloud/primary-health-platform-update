$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
& (Join-Path $PSScriptRoot 'Test.ps1')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$map = Get-Content -LiteralPath (Join-Path $root 'bridge\platform-map.json') -Raw | ConvertFrom-Json
if ($map.verified -ne $false) { throw '交付版必须保持 platform-map.verified=false，防止未校准录入。' }
$zip = Join-Path $root 'releases\随访采集助手-v1.0.0.zip'
if (-not (Test-Path $zip)) { throw '发行包不存在。' }
if ((Get-Item -LiteralPath $zip).Length -lt 1000) { throw '发行包异常小。' }
Write-Output 'validation-ok'
