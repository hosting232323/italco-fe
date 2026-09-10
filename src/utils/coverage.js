// Regole di copertura per la pagina a calendario. Un corriere è "coperto" in
// un dato giorno se quel giorno cade dentro una copertura fissa, è uno dei
// giorni della settimana previsti da quella copertura e non è toccato da
// un'assenza. Lunedì = 0 ... Domenica = 6, come date.weekday() lato backend
// e come utils/days.

const toISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const weekDayIndex = (date) => (date.getDay() + 6) % 7;


const inRange = (iso, start, end) => iso >= start && iso <= end;


// Fasce orarie coperte da un corriere in un giorno preciso: una per ogni
// copertura fissa che quel giorno prevede, ordinate per orario di inizio.
const coverageSlotsFor = (userId, date, coverages, absences) => {
  const iso = toISO(date);

  if (absences.some((absence) =>
    absence.user_id === userId && inRange(iso, absence.start_date, absence.end_date)
  ))
    return [];

  const weekDay = weekDayIndex(date);
  return coverages
    .filter((coverage) =>
      coverage.user_id === userId && inRange(iso, coverage.start_date, coverage.end_date)
    )
    .flatMap((coverage) => (coverage.days || []).filter((day) => day.day_of_week === weekDay))
    .map((day) => ({ start_time: day.start_time, end_time: day.end_time }))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
};


// true se il corriere è assente in quel giorno pur avendo una copertura fissa
// che lo prevederebbe: è il "buco" che il calendario evidenzia.
const isAbsentOnCoveredDay = (userId, date, coverages, absences) => {
  const iso = toISO(date);
  if (!absences.some((absence) =>
    absence.user_id === userId && inRange(iso, absence.start_date, absence.end_date)
  ))
    return false;

  const weekDay = weekDayIndex(date);
  return coverages.some((coverage) =>
    coverage.user_id === userId &&
    inRange(iso, coverage.start_date, coverage.end_date) &&
    (coverage.days || []).some((day) => day.day_of_week === weekDay)
  );
};


const formatSlot = (slot) => `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`;


export default {
  toISO,
  weekDayIndex,
  coverageSlotsFor,
  isAbsentOnCoveredDay,
  formatSlot
};
