import { cacheFetch, CacheFetchSetting } from "./cache";
import LAppDefine from "./lappdefine";
import { LAppLive2DManager } from './lapplive2dmanager';

// TODO: 适配到 live2dBoxItemCss
const _defaultIconSize = 35;
const _defaultIconBgColor = '#00A6ED';
const _defaultIconFgColor = 'white';
const _defaultExpressionContainerWidth = 300;

let container: undefined | HTMLDivElement = undefined;
let containerTimer: NodeJS.Timeout | string | number | undefined = undefined;
let collapse = false;
let widthXoffset = 35;
const live2dBoxItemCss = '__live2d-toolbox-item';

function addCssClass() {
    const style = document.createElement('style');  
    style.innerHTML = `  
    .${live2dBoxItemCss} {
        margin: 2px;
        padding: 2px;
        display: flex;
        height: ${_defaultIconSize}px;
        width: ${_defaultIconSize}px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 0.7rem;
        background-color: ${_defaultIconBgColor};
        color: ${_defaultIconFgColor};
        border-radius: 0.9em;
        transition: .5s ease;
    }

    .${live2dBoxItemCss}:hover {
        scale: 1.2;
    }
    `;
    document.head.appendChild(style);  
}

function showContainer() {
    if (container) {
        if (containerTimer) {
            clearTimeout(containerTimer);
        }
        containerTimer = setTimeout(() => {
            container.style.opacity = '1';
        }, 200);
    }
}

function hideContainer() {
    if (container && !collapse) {
        if (containerTimer) {
            clearTimeout(containerTimer);
        }
        containerTimer = setTimeout(() => {
            container.style.opacity = '0';
        }, 200);
    }
}

/**
 * @description 生成一个普通的按钮元素
 * @param text 元素内的文本
 * @returns 
 */
function createCommonIcon(text?: string) {
    const div = document.createElement('div');
    div.classList.add(live2dBoxItemCss);
    if (text) {
        div.textContent = text;
    }
    return div;
}


/**
 * @description 收起和展开 live2d
 * @param container 
 * @returns
 */
function makeLive2dCollapseIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon('➡️');
    icon.style.transition = '.5s ease';
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';

    let xoffset = 0;
    icon.onclick = async () => {
        const canvas = LAppDefine.Canvas;
        if (canvas) {
            const canvasWidth = Math.ceil(canvas.width);
            xoffset = (xoffset + canvasWidth) % (canvasWidth << 1);
            canvas.style.transform = `translateX(${xoffset}px)`;

            container.style.transform = `translateX(${Math.max(0, xoffset - widthXoffset)}px)`;
            
            if (xoffset > 0) {
                // 收起
                collapse = true;
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    showContainer();
                }, 500);
            } else {
                // 展开
                collapse = false;
                icon.style.transform = 'rotate(0)';
            }
        }
    }
    return icon;
}

/**
 * @description 收起/展开 展示表情列表
 * @param container
 * @returns
 */
function makeExpressionListCollapseIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon('>');
    icon.style.transition = '.5s ease';
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';
    icon.style.position = 'relative';

    const iconsWrapper = document.createElement('div');
    const animationDurationMS = 7;
    iconsWrapper.style.position = 'absolute';
    iconsWrapper.style.transition = `.${animationDurationMS}s cubic-bezier(0.23, 1, 0.32, 1)`;
    iconsWrapper.style.width = _defaultExpressionContainerWidth + 'px';
    iconsWrapper.style.top = 0 + 'px';
    iconsWrapper.style.left = - _defaultExpressionContainerWidth + 'px';
    iconsWrapper.style.display = 'flex';

    // 创建每一个表情的 icon
    const expressionIcons = makeExpressionListIcons(container);
    // 加入展开列表中
    for (const expression of expressionIcons) {
        iconsWrapper.appendChild(expression);
    }
    icon.appendChild(iconsWrapper);

    let showExpression = false;
    // 定义点击展开列表按钮逻辑
    icon.onclick = async () => {
        showExpression = !showExpression;
        if (showExpression) {
            iconsWrapper.style.opacity = '1';
            setTimeout(() => {
                iconsWrapper.style.display = 'display';
            }, animationDurationMS * 100);
        } else {
            iconsWrapper.style.opacity = '0';
            setTimeout(() => {
                iconsWrapper.style.display = 'none';
            }, animationDurationMS * 100);
        }
    }

    return icon;
}


/**
 * @description 展示所有的表情
 * @param container 
 * @returns 
 */
function makeExpressionListIcons(container: HTMLDivElement) {
    const manager = LAppLive2DManager.getInstance();
    const canvas = LAppDefine.Canvas;
    const icons: HTMLDivElement[] = [];

    if (manager && canvas) {
        const maxExpNum = Math.max(0, Math.floor(canvas.height / _defaultIconSize) - 1);
        const model = manager.model;
        const expNum = Math.min(model._expressions.getSize(), maxExpNum);
        
        for (let i = 0; i < expNum; ++ i) {
            const icon = createCommonIcon('E' + (i + 1));
            const name = model._expressions._keyValues[i].first;
            icon.onclick = async() => {
                model.setExpression(name);
            }

            icons.push(icon);
        }
    }

    return icons;
}

function makeRefreshCacheIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon('r');
    icon.style.transition = '.5s ease';
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';

    icon.onclick = async () => {
        CacheFetchSetting.refreshCache = true;
        const manager = LAppLive2DManager.getInstance();
        manager.loadLive2dModel();
    }

    return icon;
}

function makeBoxItemContainer() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.flexDirection = 'column';

    const canvas = LAppDefine.Canvas;
    container.style.zIndex = parseInt(canvas.style.zIndex) + 1 + '';
    container.style.opacity = '0';
    container.style.transition = '.7s cubic-bezier(0.23, 1, 0.32, 1)';

    container.style.position = 'fixed';
    container.style.right = canvas.width - widthXoffset + 'px';
    container.style.top = window.innerHeight - canvas.height + 'px';

    // 增加几个常用工具
    // 1. 收起 live2d
    const showLive2dIcon = makeLive2dCollapseIcon(container);
    // 2. 展示表情
    const showExpressionsIcon = makeExpressionListCollapseIcon(container);
    // 3. 刷新缓存
    const refreshCacheIcon = makeRefreshCacheIcon(container);

    container.appendChild(showLive2dIcon);
    container.appendChild(showExpressionsIcon);
    container.appendChild(refreshCacheIcon);

    document.body.appendChild(container);

    return container;
}


export async function addToolBox() {
    const canvas = LAppDefine.Canvas;
    addCssClass();

    container = makeBoxItemContainer();
    hideContainer();

    container.onmouseenter = async () => {
        showContainer();
    }

    container.onmouseleave = async () => {
        hideContainer();
    }

    canvas.onmouseenter = async () => {
        showContainer();
    }

    canvas.onmouseleave = async () => {
        hideContainer();
    }
}