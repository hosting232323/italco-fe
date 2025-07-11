const hostname = import.meta.env.VITE_HOSTNAME;

const postRequest = (endpoint, body, func, method = 'POST', router = undefined, file = false) => {
  fetch(`${hostname}${endpoint}`, {
    method: method,
    headers: createHeader(router),
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

const formDataRequest = (endpoint, data, func, method = 'POST', router = undefined) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));

  fetch(`${hostname}${endpoint}`, {
    method: method,
    headers: createHeader(router, true),
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


const getRequest = (endpoint, params, func, method = 'GET', router = undefined, file = false) => {
  const url = new URL(`${hostname}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: method,
    headers: createHeader(router, file)
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


const createHeader = (router, file = false) => {
  let headers = {};
  if (file)
    headers['Accept'] = '*/*';
  else
    headers['Content-Type'] = 'application/json';
  if (router)
    headers['Authorization'] = localStorage.getItem('token');
  return headers;
};

import { useUserStore } from '@/stores/user';

const sessionHandler = (data, func, router) => {
  const userStore = useUserStore();

  if (data.status == 'session') {
    alert('Sessione scaduta');
    userStore.logout();
    router.push('/');
  } else
    func(data);
};


export default {
  postRequest,
  getRequest,
  formDataRequest,
  hostname
};
