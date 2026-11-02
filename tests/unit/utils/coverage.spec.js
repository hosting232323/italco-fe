import { describe, expect, it } from 'vitest';

import coverage from '@/utils/coverage';


// 2024-01-01 e' un lunedi, 2024-01-07 la domenica della stessa settimana.
const monday = new Date(2024, 0, 1);
const wednesday = new Date(2024, 0, 3);
const sunday = new Date(2024, 0, 7);

const entryOn = (overrides = {}) => ({
  id: 1,
  day_of_week: 0,
  transport_id: 5,
  start_time: '08:00:00',
  end_time: '17:00:00',
  caps: ['70051'],
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


describe('startOfWeek', () => {
  it('torna il lunedi della stessa settimana', () => {
    expect(coverage.toISO(coverage.startOfWeek(wednesday))).toBe('2024-01-01');
    expect(coverage.toISO(coverage.startOfWeek(sunday))).toBe('2024-01-01');
  });

  it('e idempotente su un lunedi', () => {
    expect(coverage.toISO(coverage.startOfWeek(monday))).toBe('2024-01-01');
  });
});


describe('weekDays', () => {
  it('restituisce i 7 giorni da lunedi a domenica', () => {
    const week = coverage.weekDays(wednesday);

    expect(week).toHaveLength(7);
    expect(week.map(coverage.toISO)).toEqual([
      '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'
    ]);
  });
});


describe('entriesForWeekDay', () => {
  it('filtra per giorno della settimana', () => {
    const entries = [entryOn({ id: 1, day_of_week: 0 }), entryOn({ id: 2, day_of_week: 2 })];

    expect(coverage.entriesForWeekDay(0, entries).map((entry) => entry.id)).toEqual([1]);
  });

  it('ordina piu blocchi dello stesso giorno per orario di inizio', () => {
    const entries = [
      entryOn({ id: 1, day_of_week: 0, start_time: '14:00:00', end_time: '18:00:00' }),
      entryOn({ id: 2, day_of_week: 0, start_time: '08:00:00', end_time: '12:00:00' })
    ];

    expect(coverage.entriesForWeekDay(0, entries).map((entry) => entry.id)).toEqual([2, 1]);
  });

  it('regge una lista di entries mancante', () => {
    expect(coverage.entriesForWeekDay(0, undefined)).toEqual([]);
  });
});


describe('formatSlot', () => {
  it('taglia i secondi e unisce con il trattino', () => {
    expect(coverage.formatSlot({ start_time: '08:00:00', end_time: '17:30:00' })).toBe('08:00-17:30');
  });
});
