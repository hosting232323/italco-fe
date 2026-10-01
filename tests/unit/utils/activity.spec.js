import { describe, expect, it } from 'vitest';

import activity from '@/utils/activity';


describe('formatDuration', () => {
  it.each([
    [0, ''],
    [null, ''],
    [undefined, ''],
    ['', ''],
    [-5, ''],
    [10, '10 min'],
    [45, '45 min'],
    [60, '1 h'],
    [90, '1 h 30 min'],
    [120, '2 h'],
    ['20', '20 min']
  ])('%s -> "%s"', (minutes, expected) => {
    expect(activity.formatDuration(minutes)).toBe(expected);
  });
});


describe('addMinutes', () => {
  it('somma i minuti all\'orario', () => {
    expect(activity.addMinutes('08:00', 45)).toBe('08:45');
    expect(activity.addMinutes('10:30', 90)).toBe('12:00');
  });

  it('senza durata lascia l\'orario com\'è', () => {
    expect(activity.addMinutes('08:15', 0)).toBe('08:15');
    expect(activity.addMinutes('08:15')).toBe('08:15');
  });

  it('non supera la mezzanotte', () => {
    expect(activity.addMinutes('23:00', 120)).toBe('23:59');
  });

  it('senza orario di partenza ritorna vuoto', () => {
    expect(activity.addMinutes('', 30)).toBe('');
  });
});


describe('durationRules', () => {
  const [rule] = activity.durationRules;

  it('accetta vuoto, zero e minuti interi', () => {
    expect(rule('')).toBe(true);
    expect(rule(null)).toBe(true);
    expect(rule(undefined)).toBe(true);
    expect(rule(0)).toBe(true);
    expect(rule('45')).toBe(true);
    expect(rule(1000)).toBe(true);
  });

  it('rifiuta decimali e negativi', () => {
    expect(rule(1.5)).toBe('Inserisci minuti interi');
    expect(rule(-1)).toBe('Inserisci minuti interi');
  });
});
