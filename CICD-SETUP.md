# CI/CD Pipeline Setup for Createathon

This document explains how to set up the continuous integration and continuous deployment (CI/CD) pipelines for the Createathon React application using GitHub Actions.

## Overview

The CI/CD pipeline consists of three main workflows:

1. **CI (Continuous Integration)** - Builds and tests the application on every push to main branches and pull requests
2. **CD (Continuous Deployment)** - Deploys the application to production IIS server when changes are pushed to the main branch
3. **Staging Deployment** - Deploys to staging or QA environments when changes are pushed to develop/staging branches

## Prerequisites

- A GitHub repository for the application code
- Access to an IIS server for deployment
- GitHub repository secrets configured with the necessary credentials and environment variables

## Setting Up GitHub Secrets

To ensure sensitive information isn't exposed in your workflow files, add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret" and add the following secrets:

### API and reCAPTCHA Secrets

- `VITE_API_BASE_URL`: Your API base URL (e.g., "https://api.createathon.co")
- `VITE_NEWSLETTER_SUBSCRIBE_ENDPOINT`: Newsletter subscription endpoint
- `VITE_NEWSLETTER_UNSUBSCRIBE_ENDPOINT`: Newsletter unsubscription endpoint
- `VITE_EMAIL_ENDPOINT`: Email endpoint
- `VITE_RECAPTCHA_SITE_KEY`: Your reCAPTCHA site key
- `VITE_RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret key

### IIS Deployment Secrets

- `IIS_SERVER_URL`: The URL of your IIS server for Web Deploy (e.g., "https://your-server:8172/msdeploy.axd")
- `IIS_USERNAME`: Username for IIS Web Deploy authentication
- `IIS_PASSWORD`: Password for IIS Web Deploy authentication

### For SSH Deployment (Alternative Method)

- `IIS_SERVER_HOST`: Hostname or IP of your IIS server
- `IIS_SERVER_USERNAME`: SSH username
- `SSH_PRIVATE_KEY`: Your SSH private key for authentication
- `IIS_SITE_PATH`: Path to the IIS website directory on the server

### Notification Integration (Optional)

- `SLACK_WEBHOOK`: Webhook URL for Slack notifications

## Workflow Details

### CI Workflow

The CI workflow runs on every push to main/master/develop branches and on pull requests. It:

- Sets up Node.js
- Installs dependencies
- Runs linting checks
- Builds the application
- Uploads the build artifacts for later use

### CD Workflow

The CD workflow runs when changes are pushed to the main/master branch or manually triggered. It:

- Sets up Node.js
- Installs dependencies
- Builds the application with production environment variables
- Configures the web.config file
- Deploys to the production IIS server using WebDeploy

### Staging Deployment Workflow

The staging workflow runs when changes are pushed to develop/staging branches or manually triggered. It:

- Allows choosing between staging and QA environments when manually triggered
- Sets up Node.js
- Installs dependencies
- Builds the application with environment-specific variables
- Configures the web.config file
- Deploys to the appropriate IIS staging site
- Sends a notification upon completion

## Manual Deployment

You can also manually trigger deployments:

1. Go to your GitHub repository → Actions
2. Select the "Deploy to Staging" workflow
3. Click "Run workflow"
4. Choose the target environment (staging or QA)
5. Click "Run workflow" to start the deployment

## Troubleshooting

If deployments fail, check the following:

1. Ensure all required secrets are properly configured
2. Verify that the IIS server has WebDeploy installed and properly configured
3. Check that the IIS website and application pool exist with the correct names
4. Ensure the deployment user has sufficient permissions

For WebDeploy-specific issues:
- Make sure port 8172 is open on the server firewall
- Verify that the Management Service is running in IIS

## Required Server Setup

On your IIS server, you need:

1. Web Deploy (MSDeploy) installed and running
2. A configured website and application pool with the name matching your workflow configurations
3. Proper permissions for the deployment user
4. URL Rewrite module installed (for React routing) 