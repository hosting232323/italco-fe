/* eslint-disable no-console */

import { storeToRefs } from 'pinia';
import logoutModule from '@/utils/logout';
import { useUserStore } from '@/stores/user';


const hostname = import.meta.env.VITE_HOSTNAME;
const fileContentTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];


const postRequest = async (endpoint, body, func, method = 'POST', router = undefined) => {
  fetch(`${hostname}${endpoint}`, {
    method: method,
    headers: await createHeader(router),
    body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok)
      throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    if (contentType && fileContentTypes.some(type => contentType.includes(type)))
      return response.blob();
    else
      return response.json();
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


const getRequest = async (endpoint, params, func, method = 'GET', router = undefined) => {
  const url = new URL(`${hostname}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: method,
    headers: await createHeader(router)
  }).then(response => {
    if (!response.ok)
      throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf'))
      return response.blob();
    else
      return response.json();
  }).then(data => {
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};


const downloadRequest = async (endpoint, body, method = 'GET', router = undefined, loading = undefined) => {
  let url, options;
  if(method == 'GET') {
    url = new URL(`${hostname}${endpoint}`);
    Object.keys(body).forEach(key => url.searchParams.append(key, body[key]));
    options = {
      method: 'GET',
      headers: await createHeader(router)
    };
  } else {
    url = `${hostname}${endpoint}`;
    options = {
      method: 'POST',
      headers: await createHeader(router),
      body: JSON.stringify(body)
    };
  }

  fetch(url, options)
    .then(async response => {
      if (!response.ok)
        throw new Error(`Server error: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        sessionHandler(data, (d) => {
          if (d.status === 'ko') {
            alert(d.error || d.message || 'Errore durante il download');
          }
        }, router);
        throw new Error('Server returned JSON instead of a file');
      }

      return response.blob();
    }).then(blob => {
      const url = URL.createObjectURL(blob);
      const tab = window.open(url, '_blank');
      
      if (!tab) {
        const a = document.createElement('a');
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }).catch(error => {
      console.error('Errore nel download:', error);
    }).finally(() => {
      if (loading) loading();
    });
};


const createHeader = async (router, file = false) => {
  let headers = {};
  if (file)
    headers['Accept'] = '*/*';
  else
    headers['Content-Type'] = 'application/json';
  if (router)
    headers['Authorization'] = getToken().value;
  return headers;
};


const getToken = () => {
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);
  return token;
};

const sessionHandler = (data, func, router) => {
  if (data.status == 'session') {
    alert(data.error);
    logoutModule.logout(router);
  } else {
    if (data.new_token)
      getToken().value = data.new_token;
    func(data);
  }
};


export default {
  postRequest,
  getRequest,
  formDataRequest,
  hostname,
  downloadRequest
};
