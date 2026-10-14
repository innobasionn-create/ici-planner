import { T } from './theme';

function calcularInicioSemestre() {
  const hoy  = new Date();
  const anio = hoy.getFullYear();
  const mes  = hoy.getMonth() + 1;

  const primerLunes = (anio, mes) => {
    const d = new Date(anio, mes - 1, 1);
    const dia = d.getDay();
    const diff = dia === 0 ? 1 : dia === 1 ? 0 : 8 - dia;
    d.setDate(d.getDate() + diff);
    return d;
  };

  // Semestre 1: enero-julio → primer lunes de marzo
  // Semestre 2: agosto-diciembre → primer lunes de agosto
  return mes <= 7
    ? primerLunes(anio, 3)
    : primerLunes(anio, 8);
}

export const SEM_START = calcularInicioSemestre();
export const WEEKS     = 19;
// Los ramos ya no se distinguen por color (la UI es monocromo): todos usan ink.
export const COLORS    = [T.color.ink];

export { SEM_START, WEEKS, COLORS };

export function str(v) {
  return String(v === null || v === undefined ? '' : v).trim();
}

export function weekStart(n) {
  const d = new Date(SEM_START);
  d.setDate(SEM_START.getDate() + (n - 1) * 7);
  return d;
}

export function getWeekN(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  d.setDate(d.getDate() + (dia === 0 ? -6 : 1 - dia));
  d.setHours(0, 0, 0, 0);
  return Math.round((d - SEM_START) / (7 * 864e5)) + 1;
}

export function isPast(n) {
  const v = weekStart(n);
  v.setDate(v.getDate() + 6);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return v < hoy;
}

export function daysTo(f) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((new Date(f) - hoy) / 864e5);
}

export function fDate(d) {
  return new Date(d).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short'
  });
}

export function fDateLong(d) {
  return new Date(d).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

export function fHora(d) {
  return new Date(d).toLocaleTimeString('es-CL', {
    hour: '2-digit', minute: '2-digit'
  });
}

export function fRango(n) {
  const l = weekStart(n);
  const v = new Date(l);
  v.setDate(l.getDate() + 4);
  const o = { day: 'numeric', month: 'short' };
  return l.toLocaleDateString('es-CL', o) + ' – ' + v.toLocaleDateString('es-CL', o);
}

// Nivel de carga de una semana. tone: 'accent' solo para la crítica.
export function nivelInfo(c) {
  if (c >= 4) return { lbl: 'Crítica',  level: 4, tone: 'accent'  };
  if (c >= 3) return { lbl: 'Alta',     level: 3, tone: 'neutral' };
  if (c >= 2) return { lbl: 'Moderada', level: 2, tone: 'neutral' };
  if (c >= 1) return { lbl: 'Baja',     level: 1, tone: 'neutral' };
  return       { lbl: 'Libre',    level: 0, tone: 'neutral' };
}

// Días que faltan → texto del badge. tone: 'accent' (≤3 días), 'neutral' o 'muted' (pasada).
export function badge(days) {
  if (days < 0)   return { txt: 'Pasada',  tone: 'muted'   };
  if (days === 0) return { txt: '¡Hoy!',   tone: 'accent'  };
  if (days <= 3)  return { txt: days+'d',  tone: 'accent'  };
  return               { txt: days+'d',  tone: 'neutral' };
}
