# Clinisage Speech Widget - Client Integration Guide

This guide shows how to integrate the Clinisage Speech Widget into your website.

## Quick Start

Add these two snippets to your HTML page, just before the closing `</body>` tag:

```html
<!-- 1. Widget Configuration -->
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        agentName: 'Medical Assistant',
        themeColor: '#0ea5e9',
        position: 'bottom-right'
    };
</script>

<!-- 2. Widget Script -->
<script src="https://your-deployment-url.netlify.app/widget.js" async></script>
```

That's it! The widget will appear on your page.

## Configuration Options

### Required

| Option | Type | Description |
|--------|------|-------------|
| `authToken` | string | Your authentication token (provided by Clinisage) |

### Optional

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentName` | string | `'Voice Assistant'` | Display name for the assistant |
| `themeColor` | string | `'#0ea5e9'` | Primary color (hex format) |
| `backgroundColor` | string | `'#ffffff'` | Widget background color |
| `textColor` | string | `'#000000'` | Text color |
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |

## Examples

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Medical Practice</title>
</head>
<body>
    <h1>Welcome to Our Practice</h1>
    <p>Your content here...</p>
    
    <!-- Widget Configuration -->
    <script>
        window.clinisageConfig = {
            authToken: 'YOUR_AUTH_TOKEN_HERE'
        };
    </script>
    
    <!-- Widget Script -->
    <script src="https://your-deployment-url.netlify.app/widget.js" async></script>
</body>
</html>
```

### Custom Styling

```html
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        agentName: 'Dr. Smith Assistant',
        themeColor: '#10b981',        // Green theme
        backgroundColor: '#f9fafb',   // Light gray background
        textColor: '#1f2937',         // Dark gray text
        position: 'bottom-left'       // Position on left side
    };
</script>
<script src="https://your-deployment-url.netlify.app/widget.js" async></script>
```

### Multiple Positions

You can place the widget in different corners:

```html
<!-- Bottom Right (default) -->
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        position: 'bottom-right'
    };
</script>

<!-- Bottom Left -->
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        position: 'bottom-left'
    };
</script>

<!-- Top Right -->
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        position: 'top-right'
    };
</script>

<!-- Top Left -->
<script>
    window.clinisageConfig = {
        authToken: 'YOUR_AUTH_TOKEN_HERE',
        position: 'top-left'
    };
</script>
```

## How It Works

1. **Configuration**: The widget reads settings from `window.clinisageConfig`
2. **Authentication**: Uses your `authToken` to connect to Clinisage services
3. **Session Management**: Automatically creates and manages user sessions
4. **Recording**: Captures and transcribes voice conversations
5. **Notes**: Generates medical notes from transcriptions

## Features

- 🎤 **Voice Recording**: Real-time audio capture and streaming
- 📝 **Transcription**: Automatic speech-to-text conversion
- 📋 **Note Generation**: AI-powered medical note creation
- 👥 **Patient Management**: Link sessions to patient records
- 💾 **Session History**: Access previous conversations and notes
- 🎨 **Customizable**: Match your brand colors and positioning

## Security

- All communications are encrypted (HTTPS)
- Authentication tokens are required for all operations
- Sessions are isolated per user/browser
- No data is stored in localStorage without encryption

## Browser Support

The widget works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Microphone access requires HTTPS (except on localhost)

## Troubleshooting

### Widget not appearing
1. Check browser console for errors
2. Verify the script URL is correct
3. Ensure `window.clinisageConfig` is set before the widget script loads

### Microphone not working
1. Ensure your site is served over HTTPS
2. Check browser permissions for microphone access
3. Verify the user granted microphone permissions

### Authentication errors
1. Verify your `authToken` is correct
2. Check that the token hasn't expired
3. Contact Clinisage support for token issues

### Styling conflicts
If the widget styling conflicts with your site:
1. The widget uses isolated styles with CSS-in-JS
2. Contact support if you need custom styling options

## Support

For issues or questions:
- Email: support@clinisage.ai
- Documentation: https://docs.clinisage.ai
- GitHub Issues: [Your repo URL]

## Version

Current version: 1.0.0

Check for updates regularly to get the latest features and security patches.
