import { storeToRefs } from 'pinia';
import logoutModule from '@/utils/logout';
import { useUserStore } from '@/stores/user';

const hostname = import.meta.env.VITE_HOSTNAME;

const postRequest = async (endpoint, body, func, method = 'POST', router = undefined, file = false) => {
  fetch(`${hostname}${endpoint}`, {
    method: method,
    headers: await createHeader(router),
    body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok)
      throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
    return file ? response.blob() : response.json();
  }).then(data => {
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};

const formDataRequest = async (endpoint, data, func, method = 'POST', router = undefined) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));

  fetch(`${hostname}${endpoint}`, {
    method: method,
    headers: await createHeader(router, true),
    body: formData
  }).then(response => {
    if (!response.ok)
      throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
    return response.json();
  }).then(data => {
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};


const getRequest = async (endpoint, params, func, method = 'GET', router = undefined, file = false) => {
  const url = new URL(`${hostname}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: method,
    headers: await createHeader(router, file)
  }).then(response => {
    if (!response.ok)
      throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
    return file ? response.blob() : response.json();
  }).then(data => {
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};


const createHeader = async (router, file = false) => {
  let headers = {};
  if (file)
    headers['Accept'] = '*/*';
  else
    headers['Content-Type'] = 'application/json';

  if (router)
    headers['Authorization'] = localStorage.getItem('token');

  const userStore = useUserStore();
  const { role } = storeToRefs(userStore);
  if (role.value === 'Delivery' && navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
      );
      headers['X-Lat'] = position.coords.latitude;
      headers['X-Lon'] = position.coords.longitude;
    } catch (error) {
      console.warn('Posizione non disponibile:', error.message);
    }
  }

  return headers;
};

const sessionHandler = (data, func, router) => {
  if (data.status == 'session') {
    alert(data.error);
    logoutModule.logout(router);
  } else {
    if (data.new_token)
      localStorage.setItem('token', data.new_token);
    func(data);
  }
};


export default {
  postRequest,
  getRequest,
  formDataRequest,
  hostname
};
