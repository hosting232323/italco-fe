import { storeToRefs } from 'pinia';
import { createHttpClient } from 'generic-module';
import router from '@/plugins/router';
import logoutModule from '@/utils/logout';
import { useUserStore } from '@/stores/user';


const hostname = import.meta.env.VITE_HOSTNAME;


const getTokenRef = () => {
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);
  return token;
};

const client = createHttpClient({
  hostname,
  authHeader: 'Authorization',
  router,
  getToken: () => getTokenRef().value,
  setToken: (newToken) => { getTokenRef().value = newToken; },
  onSessionExpired: (data) => {
    alert(data.error);
    logoutModule.logout(router);
  }
});


export default {
  ...client,
  formDataRequest: client.postRequestFile,
  hostname
};
