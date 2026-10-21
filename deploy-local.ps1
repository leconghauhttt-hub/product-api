$ErrorActionPreference = 'Stop'
$composeFile = Join-Path $PSScriptRoot 'docker-compose-prod.yaml'

Set-Location $PSScriptRoot
docker compose -f $composeFile up -d --wait --wait-timeout 120
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose failed with exit code $LASTEXITCODE"
}

$response = Invoke-RestMethod -Uri 'http://127.0.0.1:3002/health' -TimeoutSec 10
if ($response.status -ne 'ok' -or $response.database -ne 'productdb') {
    throw 'Product API health check failed'
}

Write-Output "Product API healthy at $(Get-Date -Format s)"