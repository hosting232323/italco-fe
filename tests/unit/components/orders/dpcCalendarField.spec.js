import { afterEach, describe, expect, it, vi } from 'vitest';

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
const prevBtn = (wrapper) => wrapper.findAll('.dpc-calendar-header button.v-btn')[0];
const nextBtn = (wrapper) => wrapper.findAll('.dpc-calendar-header button.v-btn')[1];
const monthLabel = (wrapper) => wrapper.find('.text-capitalize').text();


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

  it('due fasce con lo stesso orario ma veicoli diversi: la selezione evidenzia solo quella cliccata', async () => {
    const iso = todayIso();
    const wrapper = mountField({
      slots: {
        [iso]: [
          { start: '09:00', end: '11:30', caps: ['76011'] },
          { start: '09:00', end: '11:30', caps: ['70056', '70122', '76011'] }
        ]
      }
    });

    await wrapper.findAllComponents({ name: 'VChip' })[1].trigger('click');

    const chips = wrapper.findAllComponents({ name: 'VChip' });
    expect(chips[0].props('variant')).toBe('outlined');
    expect(chips[1].props('variant')).toBe('flat');
  });

  it('riassegnare al componente lo stesso orario appena emesso non fa tornare la selezione sulla prima fascia duplicata', async () => {
    // Simula il round-trip col genitore: dopo l'emit, OrderDatesForm passa indietro
    // slotStart/slotEnd come prop via v-model. Senza la guardia sull'indice già
    // valido, il resync ricadrebbe sempre sulla prima fascia con lo stesso orario.
    const iso = todayIso();
    const slots = {
      [iso]: [
        { start: '09:00', end: '11:30', caps: ['76011'] },
        { start: '09:00', end: '11:30', caps: ['70056', '70122', '76011'] }
      ]
    };
    const wrapper = mountField({ slots });

    await wrapper.findAllComponents({ name: 'VChip' })[1].trigger('click');
    await wrapper.setProps({ slotStart: '09:00', slotEnd: '11:30' });

    const chips = wrapper.findAllComponents({ name: 'VChip' });
    expect(chips[0].props('variant')).toBe('outlined');
    expect(chips[1].props('variant')).toBe('flat');
  });

  it('da disabilitato non emette nulla al click', async () => {
    const iso = todayIso();
    const wrapper = mountField({ disabled: true, slots: { [iso]: [{ start: '08:00', end: '12:00' }] } });

    await dayButton(wrapper, iso).trigger('click');
    await wrapper.findComponent({ name: 'VChip' }).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  describe('navigazione tra mesi', () => {
    afterEach(() => vi.useRealTimers());

    it('permette di avanzare oltre la finestra delle date ammesse senza bloccarsi', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 8, 16, 12));

      const wrapper = mountField();

      expect(monthLabel(wrapper)).toBe('settembre 2026');

      for (const expected of ['ottobre 2026', 'novembre 2026', 'dicembre 2026', 'gennaio 2027']) {
        expect(nextBtn(wrapper).attributes('disabled')).toBeUndefined();
        await nextBtn(wrapper).trigger('click');
        expect(monthLabel(wrapper)).toBe(expected);
      }
    });

    it('non permette di tornare a un mese precedente a quello corrente', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 8, 16, 12));

      const wrapper = mountField();

      expect(prevBtn(wrapper).attributes('disabled')).toBeDefined();

      await nextBtn(wrapper).trigger('click');
      expect(prevBtn(wrapper).attributes('disabled')).toBeUndefined();

      await prevBtn(wrapper).trigger('click');
      expect(monthLabel(wrapper)).toBe('settembre 2026');
      expect(prevBtn(wrapper).attributes('disabled')).toBeDefined();
    });
  });
});
