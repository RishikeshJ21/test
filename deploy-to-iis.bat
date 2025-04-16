@echo off
echo Deploying React application to IIS...

REM Set these variables according to your IIS setup
set SITE_NAME=YourSiteName
set SITE_PATH=C:\inetpub\wwwroot\%SITE_NAME%

REM Check if the site already exists in IIS
%systemroot%\system32\inetsrv\appcmd list site %SITE_NAME% > nul 2>&1
if not errorlevel 1 (
    echo Site %SITE_NAME% already exists. Skipping site creation.
) else (
    echo Creating new site %SITE_NAME%...
    REM Create the directory if it doesn't exist
    if not exist "%SITE_PATH%" mkdir "%SITE_PATH%"
    
    REM Create the site in IIS
    %systemroot%\system32\inetsrv\appcmd add site /name:%SITE_NAME% /physicalPath:"%SITE_PATH%" /bindings:http/*:80:%SITE_NAME%
    
    echo Site created successfully.
)

REM Copy all files from the dist folder to the IIS site directory
echo Copying files to %SITE_PATH%...
xcopy /E /Y dist\* "%SITE_PATH%"

echo Deployment completed successfully!
echo.
echo IMPORTANT: Make sure URL Rewrite module is installed in IIS.
echo If not installed, download from: https://www.iis.net/downloads/microsoft/url-rewrite
echo.
echo Also ensure you have added a host entry for %SITE_NAME% in your hosts file
echo or configured DNS properly if deploying to a production environment.
echo.
pause 