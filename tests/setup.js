import { beforeEach, vi } from 'vitest';


// Vuetify si aspetta API di layout che jsdom non implementa.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.visualViewport = global.visualViewport ?? { addEventListener() {}, removeEventListener() {} };

// jsdom non implementa gli object URL usati per le anteprime dei file.
if (!URL.createObjectURL) {
  URL.createObjectURL = (file) => `blob:${file.name}`;
  URL.revokeObjectURL = () => {};
}

if (!window.matchMedia)
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {}
  });


// I test non devono mai uscire verso il backend o aprire dialog del browser.
beforeEach(() => {
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fetch non mockata in questo test'))));
});
