interface DataStore {
  queryByMemberId(memberId: string): Promise<{ items: any[] }>
  insert(data: Record<string, any>): Promise<any>
  update(id: string, data: Record<string, any>): Promise<any>
}

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';

function makeWixStore(): DataStore {
  async function queryByMemberId(memberId: string) {
    const { items } = await import('@wix/data');
    return items.query(COLLECTION_ID).eq('memberId', memberId).limit(1).find();
  }

  async function insert(data: Record<string, any>) {
    const { items } = await import('@wix/data');
    return items.insert(COLLECTION_ID, data);
  }

  async function update(id: string, data: Record<string, any>) {
    const { items } = await import('@wix/data');
    return items.update(COLLECTION_ID, { _id: id, ...data });
  }

  return { queryByMemberId, insert, update };
}

function makeLocalStore(): DataStore {
  const STORAGE_KEY = 'membership-directory-profiles';
  const MEMBER_KEY = 'membership-directory-member-id';

  function getLocalMemberId(): string {
    let id = localStorage.getItem(MEMBER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(MEMBER_KEY, id);
    }
    return id;
  }

  function readAll(): any[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function writeAll(profiles: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  function generateId(): string {
    return crypto.randomUUID();
  }

  async function queryByMemberId(memberId: string) {
    const profiles = readAll();
    const items = profiles.filter(p => p.memberId === memberId);
    return { items };
  }

  async function insert(data: Record<string, any>) {
    const profiles = readAll();
    const item = { _id: generateId(), ...data, _createdDate: new Date().toISOString() };
    profiles.push(item);
    writeAll(profiles);
    return item;
  }

  async function update(id: string, data: Record<string, any>) {
    const profiles = readAll();
    const idx = profiles.findIndex(p => p._id === id);
    if (idx === -1) throw new Error('Item not found');
    profiles[idx] = { ...profiles[idx], ...data, _updatedDate: new Date().toISOString() };
    writeAll(profiles);
    return profiles[idx];
  }

  return { queryByMemberId, insert, update };
}

export function createDataStore(isEditor: boolean): DataStore {
  return isEditor ? makeLocalStore() : makeWixStore();
}

export type { DataStore };
