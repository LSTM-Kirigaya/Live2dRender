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

interface Live2dRenderConfig {
    CanvasId: string
    CanvasSize: { height: number, width: number } | 'auto'
    BackgroundRGBA: [number, number, number, number]
    ResourcesPath: string
}

async function launchLive2d() {
    const live2dModel = LAppDelegate.getInstance();
    const ok = live2dModel.initialize();
    if (!ok) {
        console.log('初始化失败，退出');
        return;
    } else {
        // just run
        live2dModel.run();
        return;
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


async function initializeLive2D(config: Live2dRenderConfig) {
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
    return launchLive2d();
}

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

export {
    initializeLive2D,
    setExpression,
    setMessageBox,
    setRandomExpression,
    hideMessageBox,
    revealMessageBox
};