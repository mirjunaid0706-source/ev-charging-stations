Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   WattSquare ChargeHub - Automated Firebase Connector" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Firebase Authentication
Write-Host "[1/3] Checking Firebase Authentication..." -ForegroundColor Yellow
$loginCheck = firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please sign in to your Google Account in the browser window that opens..." -ForegroundColor Cyan
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Authentication was cancelled. Please re-run this script when ready." -ForegroundColor Red
        pause
        exit
    }
}
Write-Host "Successfully authenticated with Firebase!" -ForegroundColor Green
Write-Host ""

# Step 2: List or Select Project
Write-Host "[2/3] Fetching Firebase Projects..." -ForegroundColor Yellow
$projects = firebase projects:list --json | ConvertFrom-Json
$projectList = $projects.result

if ($projectList.Count -eq 0) {
    Write-Host "No existing Firebase project found. Creating new project 'wattsquare-ev'..." -ForegroundColor Cyan
    $projId = "wattsquare-ev-" + (Get-Random -Minimum 1000 -Maximum 9999)
    firebase projects:create $projId --display-name "WattSquare ChargeHub"
    $selectedProjectId = $projId
} else {
    Write-Host "Found existing projects:" -ForegroundColor Green
    for ($i = 0; $i -lt $projectList.Count; $i++) {
        Write-Host "  [$i] $($projectList[$i].displayName) ($($projectList[$i].projectId))"
    }
    $selectedProjectId = $projectList[0].projectId
    Write-Host "Using project: $selectedProjectId" -ForegroundColor Cyan
}

# Step 3: Fetch or Create Web App SDK Config
Write-Host ""
Write-Host "[3/3] Generating Web App Configuration & Linking to ev charging.html..." -ForegroundColor Yellow

$apps = firebase apps:list WEB --project $selectedProjectId --json | ConvertFrom-Json
$appId = ""
if ($apps.result.Count -gt 0) {
    $appId = $apps.result[0].appId
} else {
    Write-Host "Registering web app 'WattSquare Web App'..." -ForegroundColor Cyan
    $newApp = firebase apps:create WEB "WattSquare Web App" --project $selectedProjectId --json | ConvertFrom-Json
    $appId = $newApp.result.appId
}

Write-Host "Retrieving Web App SDK configuration for App ID: $appId..." -ForegroundColor Cyan
$sdkConfig = firebase apps:sdkconfig WEB $appId --project $selectedProjectId --json | ConvertFrom-Json
$cfg = $sdkConfig.result

Write-Host "Firebase Configuration retrieved:" -ForegroundColor Green
Write-Host "  API Key: $($cfg.apiKey)"
Write-Host "  Project ID: $($cfg.projectId)"
Write-Host "  Auth Domain: $($cfg.authDomain)"
Write-Host "  Storage Bucket: $($cfg.storageBucket)"

# Update ev charging.html automatically with the retrieved config
$htmlPath = "D:\my data\ev charging.html"
if (Test-Path $htmlPath) {
    $content = Get-Content -Path $htmlPath -Raw -Encoding UTF8
    
    $replacement = @"
const firebaseConfig = {
            apiKey: "$($cfg.apiKey)",
            authDomain: "$($cfg.authDomain)",
            projectId: "$($cfg.projectId)",
            storageBucket: "$($cfg.storageBucket)",
            messagingSenderId: "$($cfg.messagingSenderId)",
            appId: "$($cfg.appId)"
        };
"@

    $pattern = 'const firebaseConfig = \{[\s\S]*?\};'
    $updatedContent = [regex]::Replace($content, $pattern, $replacement, 1)
    Set-Content -Path $htmlPath -Value $updatedContent -Encoding UTF8
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " SUCCESS! ev charging.html is now connected to Firebase!" -ForegroundColor Green
    Write-Host " Project: $($cfg.projectId)" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "Could not find $htmlPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
