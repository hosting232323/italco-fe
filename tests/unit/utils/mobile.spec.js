import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import mobile from '@/utils/mobile';


const HostComponent = {
  template: '<div />',
  setup() {
    return { isMobile: mobile.setupMobileUtils() };
  }
};

const resizeTo = async (width, wrapper) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
  await wrapper.vm.$nextTick();
};


describe('setupMobileUtils', () => {
  it('valuta la larghezza al mount', () => {
    window.innerWidth = 375;

    const wrapper = mount(HostComponent);

    expect(wrapper.vm.isMobile).toBe(true);
    wrapper.unmount();
  });

  it('considera desktop la soglia dei 600px', () => {
    window.innerWidth = 600;

    const wrapper = mount(HostComponent);

    expect(wrapper.vm.isMobile).toBe(false);
    wrapper.unmount();
  });

  it('reagisce al resize della finestra', async () => {
    window.innerWidth = 1280;
    const wrapper = mount(HostComponent);

    await resizeTo(400, wrapper);

    expect(wrapper.vm.isMobile).toBe(true);
    wrapper.unmount();
  });

  it('smette di ascoltare dopo lo unmount', async () => {
    window.innerWidth = 1280;
    const wrapper = mount(HostComponent);
    wrapper.unmount();

    await resizeTo(400, wrapper);

    expect(wrapper.vm.isMobile).toBe(false);
  });

  it('lo unmount di un componente spegne il resize anche per gli altri', async () => {
    // BUG: checkMobile e' una funzione a livello di modulo, quindi il browser
    // registra un solo listener per tutti i componenti che usano
    // setupMobileUtils: il primo onBeforeUnmount lo rimuove per tutti.
    window.innerWidth = 1280;
    const primo = mount(HostComponent);
    const secondo = mount(HostComponent);
    primo.unmount();

    await resizeTo(400, secondo);

    expect(secondo.vm.isMobile).toBe(false);
    secondo.unmount();
  });
});
