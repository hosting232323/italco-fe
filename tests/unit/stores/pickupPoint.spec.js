import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { usePickupPointStore } from '@/stores/pickupPoint';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());


describe('pickupPoint store: unione', () => {
  it('manda la voce da mantenere e quelle da unire', () => {
    const func = vi.fn();

    usePickupPointStore().mergeElements(4, [5, 6], func);

    const [url, method, payload, callback] = http.makeRequest.mock.calls.at(-1);
    expect(url).toBe('pickup-point/merge');
    expect(method).toBe('POST');
    expect(payload.body).toEqual({ target_id: 4, source_ids: [5, 6] });
    expect(callback).toBe(func);
  });
});
