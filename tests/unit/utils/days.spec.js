import { afterEach, describe, expect, it, vi } from 'vitest';

import days from '@/utils/days';


describe('weekDays', () => {
  it('parte da lunedi e finisce con domenica', () => {
    expect(days.weekDays.map(({ title }) => title)).toEqual([
      'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'
    ]);
    expect(days.weekDays.map(({ value }) => value)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('traduce il valore nel nome del giorno', () => {
    expect(days.getDayByValue(0)).toBe('Lunedì');
    expect(days.getDayByValue(6)).toBe('Domenica');
  });
});


describe('formatDateTime', () => {
  it.each([null, undefined, ''])('restituisce stringa vuota per %s', (value) => {
    expect(days.formatDateTime(value)).toBe('');
  });

  it('restituisce stringa vuota per una data non valida', () => {
    expect(days.formatDateTime('non-una-data')).toBe('');
  });

  it('formatta in italiano sul fuso di Roma', () => {
    // L'ora e' espressa in UTC: a settembre Roma e' UTC+2
    expect(days.formatDateTime('2026-09-01T08:30:15Z')).toBe('01/09/2026 10:30:15');
  });

  it('non dipende dal fuso della macchina', () => {
    expect(days.formatDateTime('2026-01-15T23:00:00Z')).toBe('16/01/2026 00:00:00');
  });
});


describe('getDateRangeArray', () => {
  afterEach(() => vi.useRealTimers());

  it('copre da oggi a due mesi dopo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12));

    const range = days.getDateRangeArray();

    expect(range[0]).toBe('2026-01-01');
    expect(range.at(-1)).toBe('2026-03-01');
  });

  it('elenca giorni consecutivi senza buchi', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 25, 12));

    const range = days.getDateRangeArray();

    expect(range.slice(0, 5)).toEqual([
      '2026-02-25', '2026-02-26', '2026-02-27', '2026-02-28', '2026-03-01'
    ]);
    expect(new Set(range).size).toBe(range.length);
  });
});
