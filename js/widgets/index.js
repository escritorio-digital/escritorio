// js/widgets/index.js

// Importa cada widget desde su propio archivo.
import { timer } from './timer.js';
import { soundMeter } from './sound-meter.js';
import { trafficLight } from './traffic-light.js';
import { calendar } from './calendar.js';
import { workList } from './work-list.js';
import { notes } from './notes.js';
import { mediaEmbed } from './media-embed.js';
import { workGestures } from './work-gestures.js';
import { qrGenerator } from './qr-generator.js';
import { randomGroups } from './random-groups.js';
import { coopGroups } from './coop-groups.js';
import { studentPicker } from './student-picker.js';
import { dice } from './dice.js';
import { ideaStarter } from './idea-starter.js';
import { tournamentGenerator } from './tournament-generator.js';
import { scoreboard } from './scoreboard.js';

// Agrupa todos los widgets en un solo objeto 'tools' y lo exporta.
// La clave del objeto debe coincidir con el 'data-tool' del botón en el HTML.
export const tools = {
    timer,
    'sound-meter': soundMeter,
    'traffic-light': trafficLight,
    calendar,
    'work-list': workList,
    notes,
    'media-embed': mediaEmbed,
    'work-gestures': workGestures,
    'qr-generator': qrGenerator,
    'random-groups': randomGroups,
    'coop-groups': coopGroups,
    'student-picker': studentPicker,
    dice,
    'idea-starter': ideaStarter,
    'tournament-generator': tournamentGenerator,
    scoreboard,
};
