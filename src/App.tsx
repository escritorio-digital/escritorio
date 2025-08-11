// src/App.tsx

import { useState, useEffect } from 'react';
import { WIDGET_REGISTRY } from './components/widgets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WidgetWindow } from './components/core/WidgetWindow';
import { Toolbar } from './components/core/Toolbar';
import { SettingsModal } from './components/core/SettingsModal';
import { CreditsModal } from './components/core/CreditsModal';
import { ThemeProvider, defaultTheme } from './context/ThemeContext';
import type { ActiveWidget, DesktopProfile, ProfileCollection } from './types';
import { Copyright } from 'lucide-react';
// --- ¡AQUÍ ESTÁ EL CAMBIO! Importamos el nuevo componente ---
import { ProfileSwitcher } from './components/core/ProfileSwitcher';

// --- Componente Hijo que Renderiza la UI ---
const DesktopUI: React.FC<{
    profiles: ProfileCollection;
    setProfiles: React.Dispatch<React.SetStateAction<ProfileCollection>>;
    activeProfileName: string;
    setActiveProfileName: (name: string) => void;
}> = ({ profiles, setProfiles, activeProfileName, setActiveProfileName }) => {
    const activeProfile = profiles[activeProfileName] || Object.values(profiles)[0];

    const setActiveWidgets = (updater: React.SetStateAction<ActiveWidget[]>) => {
        const updatedWidgets = typeof updater === 'function' ? updater(activeProfile.activeWidgets) : updater;
        const newProfileData: DesktopProfile = { ...activeProfile, activeWidgets: updatedWidgets };
        setProfiles(prev => ({ ...prev, [activeProfileName]: newProfileData }));
    };

    const setPinnedWidgets = (updater: React.SetStateAction<string[]>) => {
        const updatedPinned = typeof updater === 'function' ? updater(activeProfile.pinnedWidgets) : updater;
        const newProfileData: DesktopProfile = { ...activeProfile, pinnedWidgets: updatedPinned };
        setProfiles(prev => ({ ...prev, [activeProfileName]: newProfileData }));
    };

    const [highestZ, setHighestZ] = useState(100);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isCreditsOpen, setIsCreditsOpen] = useState(false);

    const addWidget = (widgetId: string) => {
        const widgetConfig = WIDGET_REGISTRY[widgetId];
        if (!widgetConfig) return;
        const newZ = highestZ + 1;
        setHighestZ(newZ);
        const maxX = window.innerWidth - (widgetConfig.defaultSize.width as number);
        const maxY = window.innerHeight - (widgetConfig.defaultSize.height as number) - 80;

        const newWidget: ActiveWidget = {
            instanceId: `${widgetId}-${Date.now()}`,
            widgetId: widgetId,
            position: { 
                x: Math.max(0, Math.random() * maxX), 
                y: Math.max(0, Math.random() * maxY) 
            },
            size: widgetConfig.defaultSize,
            zIndex: newZ,
        };
        setActiveWidgets(prev => [...prev, newWidget]);
    };

    const closeWidget = (instanceId: string) => setActiveWidgets(prev => prev.filter(w => w.instanceId !== instanceId));
    const focusWidget = (instanceId: string) => {
        const newZ = highestZ + 1;
        setHighestZ(newZ);
        setActiveWidgets(prev => prev.map(w => (w.instanceId === instanceId ? { ...w, zIndex: newZ } : w)));
    };
    const toggleMinimize = (instanceId: string) => setActiveWidgets(prev => prev.map(w => (w.instanceId === instanceId ? { ...w, isMinimized: !w.isMinimized } : w)));
    const toggleMaximize = (instanceId: string) => {
        const newZ = highestZ + 1;
        setHighestZ(newZ);
        setActiveWidgets(prev => prev.map(w => {
            if (w.instanceId === instanceId) {
                if (w.isMaximized) {
                    return { ...w, isMaximized: false, position: w.previousPosition || { x: 100, y: 100 }, size: w.previousSize || { width: 500, height: 400 }, zIndex: newZ };
                } else {
                    return { ...w, isMaximized: true, isMinimized: false, previousPosition: w.position, previousSize: w.size, position: { x: 0, y: 0 }, size: { width: '100vw', height: '100vh' }, zIndex: newZ };
                }
            }
            return w;
        }));
    };

    return (
        <div className="w-screen h-screen overflow-hidden">
            {activeProfile.activeWidgets.map(widget => {
                const config = WIDGET_REGISTRY[widget.widgetId];
                const Component = config.component;
                return (
                    <WidgetWindow
                        key={widget.instanceId}
                        id={widget.instanceId}
                        title={config.title}
                        position={widget.position}
                        size={widget.size}
                        zIndex={widget.zIndex}
                        isMinimized={widget.isMinimized}
                        isMaximized={widget.isMaximized}
                        onToggleMinimize={() => toggleMinimize(widget.instanceId)}
                        onToggleMaximize={() => toggleMaximize(widget.instanceId)}
                        onClose={() => closeWidget(widget.instanceId)}
                        onFocus={() => focusWidget(widget.instanceId)}
                        onDragStop={(_e, d) => setActiveWidgets(prev => prev.map(w => (w.instanceId === widget.instanceId ? { ...w, position: { x: d.x, y: d.y } } : w)))}
                        onResizeStop={(_e, _direction, ref, _delta, position) => setActiveWidgets(prev => prev.map(w => (w.instanceId === widget.instanceId ? { ...w, size: { width: ref.style.width, height: ref.style.height }, position } : w)))}
                    >
                        <Component />
                    </WidgetWindow>
                );
            })}
            <Toolbar pinnedWidgets={activeProfile.pinnedWidgets} onWidgetClick={addWidget} onSettingsClick={() => setSettingsOpen(true)} />
            <button onClick={() => setIsCreditsOpen(true)} className="fixed bottom-4 left-4 z-[9999] p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors" title="Créditos y Licencia">
                <Copyright size={24} />
            </button>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} pinnedWidgets={activeProfile.pinnedWidgets} setPinnedWidgets={setPinnedWidgets} profiles={profiles} setProfiles={setProfiles} activeProfileName={activeProfileName} setActiveProfileName={setActiveProfileName} />
            <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
            
            {/* --- ¡AQUÍ ESTÁ EL CAMBIO! Añadimos el nuevo componente a la interfaz --- */}
            <ProfileSwitcher
              profiles={profiles}
              activeProfileName={activeProfileName}
              setActiveProfileName={setActiveProfileName}
            />
        </div>
    );
};


// --- Componente Principal que Maneja el Estado y el Proveedor de Contexto ---
function App() {
    const [profiles, setProfiles] = useLocalStorage<ProfileCollection>('desktop-profiles', {
        'Escritorio Principal': {
            theme: defaultTheme,
            activeWidgets: [],
            pinnedWidgets: ['work-list', 'timer'],
        },
    });
    const [activeProfileName, setActiveProfileName] = useLocalStorage<string>(
        'active-profile-name',
        'Escritorio Principal'
    );

    const activeProfile = profiles[activeProfileName] || Object.values(profiles)[0];
    const theme = activeProfile.theme || defaultTheme;

    const handleThemeChange = (newThemeOrUpdater: any) => {
        const currentTheme = activeProfile.theme;
        const newTheme = typeof newThemeOrUpdater === 'function' ? newThemeOrUpdater(currentTheme) : newThemeOrUpdater;
        const newProfileData = { ...activeProfile, theme: newTheme };
        setProfiles(prev => ({ ...prev, [activeProfileName]: newProfileData }));
    };

    const handleWallpaperChange = (wallpaperUrl: string) => {
        handleThemeChange((prevTheme: any) => ({ ...prevTheme, '--wallpaper': wallpaperUrl }));
    };

    const resetTheme = () => {
        handleThemeChange(defaultTheme);
    };

    useEffect(() => {
        document.body.style.backgroundImage = theme['--wallpaper'];
        const root = document.documentElement;
        for (const [key, value] of Object.entries(theme)) {
            if (key !== '--wallpaper') {
                root.style.setProperty(key, value as string);
            }
        }
    }, [theme]);

    const themeContextValue = {
        theme,
        setTheme: handleThemeChange,
        setWallpaper: handleWallpaperChange,
        resetTheme,
        defaultTheme,
    };

    return (
        <ThemeProvider value={themeContextValue}>
            <DesktopUI
                profiles={profiles}
                setProfiles={setProfiles}
                activeProfileName={activeProfileName}
                setActiveProfileName={setActiveProfileName}
            />
        </ThemeProvider>
    );
}

export default App;
