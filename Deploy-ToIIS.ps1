# React App IIS Deployment Script
param (
    [string]$SiteName = "createathon",
    [string]$AppPoolName = "createathon",
    [string]$SitePath = "C:\inetpub\wwwroot\$SiteName",
    [string]$Port = "80"
)

# Import the WebAdministration module
Import-Module WebAdministration

Write-Host "Deploying React application to IIS..." -ForegroundColor Green

# Check if the site directory exists, create if not
if (-not (Test-Path $SitePath)) {
    Write-Host "Creating directory: $SitePath" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SitePath -Force | Out-Null
}

# Check if the application pool exists, create if not
if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
    Write-Host "Creating Application Pool: $AppPoolName" -ForegroundColor Yellow
    New-WebAppPool -Name $AppPoolName
    
    # Configure the app pool to use .NET CLR version "No Managed Code"
    Set-ItemProperty -Path "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value ""
    Set-ItemProperty -Path "IIS:\AppPools\$AppPoolName" -Name managedPipelineMode -Value "Integrated"
}

# Check if the website exists, create if not
if (-not (Get-Website -Name $SiteName)) {
    Write-Host "Creating Website: $SiteName" -ForegroundColor Yellow
    New-Website -Name $SiteName -PhysicalPath $SitePath -ApplicationPool $AppPoolName -Port $Port -Force
} else {
    Write-Host "Website $SiteName already exists" -ForegroundColor Yellow
}

# Copy the dist directory to the site path
Write-Host "Copying files to $SitePath..." -ForegroundColor Green
Copy-Item -Path ".\dist\*" -Destination $SitePath -Recurse -Force

# Copy environment file to the IIS site directory for reference
Write-Host "Copying environment configuration..." -ForegroundColor Green
Copy-Item -Path ".\.env" -Destination "$SitePath\.env.reference" -Force

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Make sure URL Rewrite module is installed in IIS." -ForegroundColor Yellow
Write-Host "If not installed, download from: https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor Yellow
Write-Host ""
Write-Host "Also ensure you have added a host entry for $SiteName in your hosts file" -ForegroundColor Yellow
Write-Host "or configured DNS properly if deploying to a production environment." -ForegroundColor Yellow
Write-Host ""
Write-Host "To access your site, navigate to: http://localhost:$Port (if using localhost)" -ForegroundColor Green 