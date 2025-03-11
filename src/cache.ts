import LAppDefine from "./lappdefine";
import { selectItemIndexDB, createItemIndexDB } from './db';
import { pinkLog } from "./utils";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

interface FakeResponse {
    arrayBuffer: () => Promise<ArrayBuffer>
}

interface UrlDBItem {
    url: string
    arraybuffer: ArrayBuffer
}

interface ICacheSetting {
    refreshCache: boolean
}

export const CacheFetchSetting: ICacheSetting = {
    refreshCache: false
};

/**
 * @description 获取 live2d 的数据，如果存在缓存，则从缓存中拿取，不会发生请求
 * @param url 需要请求的链接，如果 indexDB 中存在，则不会被请求
 */
export async function cacheFetch(url: string): Promise<FakeResponse> {
    if (!CacheFetchSetting.refreshCache && LAppDefine.LoadFromCache && LAppDefine.Live2dDB) {
        const item = await selectItemIndexDB<UrlDBItem>('url', url);
        if (item !== undefined) {
            const arrayBuffer = item.arraybuffer;
            const response = {
                arrayBuffer: async () => {
                    return arrayBuffer;
                }
            }
            return response;
        }
    }

    // 请求并编入缓存
    pinkLog('[Live2dRender] cacheFetch 请求并缓存 url ' + url)

    const orginalResponse = await fetch(url);
    const arraybuffer = await orginalResponse.arrayBuffer();
    if (LAppDefine.LoadFromCache && LAppDefine.Live2dDB) {
        createItemIndexDB<UrlDBItem>({ url, arraybuffer });
    }
    return {
        arrayBuffer: async () => {
            return arraybuffer;
        }
    }
}