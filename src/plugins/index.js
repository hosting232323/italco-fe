import pinia from './pinia';
import router from './router';
import vuetify from './vuetify';
import apexcharts from './apexcharts';


export function registerPlugins(app) {
  // pinia prima di router: l'installazione del router fa partire subito la
  // prima navigazione, e le guard leggono gli store.
  app.
    use(vuetify).
    use(pinia).
    use(router).
    use(apexcharts);
}
