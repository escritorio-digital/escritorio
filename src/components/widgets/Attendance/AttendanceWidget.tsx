import { useState } from 'react'; // 'useEffect' ha sido eliminado de esta línea
import type { FC } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import Papa from 'papaparse';
import { Users, Badge, UserPlus, Upload, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import './Attendance.css';

// --- Tipos de Datos ---
interface BadgeInfo {
  id: number;
  icon: string;
  description: string;
}

interface Student {
  id: number;
  name: string;
  status: 'present' | 'absent' | 'late';
  badges: number[];
  alerts: number[];
}

type AttendanceRecords = Record<string, Student[]>;

const AVAILABLE_BADGES: BadgeInfo[] = [
  { id: 1, icon: '⭐', description: 'Excelente Trabajo' },
  { id: 2, icon: '👍', description: 'Buena Participación' },
  { id: 3, icon: '🎯', description: 'Objetivo Cumplido' },
  { id: 4, icon: '🤝', description: 'Ayuda a Compañeros' },
];

const AVAILABLE_ALERTS: BadgeInfo[] = [
    { id: 1, icon: '💬', description: 'Platica en clase' },
    { id: 2, icon: '😴', description: 'No trabaja' },
    { id: 3, icon: '😠', description: 'Mala conducta' },
    { id: 4, icon: '✏️', description: 'Incumple con la tarea' },
];

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Componente Principal ---
export const AttendanceWidget: FC = () => {
  const [records, setRecords] = useLocalStorage<AttendanceRecords>('attendance-records', {});
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<'attendance' | 'badges' | 'alerts'>('attendance');
  const [newStudentName, setNewStudentName] = useState('');

  const dateKey = formatDate(selectedDate);
  
  const getStudentsForSelectedDate = () => {
      if (records[dateKey]) {
          return records[dateKey];
      }
      const mostRecentDateKey = Object.keys(records).sort().pop();
      if (mostRecentDateKey) {
          return records[mostRecentDateKey].map(({ id, name }) => ({
              id,
              name,
              status: 'absent' as const,
              badges: [],
              alerts: [],
          }));
      }
      return [];
  };
  
  const students = getStudentsForSelectedDate();

  const updateStudentsForDate = (newStudentList: Student[]) => {
    setRecords(prev => ({ ...prev, [dateKey]: newStudentList }));
  };
  
  const addStudent = () => {
    if (newStudentName.trim() === '') return;
    const newStudent: Student = {
      id: Date.now(),
      name: newStudentName.trim(),
      status: 'absent',
      badges: [],
      alerts: [],
    };
    const currentList = getStudentsForSelectedDate();
    updateStudentsForDate([...currentList, newStudent]);
    setNewStudentName('');
  };

  const setStatus = (id: number, status: Student['status']) => {
    const updatedStudents = students.map(s => s.id === id ? { ...s, status } : s);
    updateStudentsForDate(updatedStudents);
  };

  const toggleBadge = (studentId: number, badgeId: number) => {
    const updatedStudents = students.map(s => {
      if (s.id !== studentId) return s;
      const newBadges = s.badges.includes(badgeId) ? s.badges.filter(bId => bId !== badgeId) : [...s.badges, badgeId];
      return { ...s, badges: newBadges };
    });
    updateStudentsForDate(updatedStudents);
  };
  
  const toggleAlert = (studentId: number, alertId: number) => {
    const updatedStudents = students.map(s => {
        if (s.id !== studentId) return s;
        const newAlerts = s.alerts.includes(alertId) ? s.alerts.filter(aId => aId !== alertId) : [...s.alerts, alertId];
        return { ...s, alerts: newAlerts };
    });
    updateStudentsForDate(updatedStudents);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<any>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedStudents: Student[] = results.data.map(row => ({
          id: Number(row.id) || Date.now() + Math.random(),
          name: String(row.name || 'Sin Nombre'),
          status: 'absent',
          badges: [],
          alerts: [],
        }));
        updateStudentsForDate(importedStudents);
      }
    });
  };

  const handleExport = () => {
    const dataToExport: any[] = [];
    Object.keys(records).sort().forEach(date => {
        records[date].forEach(s => {
            dataToExport.push({
                date: date,
                id: s.id,
                name: s.name,
                status: s.status,
                badges: s.badges.join(';'),
                alerts: s.alerts.join(';'),
            });
        });
    });

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `asistencia_completa.csv`;
    link.click();
  };

  const resetAll = () => {
    if (window.confirm('¿Seguro que quieres borrar TODA la lista de estudiantes y TODOS los registros?')) {
        setRecords({});
    }
  };
  
  const renderControls = (student: Student) => {
    switch (activeTab) {
        case 'attendance':
            return (
                <div className="controls attendance-controls">
                    <button onClick={() => setStatus(student.id, 'present')} className={`status-btn present ${student.status === 'present' ? 'active' : ''}`}>Presente</button>
                    <button onClick={() => setStatus(student.id, 'absent')} className={`status-btn absent ${student.status === 'absent' ? 'active' : ''}`}>Ausente</button>
                    <button onClick={() => setStatus(student.id, 'late')} className={`status-btn late ${student.status === 'late' ? 'active' : ''}`}>Tarde</button>
                </div>
            );
        case 'badges':
            return (
                <div className="controls badge-controls">
                    {AVAILABLE_BADGES.map(badge => (
                       <button 
                         key={badge.id}
                         title={badge.description}
                         onClick={() => toggleBadge(student.id, badge.id)}
                         className={`badge-btn ${student.badges.includes(badge.id) ? 'active' : ''}`}
                       >
                         {badge.icon}
                       </button>
                    ))}
                </div>
            );
        case 'alerts':
            return (
                <div className="controls alert-controls">
                    {AVAILABLE_ALERTS.map(alert => (
                       <button 
                         key={alert.id}
                         title={alert.description}
                         onClick={() => toggleAlert(student.id, alert.id)}
                         className={`alert-btn ${student.alerts.includes(alert.id) ? 'active' : ''}`}
                       >
                         {alert.icon}
                       </button>
                    ))}
                </div>
            );
    }
  };

  return (
    <div className="attendance-widget">
      <div className="date-controls">
        <label htmlFor="attendance-date">Fecha:</label>
        <input 
            type="date" 
            id="attendance-date"
            value={dateKey}
            onChange={e => {
                const [year, month, day] = e.target.value.split('-').map(Number);
                setSelectedDate(new Date(year, month - 1, day));
            }}
        />
      </div>

      <div className="main-content">
        <div className="tabs">
          <button onClick={() => setActiveTab('attendance')} className={activeTab === 'attendance' ? 'active' : ''}><Users size={16}/> Asistencia</button>
          <button onClick={() => setActiveTab('badges')} className={activeTab === 'badges' ? 'active' : ''}><Badge size={16}/> Insignias</button>
          <button onClick={() => setActiveTab('alerts')} className={activeTab === 'alerts' ? 'active' : ''}><AlertTriangle size={16}/> Alertas</button>
        </div>

        <div className="content-area">
          {students.length === 0 ? (
            <div className="empty-state">
              <p>No hay estudiantes en la lista para esta fecha.</p>
              <p className="text-sm">Añade estudiantes o importa un archivo CSV.</p>
            </div>
          ) : (
            <ul className="student-list">
              {students.map(student => (
                <li key={student.id} className="student-item">
                  <span className="student-name">{student.name}</span>
                  {renderControls(student)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="footer">
        <div className="add-student-form">
          <input type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Nuevo estudiante..." onKeyPress={e => e.key === 'Enter' && addStudent()} />
          <button onClick={addStudent}><UserPlus size={16}/></button>
        </div>
        <div className="actions-group">
            <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} style={{display: 'none'}}/>
            <label htmlFor="csv-upload" className="action-btn" title="Importar CSV (reemplaza la lista del día actual)"><Upload size={16}/></label>
            <button onClick={handleExport} className="action-btn" title="Exportar todos los registros"><Download size={16}/></button>
            <button onClick={resetAll} className="action-btn danger" title="Borrar todo"><RotateCcw size={16}/></button>
        </div>
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'attendance-tracker',
  title: 'Control de Asistencia',
  icon: <img src="/escritorio/icons/Attendance.png" alt="Control de Asistencia" width="52" height="52" />,
  defaultSize: { width: 450, height: 600 },
};