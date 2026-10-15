// Attività libere del borderò (pausa, rifornimento, contrattempo).
// La durata è sempre in minuti; 0 significa "non impostata".

// Durate proposte come scelta rapida nel form.
const DURATION_PRESETS = [10, 20, 30, 45, 60, 90, 120];

// 45 -> "45 min", 60 -> "1 h", 90 -> "1 h 30 min", 0/vuoto -> ''.
const formatDuration = (minutes) => {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return '';

  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

// Aggiunge i minuti a un orario "HH:MM" e riporta "HH:MM"; oltre la mezzanotte
// si ferma alle 23:59, perché una fascia non attraversa il giorno.
const addMinutes = (time, minutes) => {
  if (!time) return '';

  const [hours, mins] = time.split(':').map(Number);
  const total = Math.min(hours * 60 + mins + Number(minutes || 0), 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const durationRules = [
  (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (!Number.isInteger(Number(value)) || Number(value) < 0) return 'Inserisci minuti interi';
    return true;
  }
];

export default {
  DURATION_PRESETS,
  formatDuration,
  addMinutes,
  durationRules
};
