import { describe, expect, it } from 'vitest';

import order from '@/utils/order';


describe('etichette degli stati', () => {
  it('ha un titolo per ogni stato interno', () => {
    order.LABELS.forEach((label) => {
      expect(label.value).toBeTruthy();
      expect(label.title).toBeTruthy();
    });
  });

  it('traduce gli stati interni principali', () => {
    const titoli = Object.fromEntries(order.LABELS.map(({ value, title }) => [value, title]));

    expect(titoli.Acquired).toBe('Acquisito');
    expect(titoli.Scheduled).toBe('In Bdx');
    expect(titoli.Delivered).toBe('Completato');
  });

  it('non ripete i valori', () => {
    const valori = order.LABELS.map(({ value }) => value);

    expect(new Set(valori).size).toBe(valori.length);
  });

  it('tiene distinti gli stati esterni da quelli interni', () => {
    const esterni = order.EXTERNAL_LABELS.map(({ value }) => value);

    expect(esterni).toContain('At Warehouse');
    expect(esterni).toContain('Cancelled to be Refunded');
    expect(order.LABELS.map(({ value }) => value)).not.toContain('At Warehouse');
  });

  it('descrive i tipi di ordine', () => {
    expect(order.TYPES.map(({ value }) => value)).toEqual(['Delivery', 'Withdraw', 'Replacement', 'Check']);
  });

  it('descrive gli stati rae', () => {
    const titoli = Object.fromEntries(order.RAE_STATUS.map(({ value, title }) => [value, title]));

    expect(titoli.Generated).toBe('Generato');
    expect(titoli['Disposed Off']).toBe('Smaltito');
  });

  it('elenca i raggruppamenti rae', () => {
    expect(order.raeGrouping).toEqual(['R1', 'R2', 'R3', 'R4']);
  });
});


describe('isTerminatedOrder', () => {
  it.each(['Delivered', 'Not Delivered', 'To Reschedule', 'Rescheduled'])(
    'considera concluso un ordine %s',
    (status) => {
      expect(order.isTerminatedOrder({ status })).toBe(true);
    }
  );

  it.each(['Acquired', 'Booked', 'Scheduled', 'Booking'])('considera aperto un ordine %s', (status) => {
    expect(order.isTerminatedOrder({ status })).toBe(false);
  });

  it('considera aperto un ordine senza stato', () => {
    expect(order.isTerminatedOrder({})).toBe(false);
  });
});
