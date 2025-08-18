# Guía para Traducciones - Escritorio Digital

## Problemas Comunes en Archivos JSON de Traducción

### 1. Escape de Caracteres
- **CORRECTO**: `\n` (escape simple para saltos de línea)
- **INCORRECTO**: `\\n` (doble escape muestra literalmente "\n")
- **Excepción**: LaTeX requiere doble escape: `\\sqrt` es correcto

### 2. Consistencia de Claves
- Todas las claves deben coincidir exactamente entre idiomas
- Verificar que no falten claves comparando con `es/translation.json`
- Ejemplo: `"how_to_proceed"` no `"how_proceed"`

### 3. Validación JSON
Siempre validar sintaxis JSON después de editar:
```bash
python3 -m json.tool public/locales/[idioma]/translation.json > /dev/null
```

### 4. Archivos de Traducción Existentes
- `es/` - Español (archivo de referencia)
- `en/` - Inglés  
- `ca/` - Catalán
- `gl/` - Gallego

### 5. Configuración i18n
- Idiomas soportados están en `src/i18n.ts`: `supportedLngs: ['en', 'es', 'ca', 'gl']`
- Nuevos idiomas requieren actualizar esta lista
- El selector de idiomas está en `src/components/core/SettingsModal.tsx`

### 6. Cache del Navegador
- Después de cambios en traducciones, usar Ctrl+Alt+R para limpiar cache
- El servidor usa `cache: 'no-cache'` pero el navegador puede cachear

### 7. Ejemplo de sample_content Correcto
```json
"sample_content": "# Teorema de Pitágoras\n\nEn un triángulo rectángulo...\n\n$$c = \\sqrt{a^2 + b^2}$$"
```

## Proceso Recomendado para Nuevas Traducciones

1. Copiar `public/locales/es/translation.json` como base
2. Traducir valores (no claves)
3. Validar JSON
4. Actualizar `supportedLngs` en `src/i18n.ts`
5. Añadir opción en `SettingsModal.tsx`
6. Probar con cache limpio