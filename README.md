# Escritorio Interactivo ReactJS

Este proyecto es un entorno de escritorio virtual construido con React, que permite a los usuarios añadir, mover y redimensionar "widgets" interactivos. El sistema está diseñado para que la creación de nuevos widgets sea un proceso sencillo y modular.

## 🚀 Cómo Crear un Nuevo Widget

El sistema de widgets está diseñado para descubrir y registrar nuevos widgets automáticamente siempre que se siga la estructura de archivos y convenciones de código correctas.

### 1. Estructura de Archivos

Cada widget debe residir en su propia carpeta dentro de `src/components/widgets/`. Por ejemplo, para un nuevo widget llamado "Reloj":

```
src/
└── components/
    └── widgets/
        ├── ... (otros widgets)
        └── Reloj/
            └── RelojWidget.tsx
```

### 2. Anatomía de un Widget

Un archivo de widget válido (p. ej., `RelojWidget.tsx`) debe contener dos exportaciones principales:

#### A. El Componente del Widget

Este es el componente de React que contiene toda la lógica y la interfaz de usuario del widget.

* Debe ser una exportación nombrada que termine en `Widget` (ej. `export const RelojWidget: FC = () => { ... }`) o una exportación por defecto (`export default MiWidget`).
* El componente recibe el control total sobre el área interna de la ventana del widget.

**Ejemplo de Componente:**
```tsx
// src/components/widgets/Reloj/RelojWidget.tsx
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';

export const RelojWidget: FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center justify-center h-full text-4xl font-bold text-text-dark">
      {time.toLocaleTimeString()}
    </div>
  );
};

// No olvides exportar también la configuración
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  // ... ver abajo
};
```

#### B. El Objeto de Configuración

Este es un objeto llamado `widgetConfig` que permite al sistema identificar y gestionar tu widget. Debe exportarse del mismo archivo que el componente.

El objeto debe tener la siguiente estructura, acorde a la interfaz `WidgetConfig`:

* **`id`**: Un identificador único en formato `kebab-case`.
* **`title`**: El nombre que se mostrará en la cabecera de la ventana del widget.
* **`icon`**: Un emoji que se usará como icono en la barra de herramientas y en la librería.
* **`defaultSize`**: Un objeto `{ width: number, height: number }` que define el tamaño inicial del widget.

**Ejemplo de Configuración:**
```tsx
// Dentro de src/components/widgets/Reloj/RelojWidget.tsx

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'reloj',
  title: 'Reloj Digital',
  icon: '🕰️',
  defaultSize: { width: 300, height: 150 },
};
```

### 3. Registro Automático

¡Eso es todo! No necesitas registrar el widget en ningún otro lugar. El archivo `src/components/widgets/index.ts` se encarga de importar dinámicamente cualquier archivo que termine en `*Widget.tsx` dentro del directorio de widgets, extrae el componente y su configuración, y lo añade al `WIDGET_REGISTRY`.

Una vez que hayas creado tus archivos y reiniciado el servidor de desarrollo, tu nuevo widget estará disponible automáticamente en la **Librería de Widgets** (el modal de configuración).