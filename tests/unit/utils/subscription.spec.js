import { describe, expect, it } from 'vitest';

import subscriptionUtils from '@/utils/subscription';


describe('subscription utils', () => {
  it.each([
    ['active', 'Attivo', 'success'],
    ['trialing', 'In prova', 'success'],
    ['past_due', 'Pagamento in ritardo', 'warning'],
    ['canceled', 'Annullato', 'error'],
    ['none', 'Nessun abbonamento', 'grey']
  ])('lo stato %s si legge %s con colore %s', (status, label, color) => {
    expect(subscriptionUtils.statusLabel(status)).toBe(label);
    expect(subscriptionUtils.statusColor(status)).toBe(color);
  });

  it('uno stato sconosciuto resta com-e, in grigio', () => {
    expect(subscriptionUtils.statusLabel('paused')).toBe('paused');
    expect(subscriptionUtils.statusColor('paused')).toBe('grey');
  });

  it('formatta i centesimi in euro', () => {
    expect(subscriptionUtils.formatPrice(4900)).toContain('49,00');
    expect(subscriptionUtils.formatPrice(4900)).toContain('€');
  });

  it('formatta la data in italiano e tollera l-assenza', () => {
    expect(subscriptionUtils.formatDate('2030-01-15T00:00:00')).toBe('15/01/2030');
    expect(subscriptionUtils.formatDate(null)).toBe('');
  });
});
