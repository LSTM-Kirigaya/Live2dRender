/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import LAppDefine from './lappdefine';
import { LAppLive2DManager } from './lapplive2dmanager';
import { LAppMessageBox } from './lappmessagebox';
import { initialiseIndexDB } from './db';
import { addToolBox } from './toolbox';

interface Live2dRenderConfig {
    CanvasId?: string
    CanvasSize?: { height: number, width: number } | 'auto'
    BackgroundRGBA?: [number, number, number, number]
    ResourcesPath?: string
    LoadFromCache?: boolean
    ShowToolBox?: boolean
    MinifiedJSUrl: string
    Live2dCubismcoreUrl: string
}

async function launchLive2d() {
    const live2dModel = LAppDelegate.getInstance();
    const ok = live2dModel.initialize();
    if (!ok) {
        console.log('初始化失败，退出');
    } else {
        // just run
        live2dModel.run();
        // show
        if (LAppDefine.Canvas) {
            setTimeout(() => {
                LAppDefine.Canvas.style.opacity = '1';
                if (LAppDefine.ShowToolBox) {
                    addToolBox();
                }
            }, 500);
        }
    }
}


function setExpression(name: string) {
    const manager = LAppLive2DManager.getInstance();
    if (manager) {
        manager.model.setExpression(name);
    }
}

function setRandomExpression() {
    const manager = LAppLive2DManager.getInstance();
    if (manager) {
        manager.model.setRandomExpression();
    }
}

function setMessageBox(message: string, duration: number) {
    const messageBox = LAppMessageBox.getInstance();
    messageBox.setMessage(message, duration);
}

function hideMessageBox() {
    const messageBox = LAppMessageBox.getInstance();
    messageBox.hideMessageBox();
}

function revealMessageBox() {
    const messageBox = LAppMessageBox.getInstance();
    messageBox.revealMessageBox();
}


/**
 * 
 * @param src
 * @returns 
 */
function load(src: string): Promise<void> {
    const script = document.createElement('script');
    script.src = src;

    return new Promise((resolve, reject) => {
        script.onload = () => {
            resolve();
        };
        script.onerror = (error) => {
            reject(error);
        };
        document.head.appendChild(script);
    });
}

async function loadLibs(urls: string[]) {
    const ps = [];
    
    for (const url of urls) {
        ps.push(load(url));
    }

    for (const p of ps) {
        await p;
    }
}


async function initializeLive2D(config: Live2dRenderConfig) {
    // 如果有 live2d 就不创建了
    const els = document.querySelectorAll('#live2d');
    if (els.length >= 1) {
        return;
    }

    if (config.MinifiedJSUrl === undefined) {
        config.MinifiedJSUrl = 'https://unpkg.com/core-js-bundle@3.6.1/minified.js';
    }
    if (config.Live2dCubismcoreUrl === undefined) {
        config.Live2dCubismcoreUrl = 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js';
    }
    if (config.ShowToolBox === undefined) {
        config.ShowToolBox = false;
    }

    LAppDefine.ShowToolBox = config.ShowToolBox;

    await loadLibs([
        config.MinifiedJSUrl,
        config.Live2dCubismcoreUrl
    ]);

    if (config.CanvasId) {
        LAppDefine.CanvasId = config.CanvasId;
    }
    if (config.CanvasSize) {
        LAppDefine.CanvasSize = config.CanvasSize;
    }
    if (config.BackgroundRGBA) {
        LAppDefine.BackgroundRGBA = config.BackgroundRGBA;
    }
    if (config.ResourcesPath) {
        LAppDefine.ResourcesPath = config.ResourcesPath;
    }
    if (config.LoadFromCache && window.indexedDB) {
        LAppDefine.LoadFromCache = config.LoadFromCache;
        // 初始化缓存数据库
        const db = await initialiseIndexDB('db', 1, 'live2d');
        LAppDefine.Live2dDB = db;
    }

    return launchLive2d();
}

if (window) {
    /**
     * 終了時の処理
     */
    window.onbeforeunload = (): void => {
        const live2dModel = LAppDelegate.getInstance();
        if (live2dModel) {
            live2dModel.release();
        }
    }

    /**
     * Process when changing screen size.
     */
    window.onresize = () => {
        const live2dModel = LAppDelegate.getInstance();
        if (live2dModel && LAppDefine.CanvasSize === 'auto') {
            live2dModel.onResize();
        }
    };
}


export {
    initializeLive2D,
    setExpression,
    setMessageBox,
    setRandomExpression,
    hideMessageBox,
    revealMessageBox
};