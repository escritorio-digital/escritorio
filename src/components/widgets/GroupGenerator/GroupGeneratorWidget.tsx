import { useState, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
// CORRECCIÓN: Se eliminaron 'Users' y 'ListCollapse' de esta línea
import { Upload } from 'lucide-react';
import './GroupGeneratorWidget.css';

type GroupMode = 'byCount' | 'bySize';

export const GroupGeneratorWidget: FC = () => {
  const [studentList, setStudentList] = useState('Ana\nBeatriz\nCarlos\nDaniela\nEsteban\nFernanda\nGael\nHilda\nIván\nJulia');
  const [mode, setMode] = useState<GroupMode>('byCount');
  const [groupValue, setGroupValue] = useState(3);
  const [generatedGroups, setGeneratedGroups] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setStudentList(text);
      };
      reader.readAsText(file);
    }
  };

  const generateGroups = () => {
    // 1. Limpiar y obtener la lista de estudiantes
    const students = studentList.split('\n').map(s => s.trim()).filter(s => s);
    if (students.length === 0 || groupValue <= 0) {
      setGeneratedGroups([]);
      return;
    }

    // 2. Barajar la lista de forma aleatoria
    const shuffled = [...students].sort(() => Math.random() - 0.5);

    // 3. Crear los grupos
    const newGroups: string[][] = [];
    if (mode === 'byCount') {
      const numGroups = Math.max(1, Math.min(groupValue, students.length));
      for (let i = 0; i < numGroups; i++) newGroups.push([]);
      shuffled.forEach((student, index) => {
        newGroups[index % numGroups].push(student);
      });
    } else { // mode === 'bySize'
      const studentsPerGroup = Math.max(1, groupValue);
      for (let i = 0; i < shuffled.length; i += studentsPerGroup) {
        newGroups.push(shuffled.slice(i, i + studentsPerGroup));
      }
    }
    setGeneratedGroups(newGroups);
  };

  return (
    <div className="group-generator-widget">
      <div className="input-panel">
        <label className="panel-label">Lista de Estudiantes</label>
        <textarea
          value={studentList}
          onChange={(e) => setStudentList(e.target.value)}
          placeholder="Un nombre por línea..."
        />
        <button onClick={() => fileInputRef.current?.click()} className="upload-button">
          <Upload size={16} /> Cargar desde .txt
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileLoad} accept=".txt" className="hidden" />
      </div>
      <div className="controls-panel">
        <div className="mode-selection">
          <label>
            <input type="radio" name="mode" checked={mode === 'byCount'} onChange={() => setMode('byCount')} />
            Número de Grupos
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === 'bySize'} onChange={() => setMode('bySize')} />
            Estudiantes por Grupo
          </label>
        </div>
        <input
          type="number"
          value={groupValue}
          onChange={(e) => setGroupValue(Math.max(1, parseInt(e.target.value) || 1))}
          className="group-value-input"
          min="1"
        />
        <button onClick={generateGroups} className="generate-button">
          Generar Grupos
        </button>
      </div>
      <div className="output-panel">
        <label className="panel-label">Grupos Generados</label>
        <div className="groups-container">
          {generatedGroups.length > 0 ? (
            generatedGroups.map((group, index) => (
              <div key={index} className="group-card">
                <h4 className="group-title">Grupo {index + 1}</h4>
                <ul>
                  {group.map(student => <li key={student}>{student}</li>)}
                </ul>
              </div>
            ))
          ) : (
            <p className="no-groups-message">Los grupos aparecerán aquí.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'group-generator',
  title: 'Generador de Grupos',
  icon: <img src="/escritorio/icons/GroupGenerator.png" alt="Generador de Grupos" width="52" height="52" />,
  defaultSize: { width: 700, height: 550 },
};