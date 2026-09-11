// Utility per la pagina a calendario della copertura corrieri. I blocchi
// arrivano dal backend per giorno della settimana (ricorrenti, non legati a
// una data), il calendario li proietta sulla settimana visualizzata.
// Lunedì = 0 ... Domenica = 6, come date.weekday() lato backend e come
// utils/days.

const toISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const weekDayIndex = (date) => (date.getDay() + 6) % 7;


// Lunedì (mezzanotte) della settimana a cui appartiene `date`.
const startOfWeek = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekDayIndex(date));
  monday.setHours(0, 0, 0, 0);
  return monday;
};


// I 7 giorni, da Lunedì a Domenica, della settimana che contiene `date`.
const weekDays = (date) => {
  const monday = startOfWeek(date);
  return Array.from(
    { length: 7 },
    (_, index) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)
  );
};


// Blocchi previsti in un giorno della settimana, ordinati per orario di inizio.
const entriesForWeekDay = (weekDay, entries) =>
  (entries || [])
    .filter((entry) => entry.day_of_week === weekDay)
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time));


const formatSlot = (entry) => `${entry.start_time.slice(0, 5)}-${entry.end_time.slice(0, 5)}`;


export default {
  toISO,
  weekDayIndex,
  startOfWeek,
  weekDays,
  entriesForWeekDay,
  formatSlot
};
