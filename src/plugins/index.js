import pinia from './pinia';
import router from './router';
import vuetify from './vuetify';
import apexcharts from './apexcharts';


export function registerPlugins(app) {
  app.
    use(vuetify).
    use(router).
    use(pinia).
    use(apexcharts);
}
