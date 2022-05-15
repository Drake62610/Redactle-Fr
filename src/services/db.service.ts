import { openDB, type IDBPDatabase } from 'idb';

export default class DBService {
  private database: string
  private db: IDBPDatabase<unknown> | undefined

  constructor(database: string) {
    this.database = database
  }

  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue
            }
            db.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: 'id',
            })
          }
        },
      })
    } catch (error) {
      return false
    }
  }

  public async getValue(tableName: string, id: number): Promise<object> {
    if (!this.db) {
      throw Error('IndexDb not initialized');
    }
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    return result;
  }

  public async getAllValue(tableName: string): Promise<object[]> {
    if (!this.db) {
      throw Error('IndexDb not initialized');
    }
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    return result;
  }

  public async putValue(tableName: string, value: object): Promise<IDBValidKey> {
    if (!this.db) {
      throw Error('IndexDb not initialized');
    }
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    return result;
  }
}
