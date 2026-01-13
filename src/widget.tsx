import React from 'react';
import ReactDOM from 'react-dom/client';
import SpeechWidget from './components/SpeechWidget';
import { WidgetProvider } from './contexts/WidgetContext';
// import './index.css'; // We rely on vite to inject css or emit it

// Define the window interface to include clinisageConfig
interface WindowWithConfig extends Window {
    clinisageConfig?: {
        agentName?: string;
        themeColor?: string;
        backgroundColor?: string;
        textColor?: string;
        position?: string;
        authToken?: string;
        sessionId?: string;
    };
}

declare const window: WindowWithConfig;

const mountWidget = () => {
    // Check if configuration exists
    const config = window.clinisageConfig || {};

    // Create a container for the widget
    const containerId = 'clinisage-speech-widget-root';
    let container = document.getElementById(containerId);

    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }

    // Import CSS (Vite will handle bundling this if we import it, 
    // or we might need to rely on the build system injecting it).
    // For now assuming Vite injects CSS in JS or we link the style.css manually.
    // To be safe we should import index.css here.
    import('./index.css');

    // Mount the widget
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <WidgetProvider
                initialConfig={{
                    agentName: config.agentName,
                    themeColor: config.themeColor,
                    backgroundColor: config.backgroundColor,
                    textColor: config.textColor,
                    position: config.position as any,
                    authToken: config.authToken,
                    sessionId: config.sessionId
                }}
            >
                <SpeechWidget />
            </WidgetProvider>
        </React.StrictMode>
    );
};

// Auto-mount when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
