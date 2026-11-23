import { getStore } from '@netlify/blobs';
import { handleGroup, type KV } from '../../src/shared/group-server';

export default async (req: Request) => {
  const store = getStore({ name: 'group-study-dates', consistency: 'strong' });
  const kv: KV = {
    get: async <T,>(key: string) => (await store.get(key, { type: 'json' })) as T | null,
    set: async (key, value) => {
      await store.setJSON(key, value);
    },
    list: async (prefix) => (await store.list({ prefix })).blobs.map((b) => b.key),
    del: async (key) => {
      await store.delete(key);
    },
  };
  return handleGroup(req, kv);
};

export const config = { path: '/api/group/:action' };
