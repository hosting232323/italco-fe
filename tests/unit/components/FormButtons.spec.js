import { describe, expect, it } from 'vitest';

import FormButtons from '@/components/FormButtons.vue';

import { mountComponent } from '../../helpers/mount';


const mountButtons = (props = {}) => mountComponent(FormButtons, { props: { loading: false, ...props } });

const submitButton = (wrapper) => wrapper.findAll('.v-btn')[0];
const cancelButton = (wrapper) => wrapper.findAll('.v-btn')[1];


describe('FormButtons', () => {
  it('usa Invia come etichetta di default', () => {
    expect(submitButton(mountButtons()).text()).toBe('Invia');
  });

  it('mostra l-etichetta richiesta', () => {
    expect(submitButton(mountButtons({ submitText: 'Salva' })).text()).toBe('Salva');
  });

  it('il pulsante principale invia il form', () => {
    expect(submitButton(mountButtons()).attributes('type')).toBe('submit');
  });

  it('in caricamento blocca l-annulla', () => {
    const wrapper = mountButtons({ loading: true });

    expect(submitButton(wrapper).classes()).toContain('v-btn--loading');
    expect(cancelButton(wrapper).attributes('disabled')).toBeDefined();
  });

  it('emette l-annullamento', async () => {
    const wrapper = mountButtons();

    await cancelButton(wrapper).trigger('click');

    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
