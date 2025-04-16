# IIS Deployment Guide for React Application

This guide outlines the steps needed to deploy this React application to IIS.

## Prerequisites

1. **Windows Server with IIS installed** (Windows 10/11 with IIS also works for testing)
2. **URL Rewrite Module** - Download and install from [Microsoft's website](https://www.iis.net/downloads/microsoft/url-rewrite)
3. **Node.js and npm** - Required for building the application

## Option 1: Automated Deployment

Two scripts are provided for automating the deployment process:

### Using the Batch File

1. The `deploy-to-iis.bat` file is configured to deploy the site with the name "createathon"
2. Run the batch file with administrator privileges

### Using the PowerShell Script

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the script with custom parameters or use the default site name "createathon":
   ```powershell
   .\Deploy-ToIIS.ps1
   ```
   
   Or customize the parameters if needed:
   ```powershell
   .\Deploy-ToIIS.ps1 -SiteName "createathon" -AppPoolName "createathon" -SitePath "C:\inetpub\wwwroot\createathon" -Port "80"
   ```

## Option 2: Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Build the application:
   ```
   npm run build
   ```

2. Create a new site in IIS:
   - Open IIS Manager
   - Right-click on "Sites" and select "Add Website"
   - Enter a name for your site
   - Set the physical path to where you want to deploy the application
   - Set the binding information and click "OK"

3. Create an application pool:
   - Right-click on "Application Pools" and select "Add Application Pool"
   - Name the pool (typically the same name as your site)
   - Set ".NET CLR version" to "No Managed Code"
   - Set "Managed pipeline mode" to "Integrated"
   - Click "OK"

4. Assign the application pool to your site:
   - Right-click on your site and select "Manage Website" > "Advanced Settings"
   - Set the "Application Pool" to the one you created
   - Click "OK"

5. Copy files to the deployment location:
   - Copy all files from the `dist` directory to your site's physical path

6. Configure URL Rewrite:
   - Ensure the `web.config` file is copied to the site's root directory
   - This file contains the necessary rewrite rules for the React Router

## Troubleshooting

1. **404 Errors**: Ensure the URL Rewrite Module is installed and the web.config file is properly configured
2. **500 Errors**: Check the IIS logs and Windows Event Viewer for more details
3. **CORS Issues**: If your app makes API calls, you may need to configure CORS headers on your API server
4. **Permission Issues**: Ensure the IIS_IUSRS group has read permissions on the website directory

## Additional Configuration

### Setting up HTTPS

For production environments, it's recommended to use HTTPS:

1. Obtain an SSL certificate (self-signed for testing or from a trusted CA for production)
2. In IIS Manager, select your site and click on "Bindings"
3. Click "Add" and select "https" from the Type dropdown
4. Select your SSL certificate and click "OK"

### Virtual Directories and Applications

If you need to set up virtual directories or applications under your main site:

1. Right-click on your site in IIS Manager and select "Add Virtual Directory" or "Add Application"
2. Configure the alias and physical path as needed 