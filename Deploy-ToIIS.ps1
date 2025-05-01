# React App IIS Deployment Script
[CmdletBinding()]
param (
    [string]$SiteName = "createathon",
    [string]$AppPoolName = "createathon",
    [string]$SitePath = "C:\inetpub\wwwroot\createathon",
    [string]$Port = "80"
)

# Ensure script is run as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "This script must be run as Administrator. Please restart PowerShell as Administrator and try again."
    Exit 1
}

# Check if IIS is installed
Write-Host "Checking for IIS installation..." -ForegroundColor Cyan
if (-not (Get-Service -Name "W3SVC" -ErrorAction SilentlyContinue)) {
    Write-Error "IIS is not installed. Please install IIS first."
    Exit 1
}

# Check for URL Rewrite Module
Write-Host "Checking for URL Rewrite Module..." -ForegroundColor Cyan
$modules = & "$env:windir\system32\inetsrv\appcmd.exe" list module /name:RewriteModule
if (-not $modules) {
    Write-Warning "URL Rewrite Module is not installed. This is required for React Router to work properly."
    Write-Warning "Download and install from: https://www.iis.net/downloads/microsoft/url-rewrite"
    $continue = Read-Host "Do you want to continue without URL Rewrite Module? (y/n)"
    if ($continue -ne "y") {
        Exit 1
    }
}

# Build the application with optimization
Write-Host "Building optimized production application..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
$env:VITE_MINIFY = "true"
npm run build:prod

# Create application pool if it doesn't exist
Write-Host "Creating/updating application pool: $AppPoolName" -ForegroundColor Cyan
$appPoolExists = & "$env:windir\system32\inetsrv\appcmd.exe" list apppool /name:$AppPoolName
if (-not $appPoolExists) {
    & "$env:windir\system32\inetsrv\appcmd.exe" add apppool /name:$AppPoolName /managedRuntimeVersion:"" /managedPipelineMode:Integrated
} else {
    Write-Host "Application pool already exists, updating settings..." -ForegroundColor Yellow
}

# Configure application pool settings
& "$env:windir\system32\inetsrv\appcmd.exe" set apppool /apppool.name:$AppPoolName /enable32BitAppOnWin64:false
& "$env:windir\system32\inetsrv\appcmd.exe" set apppool /apppool.name:$AppPoolName /processModel.identityType:ApplicationPoolIdentity
& "$env:windir\system32\inetsrv\appcmd.exe" set apppool /apppool.name:$AppPoolName /recycling.periodicRestart.time:0

# Create site if it doesn't exist
Write-Host "Creating/updating website: $SiteName" -ForegroundColor Cyan
$siteExists = & "$env:windir\system32\inetsrv\appcmd.exe" list site /name:$SiteName
if (-not $siteExists) {
    # Create directory if it doesn't exist
    if (-not (Test-Path $SitePath)) {
        New-Item -Path $SitePath -ItemType Directory -Force | Out-Null
    }
    
    & "$env:windir\system32\inetsrv\appcmd.exe" add site /name:$SiteName /bindings:http/*:$Port: /physicalPath:$SitePath
    & "$env:windir\system32\inetsrv\appcmd.exe" set site /site.name:$SiteName /[path='/'].applicationPool:$AppPoolName
} else {
    Write-Host "Site already exists, updating settings..." -ForegroundColor Yellow
    & "$env:windir\system32\inetsrv\appcmd.exe" set site /site.name:$SiteName /[path='/'].applicationPool:$AppPoolName
}

# Set proper permissions on the site directory
Write-Host "Setting permissions for IIS_IUSRS on $SitePath" -ForegroundColor Cyan
if (-not (Test-Path $SitePath)) {
    New-Item -Path $SitePath -ItemType Directory -Force | Out-Null
}
$acl = Get-Acl $SitePath
$permission = "IIS_IUSRS", "ReadAndExecute, ListDirectory", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $SitePath $acl

# Deploy application files
Write-Host "Deploying application files to $SitePath" -ForegroundColor Cyan
Copy-Item -Path ".\dist\*" -Destination $SitePath -Recurse -Force

# Recycle the application pool to ensure changes take effect
Write-Host "Recycling application pool..." -ForegroundColor Cyan
& "$env:windir\system32\inetsrv\appcmd.exe" recycle apppool /apppool.name:$AppPoolName

Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
Write-Host "Your site is available at: http://localhost:$Port/" -ForegroundColor Green 