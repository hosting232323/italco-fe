<template>
  <v-footer :color="theme.current.value.primaryColor" style="max-height: 100px;">
    <v-container :class="{tiny_text: isMobile}">
      <v-row>
        <v-col cols="6">
          {{ new Date().getFullYear() }} —
          <strong>Gestionale Italco.mi</strong>
          <div>P. IVA IT02735550747</div>
        </v-col>
        <v-col cols="6" class="text-right">
          <router-link to="/privacy" class="footer-link">
            Privacy Policy
          </router-link>
          <div>
            Powered by 
            <a href="https://fastsite.it" class="fast-site-link" target="_blank">
              Fast-Site <v-icon right>mdi-web</v-icon>
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';

const theme = useTheme();
const isMobile = mobile.setupMobileUtils();
</script>

<style scoped>
.footer-link {
  color: #42b983;
  font-weight: bold;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #2c3e50;
  text-decoration: underline;
}

.fast-site-link {
  color: #42b983;
  font-weight: bold;
  transition: color 0.3s ease;
}

.fast-site-link:hover {
  color: #2c3e50;
  text-decoration: underline;
}

.tiny_text {
  font-size: 12px;
}
</style>
