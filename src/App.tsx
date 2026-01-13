import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import WidgetBuilder from './components/WidgetBuilder';
import { WidgetProvider } from './contexts/WidgetContext';

const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'builder'>('landing');

    return (
        <WidgetProvider>
            {view === 'landing' ? (
                <LandingPage onLaunchDemo={() => setView('builder')} />
            ) : (
                <WidgetBuilder onBack={() => setView('landing')} />
            )}
        </WidgetProvider>
    );
};

export default App;
