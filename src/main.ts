/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate, Live2dConfig } from './lappdelegate';
import * as LAppDefine from './lappdefine';


async function initializeLive2D(config: Live2dConfig) {

}

/**
 * ブラウザロード後の処理
 */
window.onload = (): void => {
  // create the application instance
  if (LAppDelegate.getInstance().initialize({
    modelRoot: './sdwhite cat b'
  }) == false) {
    return;
  }

  LAppDelegate.getInstance().run();
};

/**
 * 終了時の処理
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();

/**
 * Process when changing screen size.
 */
window.onresize = () => {
  if (LAppDefine.CanvasSize === 'auto') {
    LAppDelegate.getInstance().onResize();
  }
};

export {
    initializeLive2D
};