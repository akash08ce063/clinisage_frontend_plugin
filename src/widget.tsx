import React from 'react';
import ReactDOM from 'react-dom/client';
import SpeechWidget from './components/SpeechWidget';
import { WidgetProvider } from './contexts/WidgetContext';
// Import CSS as raw string for injection into Shadow DOM
import styles from './index.css?inline';

class ClinisageWidget extends HTMLElement {
    private root: ReactDOM.Root | null = null;
    private mountPoint: HTMLDivElement | null = null;

    connectedCallback() {
        if (this.root) return;

        // Attach Shadow DOM to isolate styles
        const shadow = this.attachShadow({ mode: 'open' });

        // Inject Styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            :host {
                all: initial; /* Reset all inherited styles */
                font-family: 'Inter', system-ui, sans-serif;
                display: block;
            }
            * {
                box-sizing: border-box;
            }
            ${styles}
        `;
        shadow.appendChild(styleSheet);

        // Add font link if needed (Inter) - optional but good for consistency
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        shadow.appendChild(fontLink);

        // Create Mount Point
        this.mountPoint = document.createElement('div');
        // Ensure the mount point doesn't have the global dark background
        this.mountPoint.style.backgroundColor = 'transparent';
        this.mountPoint.style.minHeight = '0';
        // Reset base styles that might be set by index.css on body/root if they leak (though shadow protects mostly)
        // Actually, we need to make sure the widget container itself uses the tailwind base styles
        // But since we are importing index.css which has @tailwind base, the shadow root will have base styles.
        // We just need to be careful about body {} styles in index.css applying to the whole shadow root content.

        shadow.appendChild(this.mountPoint);

        // Read Configuration from window
        const config = (window as any).clinisageConfig || {};

        this.root = ReactDOM.createRoot(this.mountPoint);
        this.root.render(
            <React.StrictMode>
                {/* Provide a container that acts like 'body' for Tailwind base styles if needed, 
                     but we want transparency. Tailwind 'base' targets 'body' etc. 
                     Inside shadow DOM, :host is like the root.
                 */}
                <WidgetProvider
                    initialConfig={{
                        agentName: config.agentName,
                        themeColor: config.themeColor,
                        backgroundColor: config.backgroundColor,
                        textColor: config.textColor,
                        position: config.position,
                        apiKey: config.apiKey
                    }}
                >
                    <SpeechWidget />
                </WidgetProvider>
            </React.StrictMode>
        );
    }

    disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}

// Define the custom element
const ELEMENT_NAME = 'clinisage-speech-widget';
if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, ClinisageWidget);
}

// Auto-inject the element if not present
const mountWidget = () => {
    if (!document.querySelector(ELEMENT_NAME)) {
        const widgetElement = document.createElement(ELEMENT_NAME);
        document.body.appendChild(widgetElement);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
