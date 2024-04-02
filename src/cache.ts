import LAppDefine from "./lappdefine";

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

/**
 * 
 * @param url 需要请求的链接，如果 localStorage 中存在，则不会被请求
 */
export async function cacheFetch(url: string): Promise<FakeResponse> {
    if (window.localStorage && LAppDefine.LoadFromCache) {
        const arraybase64 = localStorage.getItem(url);
        if (arraybase64 !== null) {
            const arrayBuffer = base64ToArrayBuffer(arraybase64);
            const response = {
                arrayBuffer: async () => {
                    return arrayBuffer;
                }
            }
            return response;
        }
    }

    // use fetch
    const orginalResponse = await fetch(url);
    const arraybuffer = await orginalResponse.arrayBuffer();
    if (window.localStorage && LAppDefine.LoadFromCache) {
        const arraybase64 = arrayBufferToBase64(arraybuffer);
        localStorage.setItem(url, arraybase64);
    }
    return {
        arrayBuffer: async () => {
            return arraybuffer;
        }
    }
}