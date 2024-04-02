import LAppDefine from "./lappdefine";

export function initialiseIndexDB(dbName: string, version: number, storeName?: string): Promise<IDBDatabase | undefined> {
    return new Promise((resolve, reject) => {
        if (window.indexedDB === undefined) {
            resolve(undefined);
        }
        const dbRequest = indexedDB.open(dbName, version);
        dbRequest.onsuccess = (event) => {
            const db = (event.currentTarget as IDBOpenDBRequest).result;
            resolve(db);
        }
        dbRequest.onerror = (event) => {
            const error = (event.currentTarget as IDBOpenDBRequest).error;
            console.log('[live2d] 打开 indexDB 错误. ' + error.message);
            resolve(undefined);
        }
        dbRequest.onupgradeneeded = (event) => {
            const db = (event.currentTarget as IDBOpenDBRequest).result;
            if (storeName) {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, { autoIncrement: true });
                    store.createIndex('url', 'url', { unique: true });
                    store.createIndex('arraybuffer', 'arraybuffer');
                }
            }
        }
    });
}

export function selectItemIndexDB<T>(key: string, value: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        const tx = LAppDefine.Live2dDB.transaction('live2d', 'readonly');
        const store = tx.objectStore('live2d');
        const queryRequest = store.index(key).get(value);
        queryRequest.onsuccess = (event) => {
            const result = (event.currentTarget as IDBOpenDBRequest).result;
            if (result) {
                resolve(result as T);
            } else {
                resolve(undefined);
            }
        }

        queryRequest.onerror = (event) => {
            resolve(undefined);
        }
    });
}

export function createItemIndexDB<T>(value: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const tx = LAppDefine.Live2dDB.transaction('live2d', 'readwrite');
        const store = tx.objectStore('live2d');
        const queryRequest = store.add(value);

        queryRequest.onsuccess = () => resolve(true);
        queryRequest.onerror = () => resolve(false);
    });
}