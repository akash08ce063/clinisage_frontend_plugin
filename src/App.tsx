import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import WidgetBuilder from './components/WidgetBuilder';
import PrivacyPolicy from './components/PrivacyPolicy';
import UsagePolicy from './components/UsagePolicy';
import TermsOfUse from './components/TermsOfUse';
import { WidgetProvider } from './contexts/WidgetContext';

const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'builder' | 'privacy' | 'usage' | 'terms'>('landing');

    return (
        <WidgetProvider>
            {view === 'landing' ? (
                <LandingPage
                    onLaunchDemo={() => setView('builder')}
                    onShowPrivacy={() => setView('privacy')}
                    onShowUsage={() => setView('usage')}
                    onShowTerms={() => setView('terms')}
                />
            ) : view === 'builder' ? (
                <WidgetBuilder onBack={() => setView('landing')} />
            ) : view === 'privacy' ? (
                <PrivacyPolicy onBack={() => setView('landing')} />
            ) : view === 'usage' ? (
                <UsagePolicy onBack={() => setView('landing')} />
            ) : (
                <TermsOfUse onBack={() => setView('landing')} />
            )}
        </WidgetProvider>
    );
};

export default App;
