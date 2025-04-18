import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        primaryColor: '#f34455',    
        secondaryColor: '#f7f4ef'
      }
    }
  }
});
