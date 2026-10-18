import { describe, expect, it } from 'vitest';

import apiSite from '@/utils/apiSite';


const at = (href) => new URL(href);


describe('sameSiteUrl', () => {
  it('porta la pagina dal dominio vecchio al sito dell\'API, con percorso e query', () => {
    expect(apiSite.sameSiteUrl(at('https://demo.ares-logistics.it/orders?page=2#top'), 'https://demo.hubstra.it/api/'))
      .toBe('https://demo.hubstra.it/orders?page=2#top');
    expect(apiSite.sameSiteUrl(at('https://ares-logistics.it/login'), 'https://hubstra.it/api/'))
      .toBe('https://hubstra.it/login');
  });

  it('non tocca la pagina gia\' sul sito dell\'API', () => {
    expect(apiSite.sameSiteUrl(at('https://demo.hubstra.it/orders'), 'https://demo.hubstra.it/api/')).toBeNull();
    expect(apiSite.sameSiteUrl(at('https://hubstra.it/'), 'https://hubstra.it/api/')).toBeNull();
    expect(apiSite.sameSiteUrl(at('https://www.hubstra.it/'), 'https://hubstra.it/api/')).toBeNull();
  });

  it('non tocca lo sviluppo in locale e la CI, dove frontend e API cambiano solo porta', () => {
    expect(apiSite.sameSiteUrl(at('http://localhost:3000/'), 'http://localhost:8080/')).toBeNull();
    expect(apiSite.sameSiteUrl(at('http://172.17.0.3:3000/login'), 'http://172.17.0.3:8080/')).toBeNull();
  });

  it('non fa niente con un\'API relativa o mancante', () => {
    expect(apiSite.sameSiteUrl(at('https://demo.ares-logistics.it/'), '/api/')).toBeNull();
    expect(apiSite.sameSiteUrl(at('https://demo.ares-logistics.it/'), undefined)).toBeNull();
  });
});
