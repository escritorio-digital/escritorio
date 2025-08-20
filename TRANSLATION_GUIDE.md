# Guía para Traducciones - Escritorio Digital

## Problemas Comunes en Archivos JSON de Traducción

### 1. Escape de Caracteres en JSON
- **Saltos de línea**: El proyecto usa `\\n` (una barra invertida y una 'n'). Aunque el estándar JSON es `\n`, el código de la aplicación está configurado para interpretar `\\n` como un salto de línea. Usa siempre `\\n`.
- **Caracteres especiales de JSON**: Las comillas dobles `"` dentro de una cadena deben escaparse como `\"`.
- **LaTeX**: Requiere un escapado especial. Para que el intérprete de LaTeX reciba `\sqrt`, el archivo JSON debe contener `\\\\sqrt`. Esto se debe a que el parser de JSON convierte `\\\\` en una única barra invertida `\\`.

### 2. Consistencia de Claves
- Todas las claves deben coincidir exactamente entre idiomas.
- Verificar que no falten claves comparando con `es/translation.json`.
- Ejemplo: `"how_to_proceed"` no `"how_proceed"`.

### 3. Validación JSON
Siempre validar la sintaxis JSON después de editar. Un JSON inválido romperá la carga de idiomas.
```bash
python3 -m json.tool "public/locales/[idioma]/translation.json" > /dev/null
```

### 4. Archivos de Traducción Existentes
- `es/` - Español (archivo de referencia)
- `en/` - Inglés  
- `ca/` - Catalán
- `gl/` - Gallego
- `eu/` - Euskera

### 5. Configuración i18n
- Idiomas soportados están en `src/i18n.ts`: `supportedLngs: ['en', 'es', 'ca', 'gl', 'eu']`
- Nuevos idiomas requieren actualizar esta lista.
- El selector de idiomas está en `src/components/core/SettingsModal.tsx`.
- **IMPORTANTE**: Nuevos idiomas también requieren añadir manejo en la función `convertDetectedLanguage`.

### 6. Cache del Navegador
- **IMPORTANTE**: Después de cambios en traducciones, informar al usuario que use `Ctrl+Alt+R` para limpiar la caché del navegador.
- El servidor usa `cache: 'no-cache'`, pero el navegador puede cachear los archivos JSON igualmente.
- Si el usuario no ve los cambios, el problema suele ser la caché del navegador.

### 7. Ejemplo de `sample_content` Correcto
Este ejemplo muestra el uso de `\\n` para saltos de línea y `\\\\sqrt` para LaTeX.
```json
"sample_content": "# Teorema de Pitágoras\\n\\nEn un triángulo rectángulo...\\n\\n$$c = \\\\sqrt{a^2 + b^2}$$"
```

### 8. ¡Atención! Escape en Herramientas (CLI/API)
- **¡MUY IMPORTANTE!** Al usar herramientas para escribir en archivos (como `write_file` o `replace` desde un script o CLI), las barras invertidas pueden necesitar un **tercer y cuarto nivel de escapado**.
- Por ejemplo, para que en el archivo JSON final aparezca `\\sqrt`, puede que necesites escribir `\\\\\\\\sqrt` en el argumento de la herramienta.
- **Regla de oro:** Si la validación JSON falla por un `Invalid \escape`, lee el archivo que has escrito para ver qué se ha guardado realmente. Así podrás ajustar el nivel de escapado en tu comando.

## Proceso Recomendado para Nuevas Traducciones

1. Copiar `public/locales/es/translation.json` como base.
2. Traducir valores (no claves).
3. **Validar el JSON** con el comando de la sección 3. Si falla, revisar los escapes.
4. Actualizar `supportedLngs` en `src/i18n.ts`.
5. Añadir manejo del idioma en la función `convertDetectedLanguage` en `src/i18n.ts`.
6. Añadir la opción del idioma en `SettingsModal.tsx`.
7. Probar en la aplicación con la caché del navegador limpia.
