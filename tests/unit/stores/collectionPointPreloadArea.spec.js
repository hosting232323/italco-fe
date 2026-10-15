import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useCollectionPointStore } from '@/stores/collectionPoint';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const lastRequest = () => http.makeRequest.mock.calls.at(-1);


beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());


describe('collectionPoint store: aree di precarico', () => {
  const area = { name: 'Nord', caps: ['70051'], polygon: null, id: 3, created_at: 'x' };

  it('crea un area sul punto mandando solo i campi dell\'area', () => {
    const func = vi.fn();

    useCollectionPointStore().createPreloadArea(7, area, func);

    const [url, method, payload, callback] = lastRequest();
    expect(url).toBe('collection-point/7/preload-area');
    expect(method).toBe('POST');
    expect(payload.body).toEqual({ name: 'Nord', caps: ['70051'], polygon: null });
    expect(callback).toBe(func);
  });

  it('modifica un\'area per id', () => {
    useCollectionPointStore().updatePreloadArea(3, area, vi.fn());

    const [url, method, payload] = lastRequest();
    expect(url).toBe('collection-point/preload-area/3');
    expect(method).toBe('PUT');
    expect(payload.body.caps).toEqual(['70051']);
  });

  it('elimina un\'area per id', () => {
    useCollectionPointStore().deletePreloadArea(3, vi.fn());

    const [url, method] = lastRequest();
    expect(url).toBe('collection-point/preload-area/3');
    expect(method).toBe('DELETE');
  });
});
