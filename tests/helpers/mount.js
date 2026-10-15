import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { h } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VApp } from 'vuetify/components';


const vuetify = createVuetify({ components, directives });


export const createTestPinia = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
};


export const createTestRouter = (routes = []) => createRouter({
  history: createMemoryHistory(),
  routes: routes.length ? routes : [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
});


/**
 * Monta un componente con i plugin dell'app (vuetify, pinia e, se richiesto,
 * un router in memoria). Il pinia va creato dal test quando serve preparare
 * uno store prima del mount.
 */
export const mountComponent = (component, { pinia, router, global = {}, ...options } = {}) => mount(component, {
  ...options,
  global: {
    ...global,
    plugins: [vuetify, pinia ?? createTestPinia(), ...(router ? [router] : []), ...(global.plugins ?? [])]
  }
});


/**
 * Come mountComponent, ma dentro un <v-app>: i componenti di layout senza il
 * layout di vuetify non riescono a montarsi.
 */
export const mountInApp = (component, { props, ...options } = {}) => mountComponent(
  { render: () => h(VApp, () => [h(component, props)]) },
  options
).findComponent(component);
