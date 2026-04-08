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
    if (data.status === 'ko') {
      throw new Error(data.message);
    }
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};


const uploadRequest = async (endpoint, data, func, method = 'POST', router = undefined) => {
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
    if (data.status === 'ko') {
      throw new Error(data.message);
    }
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
    if (data.status === 'ko') {
      throw new Error(data.message);
    }
    sessionHandler(data, func, router);
  }).catch(error => {
    console.error('Errore nella richiesta:', error);
  });
};


const downloadRequest = async (endpoint, body, method = 'GET', router = undefined, fallbackName = 'download', loading = undefined) => {
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
      headers: await createHeader(),
      body: JSON.stringify(body)
    };
  }

  fetch(url, 
    options
  )
    .then(response => {
      if (!response.ok)
        throw new Error(`Server error: ${response.status}`);

      const disposition = response.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const filename = match ? match[1].replace(/['"]/g, '') : fallbackName;

      return response.blob().then(blob => ({ blob, filename }));
    }).then(({ blob, filename }) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (loading) loading();
    }).catch(error => {
      if (loading) loading();
      console.error('Errore nel download:', error);
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
  uploadRequest,
  hostname,
  downloadRequest
};
