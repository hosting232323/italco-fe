import { describe, expect, it } from 'vitest';

import { decodeId, encodeId } from '@/utils/hashids';


describe('hashids', () => {
  it('codifica un id in una stringa non numerica', () => {
    const hash = encodeId(42);

    expect(hash).not.toBe('42');
    expect(hash.length).toBeGreaterThanOrEqual(8);
  });

  it('rilegge l-id codificato', () => {
    expect(decodeId(encodeId(42))).toBe(42);
  });

  it('produce hash diversi per id diversi', () => {
    expect(encodeId(1)).not.toBe(encodeId(2));
  });

  it('e stabile per lo stesso id', () => {
    expect(encodeId(7)).toBe(encodeId(7));
  });

  it('restituisce null quando non c-e nulla da decodificare', () => {
    expect(decodeId('')).toBeNull();
  });

  it('solleva un errore su caratteri fuori dall-alfabeto', () => {
    // La libreria valida l'alfabeto: chi passa un hash arbitrario deve gestirlo
    expect(() => decodeId('non-un-hash')).toThrow(/invalid/i);
  });
});
