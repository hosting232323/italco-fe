import { describe, expect, it } from 'vitest';

import DpcCalendarField from '@/components/orders/DpcCalendarField.vue';

import { mountComponent } from '../../../helpers/mount';


const todayIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mountField = (props = {}) => mountComponent(DpcCalendarField, {
  props: { label: 'Data Prevista dal Cliente', allowedDates: ['all'], rules: [], ...props }
});

const dayButton = (wrapper, iso) => wrapper.find(`[data-date="${iso}"] button`);


describe('DpcCalendarField', () => {
  it('mostra l-etichetta ricevuta', () => {
    expect(mountField().text()).toContain('Data Prevista dal Cliente');
  });

  it('mostra un calendario mensile con i giorni cliccabili', () => {
    const wrapper = mountField();

    expect(wrapper.findAll('button.dpc-calendar-day').length).toBeGreaterThanOrEqual(28);
  });

  it('un giorno non ammesso e disabilitato', () => {
    const wrapper = mountField({ allowedDates: [] });

    wrapper.findAll('button.dpc-calendar-day').forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined();
    });
  });

  it('cliccare un giorno senza fasce emette solo la data', async () => {
    const iso = todayIso();
    const wrapper = mountField();

    await dayButton(wrapper, iso).trigger('click');

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([iso]);
    expect(wrapper.emitted('update:slotStart').at(-1)).toEqual([null]);
    expect(wrapper.emitted('update:slotEnd').at(-1)).toEqual([null]);
  });

  it('mostra le fasce orarie disponibili direttamente nel giorno', () => {
    const iso = todayIso();
    const wrapper = mountField({ slots: { [iso]: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] } });

    expect(wrapper.text()).toContain('08:00-12:00');
    expect(wrapper.text()).toContain('14:00-18:00');
  });

  it('cliccare una fascia emette data e fascia insieme', async () => {
    const iso = todayIso();
    const wrapper = mountField({ slots: { [iso]: [{ start: '08:00', end: '12:00' }] } });

    await wrapper.findComponent({ name: 'VChip' }).trigger('click');

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([iso]);
    expect(wrapper.emitted('update:slotStart').at(-1)).toEqual(['08:00']);
    expect(wrapper.emitted('update:slotEnd').at(-1)).toEqual(['12:00']);
  });

  it('da disabilitato non emette nulla al click', async () => {
    const iso = todayIso();
    const wrapper = mountField({ disabled: true, slots: { [iso]: [{ start: '08:00', end: '12:00' }] } });

    await dayButton(wrapper, iso).trigger('click');
    await wrapper.findComponent({ name: 'VChip' }).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
