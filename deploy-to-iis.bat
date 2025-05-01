@echo off
echo =========================================
echo Building optimized production application
echo =========================================
call npm run build:prod

echo =========================================
echo Verifying IIS installation
echo =========================================
sc query was /b | findstr /i "RUNNING"
if %ERRORLEVEL% NEQ 0 (
  echo IIS is not running or not installed.
  echo Please install IIS and try again.
  exit /b 1
)

echo =========================================
echo Checking for required IIS modules
echo =========================================
%windir%\system32\inetsrv\appcmd.exe list module /name:"RewriteModule" | findstr /i "RewriteModule"
if %ERRORLEVEL% NEQ 0 (
  echo URL Rewrite Module is not installed.
  echo Please install URL Rewrite Module from https://www.iis.net/downloads/microsoft/url-rewrite
  exit /b 1
)

echo =========================================
echo Creating/updating IIS site
echo =========================================
set SITE_NAME=createathon
set APP_POOL_NAME=createathon
set SITE_PATH=C:\inetpub\wwwroot\%SITE_NAME%
set PORT=80

echo Creating application pool %APP_POOL_NAME%...
%windir%\system32\inetsrv\appcmd.exe add apppool /name:%APP_POOL_NAME% /managedRuntimeVersion:"" /managedPipelineMode:Integrated
%windir%\system32\inetsrv\appcmd.exe set apppool /apppool.name:%APP_POOL_NAME% /enable32BitAppOnWin64:false
%windir%\system32\inetsrv\appcmd.exe set apppool /apppool.name:%APP_POOL_NAME% /recycling.periodicRestart.time:0

echo Checking if site already exists...
%windir%\system32\inetsrv\appcmd.exe list site /name:%SITE_NAME% | findstr /i "%SITE_NAME%"
if %ERRORLEVEL% NEQ 0 (
  echo Creating new site %SITE_NAME%...
  %windir%\system32\inetsrv\appcmd.exe add site /name:%SITE_NAME% /bindings:http/*:%PORT%: /physicalPath:%SITE_PATH%
  %windir%\system32\inetsrv\appcmd.exe set site /site.name:%SITE_NAME% /[path='/'].applicationPool:%APP_POOL_NAME%
) else (
  echo Site %SITE_NAME% already exists. Updating settings...
  %windir%\system32\inetsrv\appcmd.exe set site /site.name:%SITE_NAME% /[path='/'].applicationPool:%APP_POOL_NAME%
)

echo =========================================
echo Ensuring directory exists and has permissions
echo =========================================
if not exist %SITE_PATH% mkdir %SITE_PATH%
icacls %SITE_PATH% /grant "IIS_IUSRS:(OI)(CI)(RX)" /T

echo =========================================
echo Deploying files to %SITE_PATH%
echo =========================================
xcopy /E /Y dist\* %SITE_PATH%\

echo =========================================
echo Resetting IIS application pool
echo =========================================
%windir%\system32\inetsrv\appcmd.exe recycle apppool /apppool.name:%APP_POOL_NAME%

echo =========================================
echo Deployment complete!
echo =========================================
echo Site is available at http://localhost:%PORT%/ 