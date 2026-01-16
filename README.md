# Clinisage Speech Widget

A standalone, embeddable speech-to-text widget for medical note-taking. This widget can be embedded into any website to provide real-time voice recording, transcription, and AI-powered medical note generation.

## Features

- 🎤 **Real-time Voice Recording**: Capture and stream audio with WebSocket support
- 📝 **Live Transcription**: Automatic speech-to-text conversion
- 📋 **AI Note Generation**: Generate medical notes from transcriptions using templates
- 👥 **Patient Management**: Link sessions to patient records
- 💾 **Session History**: Access and manage previous conversations
- 🎨 **Customizable**: Configure colors, position, and branding
- 🔒 **Secure**: API Key authentication with encrypted communications

## Quick Start

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Testing Locally

Open `test-widget.html` in your browser after building:

```bash
npm run build
open test-widget.html
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Netlify or other hosting platforms.

### Quick Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

Your widget will be available at: `https://your-site-name.netlify.app/widget.js`

## Client Integration

For clients who want to embed the widget on their website:

```html
<!-- Widget Configuration -->
<script>
    window.clinisageConfig = {
        apiKey: 'YOUR_API_KEY_HERE',
        agentName: 'Medical Assistant',
        themeColor: '#0ea5e9',
        position: 'bottom-right'
    };
</script>

<!-- Widget Script -->
<script src="https://your-deployment-url.netlify.app/widget.js" async></script>
```

See [CLIENT_INTEGRATION.md](./CLIENT_INTEGRATION.md) for complete integration guide.

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | string | ✅ Yes | - | Your API Key |
| `agentName` | string | No | `'Voice Assistant'` | Display name |
| `themeColor` | string | No | `'#0ea5e9'` | Primary color (hex) |
| `backgroundColor` | string | No | `'#ffffff'` | Background color |
| `textColor` | string | No | `'#000000'` | Text color |
| `position` | string | No | `'bottom-right'` | Widget position |

**Position options:** `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`

## Project Structure

```
speech-widget/
├── src/
│   ├── components/        # React components
│   ├── contexts/          # Context providers
│   ├── lib/              # API clients and utilities
│   ├── widget.tsx        # Widget entry point
│   └── main.tsx          # Dev entry point
├── dist/                 # Build output
├── test-widget.html      # Local testing
├── DEPLOYMENT.md         # Deployment guide
└── CLIENT_INTEGRATION.md # Client integration guide
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **WebSocket** - Real-time audio streaming
- **Tiptap** - Rich text editor for notes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building as a Widget

The project uses Vite's library mode to build a standalone UMD bundle:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
      name: 'ClinisageWidget',
      fileName: 'widget',
      formats: ['umd']
    }
  }
})
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Microphone access requires HTTPS (except on localhost)

## Security

- All API communications use HTTPS
- API Key authentication
- Sessions are isolated per user/browser
- No sensitive data stored in localStorage

## Support

- **Documentation**: See `DEPLOYMENT.md` and `CLIENT_INTEGRATION.md`
- **Issues**: Create an issue in this repository
- **Email**: support@clinisage.ai

## License

Proprietary - Clinisage © 2026

