$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root 'dist'
$release = Join-Path $root 'releases'
if (Test-Path $dist) { Remove-Item -LiteralPath $dist -Recurse -Force }
New-Item -ItemType Directory -Path $dist, (Join-Path $dist 'icons'), (Join-Path $dist 'bridge'), $release -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root 'index.html'),(Join-Path $root 'styles.css'),(Join-Path $root 'schemas.js'),(Join-Path $root 'crypto-store.js'),(Join-Path $root 'app.js'),(Join-Path $root 'manifest.webmanifest'),(Join-Path $root 'sw.js'),(Join-Path $root 'README.md') -Destination $dist
Copy-Item -LiteralPath (Join-Path $root 'icons\icon.svg') -Destination (Join-Path $dist 'icons')
Copy-Item -LiteralPath (Join-Path $root 'bridge\README.md'),(Join-Path $root 'bridge\platform-map.json'),(Join-Path $root 'bridge\prepare_import.py'),(Join-Path $root 'bridge\runner.py') -Destination (Join-Path $dist 'bridge')
$zip = Join-Path $release '随访采集助手-v1.0.0.zip'
if (Test-Path $zip) { Remove-Item -LiteralPath $zip -Force }
Compress-Archive -Path (Join-Path $dist '*') -DestinationPath $zip -CompressionLevel Optimal
Write-Output $zip
