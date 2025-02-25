'use client';

import { DBSchema, IDBPDatabase, deleteDB, openDB } from 'idb';
import { v4 as uuid } from 'uuid';
import { TaskManagerTaskInterface } from '../../interfaces/task-manager.interface';

interface IdbTaskDatabaseInterface extends DBSchema {
  task: {
    key: string;
    value: TaskManagerTaskInterface;
  };
}

const DB_NAME = 'tasks';
const DB_VERSION = 1;

let idbTaskInstance: IdbTask | null = null;

// singleton service
export class IdbTask {
  private _idb: IDBPDatabase<IdbTaskDatabaseInterface> | null = null;

  private async _deleteDatabases() {
    try {
      const databases = await window.indexedDB.databases();
      for (const db of databases) {
        if (db.name === DB_NAME && db.version && db.version < DB_VERSION) {
          console.warn(`Remove indexeddb database with name ${db.name} and version ${db.version}`);
          await deleteDB(db.name);
        }
      }
    } catch (error) {
      console.error('Error while deleting databases:', error);
    }
  }

  public static async getInstance(): Promise<IdbTask> {
    if (!idbTaskInstance) {
      idbTaskInstance = new IdbTask();
      await idbTaskInstance.init();
    }
    return idbTaskInstance;
  }

  public async init(): Promise<IdbTask> {
    try {
      await this._deleteDatabases();
      this._idb = await openDB<IdbTaskDatabaseInterface>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('task')) {
            console.warn(`Init indexeddb database with name${DB_NAME} and version ${DB_VERSION}`);
            db.createObjectStore('task');
          }
        },
      });

      return this;
    } catch (error) {
      console.error('Error while initializing the database:', error);
      throw error;
    }
  }

  public async add(title: string): Promise<TaskManagerTaskInterface> {
    if (!this._idb) {
      throw new Error('Please initialize idb');
    }
    try {
      const transaction = this._idb.transaction('task', 'readwrite');
      const store = transaction.objectStore('task');
      const id = uuid();
      const item: TaskManagerTaskInterface = { title, completed: false, id };
      await store.put(item, id);

      await transaction.done;
      return item;
    } catch (error) {
      console.error('Error while adding task:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    if (!this._idb) {
      throw new Error('Please initialize idb');
    }
    try {
      const transaction = this._idb.transaction('task', 'readwrite');
      const store = transaction.objectStore('task');
      await store.delete(id);
      await transaction.done;
    } catch (error) {
      console.error('Error while deleting task:', error);
      throw error;
    }
  }

  public async edit(
    id: string,
    data: Partial<Omit<TaskManagerTaskInterface, 'id'>>,
  ): Promise<void> {
    if (!this._idb) {
      throw new Error('Please initialize idb');
    }
    try {
      const transaction = this._idb.transaction('task', 'readwrite');
      const store = transaction.objectStore('task');
      const item = await store.get(id);
      await store.put({ ...item, ...data }, id);
      await transaction.done;
    } catch (error) {
      console.error('Error while deleting task:', error);
      throw error;
    }
  }

  public async list(): Promise<TaskManagerTaskInterface[]> {
    if (!this._idb) {
      throw new Error('Please initialize idb');
    }
    try {
      const transaction = this._idb.transaction('task', 'readonly');
      const store = transaction.objectStore('task');
      return await store.getAll();
    } catch (error) {
      console.error('Error while listing tasks:', error);
      return [];
    }
  }
}
