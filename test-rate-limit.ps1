# PowerShell script to test rate limiting
# Usage: .\test-rate-limit.ps1

Write-Host "Testing Rate Limiting..." -ForegroundColor Cyan
Write-Host "Making 11 requests (10 allowed, 11th should fail with 429)" -ForegroundColor Yellow
Write-Host ""

$baseUrl = "http://localhost:3000"
$successCount = 0
$rateLimitedCount = 0

# First, check if gateway is accessible
Write-Host "Checking if gateway is accessible..." -ForegroundColor Cyan
try {
    $testResponse = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Gateway is accessible (Status: $($testResponse.StatusCode))" -ForegroundColor Green
    Write-Host ""
}
catch {
    $testStatusCode = $null
    if ($_.Exception.Response) {
        $testStatusCode = [int]$_.Exception.Response.StatusCode.value__
    }
    
    if ($testStatusCode -eq 404) {
        Write-Host "✗ Gateway returned 404. Possible issues:" -ForegroundColor Red
        Write-Host "  1. Gateway might not be running" -ForegroundColor Yellow
        Write-Host "  2. Gateway might be running on a different port" -ForegroundColor Yellow
        Write-Host "  3. Route might not be configured correctly" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start the gateway, run: npm run start:dev gateway" -ForegroundColor Cyan
        Write-Host ""
        exit 1
    }
    else {
        Write-Host "✗ Cannot connect to gateway at $baseUrl" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Make sure the gateway is running: npm run start:dev gateway" -ForegroundColor Cyan
        Write-Host ""
        exit 1
    }
}

# Test regular endpoint (should be rate limited after 10 requests)
Write-Host "Testing regular endpoint: $baseUrl/" -ForegroundColor Green
1..11 | ForEach-Object {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -ErrorAction Stop
        $statusCode = $response.StatusCode
        if ($statusCode -eq 200) {
            $successCount++
            Write-Host "Request $_ : Status $statusCode" -ForegroundColor Green
        }
        else {
            Write-Host "Request $_ : Status $statusCode" -ForegroundColor Yellow
        }
    }
    catch {
        $statusCode = $null
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode.value__
        }
        
        if ($statusCode -eq 429) {
            $rateLimitedCount++
            Write-Host "Request $_ : Status 429 (Rate Limited)" -ForegroundColor Red
        }
        elseif ($statusCode -eq 404) {
            Write-Host "Request $_ : Status 404 (Not Found) - Is the gateway running?" -ForegroundColor Yellow
        }
        elseif ($statusCode) {
            Write-Host "Request $_ : Status $statusCode" -ForegroundColor Yellow
        }
        else {
            Write-Host "Request $_ : Connection Error - $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Make sure the gateway is running on $baseUrl" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "Results:" -ForegroundColor Cyan
Write-Host "  Successful: $successCount" -ForegroundColor Green
Write-Host "  Rate Limited: $rateLimitedCount" -ForegroundColor Red
Write-Host ""

# Test health endpoint (should never be rate limited)
Write-Host "Testing health endpoint (should NOT be rate limited): $baseUrl/health" -ForegroundColor Green
$healthSuccessCount = 0
1..20 | ForEach-Object {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -ErrorAction Stop
        $healthSuccessCount++
        if ($_ -le 5 -or $_ -eq 20) {
            Write-Host "Request $_ : Status $($response.StatusCode)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Request $_ : Error - $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 50
}

Write-Host ""
Write-Host "Health endpoint results:" -ForegroundColor Cyan
Write-Host "  Successful: $healthSuccessCount/20" -ForegroundColor Green
Write-Host ""

Write-Host ""
if ($rateLimitedCount -gt 0) {
    Write-Host "✓ Rate limiting is working correctly!" -ForegroundColor Green
}
elseif ($successCount -eq 0) {
    Write-Host "✗ No successful requests. Check if:" -ForegroundColor Red
    Write-Host "  1. Gateway is running (npm run start:dev gateway)" -ForegroundColor Yellow
    Write-Host "  2. Gateway is accessible at $baseUrl" -ForegroundColor Yellow
    Write-Host "  3. No firewall blocking the connection" -ForegroundColor Yellow
}
elseif ($successCount -eq 11) {
    Write-Host "⚠ All requests succeeded. Rate limiting may not be active or limit is higher than 10." -ForegroundColor Yellow
    Write-Host "  Check ThrottlerModule configuration in apps/gateway/src/gateway.module.ts" -ForegroundColor Yellow
}
else {
    Write-Host "⚠ Rate limiting may not be working (no 429 responses)" -ForegroundColor Yellow
    Write-Host "  Expected: 10 successful, 1 rate limited" -ForegroundColor Yellow
    Write-Host "  Got: $successCount successful, $rateLimitedCount rate limited" -ForegroundColor Yellow
}

