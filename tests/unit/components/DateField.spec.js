import { describe, expect, it } from 'vitest';

import DateField from '@/components/DateField.vue';

import { mountComponent } from '../../helpers/mount';


const mountField = (props = {}) => mountComponent(DateField, {
  props: { label: 'Data', allowedDates: ['all'], rules: [], ...props }
});

const input = (wrapper) => wrapper.find('input');


describe('DateField', () => {
  it('parte vuoto senza valore', () => {
    expect(input(mountField()).element.value).toBe('');
  });

  it('mostra la data ricevuta in formato italiano', () => {
    const wrapper = mountField({ modelValue: '2026-09-01' });

    expect(input(wrapper).element.value).toBe('01/09/2026');
  });

  it('ignora un valore non parsabile', () => {
    expect(input(mountField({ modelValue: 'non-una-data' })).element.value).toBe('');
  });

  it('emette la data in formato iso quando cambia dall-esterno', async () => {
    const wrapper = mountField();

    await wrapper.setProps({ modelValue: '2026-09-01' });

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['2026-09-01']);
    expect(input(wrapper).element.value).toBe('01/09/2026');
  });

  it('svuota il campo e la data', async () => {
    const wrapper = mountField({ modelValue: '2026-09-01' });

    await wrapper.findComponent({ name: 'VTextField' }).vm.$emit('click:clear');

    expect(input(wrapper).element.value).toBe('');
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([null]);
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
});
