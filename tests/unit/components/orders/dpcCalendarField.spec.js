import { describe, expect, it } from 'vitest';

import DpcCalendarField from '@/components/orders/DpcCalendarField.vue';

import { mountComponent } from '../../../helpers/mount';


const mountField = (props = {}) => mountComponent(DpcCalendarField, {
  props: { label: 'Data Prevista dal Cliente', allowedDates: ['all'], rules: [], ...props }
});

const input = (wrapper) => wrapper.find('input');


describe('DpcCalendarField', () => {
  it('parte vuoto senza valore', () => {
    expect(input(mountField()).element.value).toBe('');
  });

  it('mostra la data in formato italiano quando la data non ha fasce a disposizione', () => {
    const wrapper = mountField({ modelValue: '2026-09-01', slots: {} });

    expect(input(wrapper).element.value).toBe('01/09/2026');
  });

  it('non mostra la data finche manca la fascia, se per quella data ce ne sono', () => {
    const wrapper = mountField({
      modelValue: '2026-09-01',
      slots: { '2026-09-01': [{ start: '08:00', end: '12:00' }] }
    });

    expect(input(wrapper).element.value).toBe('');
  });

  it('mostra data e fascia insieme quando entrambe sono scelte', () => {
    const wrapper = mountField({
      modelValue: '2026-09-01',
      slotStart: '08:00',
      slotEnd: '12:00',
      slots: { '2026-09-01': [{ start: '08:00', end: '12:00' }] }
    });

    expect(input(wrapper).element.value).toBe('01/09/2026 08:00-12:00');
  });

  it('ignora un valore non parsabile', () => {
    expect(input(mountField({ modelValue: 'non-una-data' })).element.value).toBe('');
  });

  it('mostra l-etichetta ricevuta', () => {
    expect(mountField({ label: 'Data di consegna' }).text()).toContain('Data di consegna');
  });

  it('puo essere disabilitato', () => {
    expect(input(mountField({ disabled: true })).attributes('disabled')).toBeDefined();
  });

  it('applica la classe richiesta', () => {
    const wrapper = mountField({ classStyle: 'mr-2' });

    expect(wrapper.findComponent({ name: 'VTextField' }).classes()).toContain('mr-2');
  });

  it('e sempre in sola lettura: la data si sceglie dal calendario', () => {
    expect(input(mountField()).attributes('readonly')).toBeDefined();
  });

  it('svuota data e fascia al click sulla x', async () => {
    const wrapper = mountField({
      modelValue: '2026-09-01',
      slotStart: '08:00',
      slotEnd: '12:00',
      slots: { '2026-09-01': [{ start: '08:00', end: '12:00' }] }
    });

    await wrapper.findComponent({ name: 'VTextField' }).vm.$emit('click:clear');

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([null]);
    expect(wrapper.emitted('update:slotStart').at(-1)).toEqual([null]);
    expect(wrapper.emitted('update:slotEnd').at(-1)).toEqual([null]);
  });
});
