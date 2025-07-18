import { useState } from 'react';
import { WIDGET_REGISTRY } from './components/widgets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WidgetWindow } from './components/core/WidgetWindow';
import { Toolbar } from './components/core/Toolbar';
import { SettingsModal } from './components/core/SettingsModal';
import type { ActiveWidget } from './types';

function App() {
  const [activeWidgets, setActiveWidgets] = useState<ActiveWidget[]>([]);
  const [highestZ, setHighestZ] = useState(100);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [pinnedWidgets, setPinnedWidgets] = useLocalStorage<string[]>(
    'pinnedWidgets',
    ['work-list', 'timer']
  );

  const addWidget = (widgetId: string) => {
    const widgetConfig = WIDGET_REGISTRY[widgetId];
    if (!widgetConfig) return;

    const newZ = highestZ + 1;
    setHighestZ(newZ);

    const newWidget: ActiveWidget = {
      instanceId: `${widgetId}-${Date.now()}`,
      widgetId: widgetId,
      position: {
        x: Math.random() * (window.innerWidth - (widgetConfig.defaultSize.width as number)),
        y: Math.random() * (window.innerHeight - (widgetConfig.defaultSize.height as number) - 80)
      },
      size: widgetConfig.defaultSize,
      zIndex: newZ,
    };
    setActiveWidgets(prev => [...prev, newWidget]);
  };

  const closeWidget = (instanceId: string) => {
    setActiveWidgets(prev => prev.filter(w => w.instanceId !== instanceId));
  };
  
  const focusWidget = (instanceId: string) => {
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setActiveWidgets(prev => prev.map(w => w.instanceId === instanceId ? { ...w, zIndex: newZ } : w));
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {activeWidgets.map(widget => {
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
            onClose={() => closeWidget(widget.instanceId)}
            onFocus={() => focusWidget(widget.instanceId)}
            onDragStop={(_e, d) => {
              setActiveWidgets(prev => prev.map(w => w.instanceId === widget.instanceId ? { ...w, position: { x: d.x, y: d.y } } : w));
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
              setActiveWidgets(prev => prev.map(w => w.instanceId === widget.instanceId ? { ...w, size: { width: ref.style.width, height: ref.style.height }, position } : w));
            }}
          >
            {/* Ya no se necesita Suspense aquí */}
            <Component />
          </WidgetWindow>
        );
      })}

      <Toolbar
        pinnedWidgets={pinnedWidgets}
        onWidgetClick={addWidget}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        pinnedWidgets={pinnedWidgets}
        setPinnedWidgets={setPinnedWidgets}
      />
    </div>
  );
}

export default App;