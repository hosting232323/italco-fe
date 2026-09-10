import { describe, expect, it } from 'vitest';

import coverage from '@/utils/coverage';


// 2024-01-01 e' un lunedi, 2024-01-07 la domenica della stessa settimana.
const monday = new Date(2024, 0, 1);
const wednesday = new Date(2024, 0, 3);
const sunday = new Date(2024, 0, 7);

const coverageOn = (overrides = {}) => ({
  id: 1,
  user_id: 10,
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  days: [{ id: 1, day_of_week: 0, start_time: '08:00:00', end_time: '17:00:00' }],
  ...overrides
});


describe('toISO', () => {
  it('formatta con mese e giorno a due cifre', () => {
    expect(coverage.toISO(new Date(2024, 0, 3))).toBe('2024-01-03');
    expect(coverage.toISO(new Date(2024, 10, 25))).toBe('2024-11-25');
  });
});


describe('weekDayIndex', () => {
  it('mette lunedi a 0 e domenica a 6', () => {
    expect(coverage.weekDayIndex(monday)).toBe(0);
    expect(coverage.weekDayIndex(sunday)).toBe(6);
  });
});


describe('coverageSlotsFor', () => {
  it('restituisce la fascia oraria del giorno coperto', () => {
    const slots = coverage.coverageSlotsFor(10, monday, [coverageOn()], []);

    expect(slots).toEqual([{ start_time: '08:00:00', end_time: '17:00:00' }]);
  });

  it('non copre un giorno della settimana fuori dalla copertura', () => {
    expect(coverage.coverageSlotsFor(10, wednesday, [coverageOn()], [])).toEqual([]);
  });

  it('non copre una data fuori dalla finestra', () => {
    const past = new Date(2023, 11, 25);

    expect(coverage.coverageSlotsFor(10, past, [coverageOn()], [])).toEqual([]);
  });

  it('ignora le coperture di un altro corriere', () => {
    expect(coverage.coverageSlotsFor(99, monday, [coverageOn()], [])).toEqual([]);
  });

  it('azzera le fasce se il corriere e assente quel giorno', () => {
    const absences = [{ user_id: 10, start_date: '2024-01-01', end_date: '2024-01-01' }];

    expect(coverage.coverageSlotsFor(10, monday, [coverageOn()], absences)).toEqual([]);
  });

  it('ordina piu fasce per orario di inizio e regge days mancante', () => {
    const coverages = [
      coverageOn({ id: 1, days: [{ id: 1, day_of_week: 0, start_time: '14:00:00', end_time: '18:00:00' }] }),
      coverageOn({ id: 2, days: [{ id: 2, day_of_week: 0, start_time: '08:00:00', end_time: '12:00:00' }] }),
      coverageOn({ id: 3, days: undefined })
    ];

    const slots = coverage.coverageSlotsFor(10, monday, coverages, []);

    expect(slots.map((slot) => slot.start_time)).toEqual(['08:00:00', '14:00:00']);
  });
});


describe('isAbsentOnCoveredDay', () => {
  it('e falso senza assenze', () => {
    expect(coverage.isAbsentOnCoveredDay(10, monday, [coverageOn()], [])).toBe(false);
  });

  it('e falso se l-assenza cade su un giorno non coperto', () => {
    const absences = [{ user_id: 10, start_date: '2024-01-03', end_date: '2024-01-03' }];

    expect(coverage.isAbsentOnCoveredDay(10, wednesday, [coverageOn()], absences)).toBe(false);
  });

  it('e vero quando l-assenza copre un giorno altrimenti coperto', () => {
    const absences = [{ user_id: 10, start_date: '2024-01-01', end_date: '2024-01-05' }];

    expect(coverage.isAbsentOnCoveredDay(10, monday, [coverageOn()], absences)).toBe(true);
  });

  it('regge una copertura senza days', () => {
    const absences = [{ user_id: 10, start_date: '2024-01-01', end_date: '2024-01-01' }];

    expect(coverage.isAbsentOnCoveredDay(10, monday, [coverageOn({ days: undefined })], absences)).toBe(false);
  });
});


describe('formatSlot', () => {
  it('taglia i secondi e unisce con il trattino', () => {
    expect(coverage.formatSlot({ start_time: '08:00:00', end_time: '17:30:00' })).toBe('08:00-17:30');
  });
});
