import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Eye, Code } from 'lucide-react';
import './HtmlSandboxWidget.css';

export const HtmlSandboxWidget: FC = () => {
  const [code, setCode] = useState(
    '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; background-color: #282c34; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\n    h1 { color: #61dafb; }\n  </style>\n</head>\n<body>\n  <h1>¡Pega tu código aquí!</h1>\n  <script>\n    // Tu JavaScript\n  </script>\n</body>\n</html>'
  );
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  return (
    <div className="html-sandbox-widget">
      <button
        onClick={() => setIsEditorVisible(!isEditorVisible)}
        className="toggle-view-button"
        title={isEditorVisible ? 'Mostrar Vista Previa' : 'Mostrar Código'}
      >
        {isEditorVisible ? <Eye size={20} /> : <Code size={20} />}
      </button>

      {isEditorVisible && (
        <div className="editor-area">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="code-textarea"
          />
        </div>
      )}

      <div className={`preview-area ${isEditorVisible ? 'hidden' : ''}`}>
        <iframe
          srcDoc={code}
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin"
          className="preview-iframe"
        />
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'html-sandbox',
  title: 'HTML Sandbox',
  icon: <img src="/escritorio/icons/HtmlSandbox.png" alt="HTML Sandbox" width="52" height="52" />,
  defaultSize: { width: 600, height: 450 },
};