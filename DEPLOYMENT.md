# Netlify Deployment Guide

This guide explains how to deploy the Clinisage Speech Widget to Netlify.

## Prerequisites

- Node.js and npm installed
- A Netlify account
- Netlify CLI (optional but recommended): `npm install -g netlify-cli`

## Build the Widget

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the production bundle:**
   ```bash
   npm run build
   ```

   This creates a `dist` folder containing:
   - `widget.js` - The standalone widget script
   - Other assets (if any)

## Deploy to Netlify

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Login to Netlify:**
   ```bash
   netlify login
   ```

2. **Initialize the site (first time only):**
   ```bash
   netlify init
   ```
   
   Follow the prompts:
   - Choose "Create & configure a new site"
   - Select your team
   - Enter a site name (e.g., `clinisage-widget`)
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Dashboard

1. **Login to Netlify Dashboard:**
   - Go to [app.netlify.com](https://app.netlify.com)

2. **Create a new site:**
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `dist` folder

3. **Configure build settings (for continuous deployment):**
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## Your Widget URL

After deployment, your widget will be available at:
```
https://your-site-name.netlify.app/widget.js
```

## Custom Domain (Optional)

1. **Add a custom domain in Netlify:**
   - Go to Site settings → Domain management
   - Add your custom domain (e.g., `cdn.clinisage.ai`)

2. **Update DNS records:**
   - Add a CNAME record pointing to your Netlify site

3. **Enable HTTPS:**
   - Netlify automatically provisions SSL certificates

## Environment Variables

If you need to configure environment variables:

1. **In Netlify Dashboard:**
   - Go to Site settings → Environment variables
   - Add your variables

2. **In netlify.toml:**
   ```toml
   [build.environment]
     NODE_ENV = "production"
   ```

## Continuous Deployment

For automatic deployments on Git push:

1. **Connect your repository:**
   - In Netlify Dashboard, connect your GitHub/GitLab/Bitbucket repo

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Production branch: `main` (or your preferred branch)

## Testing Your Deployment

After deployment, test your widget using the example HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Testing Deployed Widget</h1>
    
    <script>
        window.clinisageConfig = {
            agentName: "My Assistant",
            themeColor: '#0ea5e9',
            position: 'bottom-right',
            authToken: 'YOUR_AUTH_TOKEN_HERE'
        };
    </script>
    
    <script src="https://your-site-name.netlify.app/widget.js" async></script>
</body>
</html>
```

## Troubleshooting

### Widget not loading
- Check browser console for errors
- Verify the script URL is correct
- Ensure CORS is properly configured

### Build failures
- Check build logs in Netlify Dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility

### CORS issues
- Add `_headers` file to your `public` folder:
  ```
  /*
    Access-Control-Allow-Origin: *
  ```

## Next Steps

- Share the widget URL with clients
- Refer to [CLIENT_INTEGRATION.md](./CLIENT_INTEGRATION.md) for integration instructions
- Set up monitoring and analytics
