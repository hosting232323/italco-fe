import Hashids from 'hashids';

const hashids = new Hashids('mia-chiave-segreta-super-segreta', 8);

export function encodeId(id) {
  return hashids.encode(id);
}

export function decodeId(hash) {
  const decoded = hashids.decode(hash);
  if (decoded.length === 0) return null;
  return decoded[0];
}
