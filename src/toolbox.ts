import { cacheFetch, CacheFetchSetting } from "./cache";
import LAppDefine from "./lappdefine";
import { LAppLive2DManager } from './lapplive2dmanager';
import * as svgIcon from "./svg";

// TODO: 适配到 live2dBoxItemCss
const _defaultIconSize = 35;
const _defaultIconBgColor = '#00A6ED';
const _defaultIconFgColor = 'white';
const _defaultHoverColor = 'rgb(224, 209, 41)';
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
    border-radius: 0.5em;
    transition: all .35s cubic-bezier(0.23, 1, 0.32, 1);
}

.${live2dBoxItemCss}:hover {
    background-color: rgb(224, 209, 41);
}

.${live2dBoxItemCss}.button-item {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 5px 10px 0px;
}

.${live2dBoxItemCss}.button-item svg {
    height: 20px;
}

.${live2dBoxItemCss}.expression-item {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 3px 10px;
}

.${live2dBoxItemCss}.expression-item > span:last-child {
    width: 60px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.${live2dBoxItemCss}.expression-item svg {
    height: 20px;
    margin-right: 5px;
}

.${live2dBoxItemCss} svg path {
    fill: white;
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
function createCommonIcon(svgString: string, extraString: string = '', cssClasses: string[] = []) {
    const div = document.createElement('div');
    div.classList.add(live2dBoxItemCss);
    cssClasses.forEach(cssString => div.classList.add(cssString));
    
    const firstSpan = document.createElement('span');
    const secondSpan = document.createElement('span');
    firstSpan.innerHTML = svgString;
    secondSpan.innerText = extraString;

    div.appendChild(firstSpan);
    div.appendChild(secondSpan);
    return div;
}


/**
 * @description 收起和展开 live2d
 * @param container 
 * @returns
 */
function makeLive2dCollapseIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon(svgIcon.collapseIcon, '', ['button-item']);
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';

    // 注册 icon 的鼠标事件
    icon.addEventListener('mouseenter', () => {
        icon.style.backgroundColor = _defaultHoverColor;
    });

    icon.addEventListener('mouseleave', () => {
        icon.style.backgroundColor = _defaultIconBgColor;
    });

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
 * @description 创建 【收起/展开 展示表情列表】 的按钮
 * @param container
 * @returns
 */
function makeExpressionListCollapseIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon(svgIcon.expressionIcon, '', ['button-item']);
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';
    icon.style.position = 'relative';

    // 创建一个容器，来容纳所有的表情按钮
    const iconsWrapper = document.createElement('div');
    const animationDurationMS = 7;
    iconsWrapper.style.position = 'absolute';
    iconsWrapper.style.top = 0 + 'px';
    iconsWrapper.style.flexDirection = 'column';
    iconsWrapper.style.transform = 'translate(-45px, 0px)';
    iconsWrapper.style.transition = 'all .75s cubic-bezier(0.23, 1, 0.32, 1)';
    iconsWrapper.style.display = 'none';
    iconsWrapper.style.opacity = '0';

    let currentTranslateY = 0;

    // 注册 icon 的鼠标事件
    icon.addEventListener('mouseenter', () => {
        icon.style.backgroundColor = _defaultHoverColor;
        
        // 光标进入
        iconsWrapper.style.display = 'flex';
        iconsWrapper.style.opacity = '1';
        iconsWrapper.style.transform = `translate(-75px, ${currentTranslateY}px)`;

    });

    icon.addEventListener('mouseleave', () => {
        icon.style.backgroundColor = _defaultIconBgColor;
        
        // 光标退出
        iconsWrapper.style.opacity = '0';
        iconsWrapper.style.transform = `translate(-45px, ${currentTranslateY}px)`;

        setTimeout(() => {
            iconsWrapper.style.display = 'none';
        }, 500);
    });

    // 容器滚动
    iconsWrapper.addEventListener('wheel', e => {
        // 获取当前的transform值
        const currentTransform = getComputedStyle(iconsWrapper).transform;
        const matrix = new WebKitCSSMatrix(currentTransform);
    
        // 获取当前y轴平移值
        let translateY = matrix.m42; // y轴平移量
    
        // 根据滚轮方向调整位置
        if(e.deltaY > 0) { // 滚轮向下滚动，元素上移
            translateY -= 50;
        } else { // 滚轮向上滚动，元素下移
            translateY += 50;
        }

        currentTranslateY = translateY;
    
        // 更新transform属性
        iconsWrapper.style.transform = `translate(-75px, ${translateY}px)`;
    
        e.preventDefault(); // 阻止默认的滚动行为
    });

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
        // if (showExpression) {
        //     iconsWrapper.style.opacity = '1';
        //     setTimeout(() => {
        //         iconsWrapper.style.display = 'display';
        //     }, animationDurationMS * 100);
        // } else {
        //     iconsWrapper.style.opacity = '0';
        //     setTimeout(() => {
        //         iconsWrapper.style.display = 'none';
        //     }, animationDurationMS * 100);
        // }
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
        
        // TODO: 支持更多模型
        const model = manager.getModel(0);        
        const expNum = Math.min(model._expressions.getSize(), maxExpNum);        
        
        for (let i = 0; i < expNum; ++ i) {
            const name = model._expressions._keyValues[i].first;

            // 去除结尾的 json
            const renderName = name.replace('.exp3.json', '');
            const icon = createCommonIcon(svgIcon.catIcon, renderName);
            
            icon.classList.add('expression-item');

            icon.onclick = async() => {
                model.setExpression(name);
            }

            icons.push(icon);
        }
    }

    return icons;
}


/**
 * @description 创建强制刷新 live2d 的按钮
 * @param container 
 * @returns 
 */
function makeRefreshCacheIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon(svgIcon.reloadIcon, '', ['button-item']);
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';

    // 注册 icon 的鼠标事件
    icon.addEventListener('mouseenter', () => {
        icon.style.backgroundColor = _defaultHoverColor;
    });

    icon.addEventListener('mouseleave', () => {
        icon.style.backgroundColor = _defaultIconBgColor;
    });

    icon.onclick = async () => {
        CacheFetchSetting.refreshCache = true;
        const manager = LAppLive2DManager.getInstance();
        manager.loadLive2dModel();
    }

    return icon;
}

/**
 * @description 创建跳转到我的 github 仓库的按钮
 * @param container 
 */
function makeStarIcon(container: HTMLDivElement): HTMLDivElement {
    const icon = createCommonIcon(svgIcon.starIcon, '', ['button-item']);
    icon.style.backgroundColor = _defaultIconBgColor;
    icon.style.fontSize = '1.05rem';

    // 注册 icon 的鼠标事件
    icon.addEventListener('mouseenter', () => {
        icon.style.backgroundColor = _defaultHoverColor;
    });

    icon.addEventListener('mouseleave', () => {
        icon.style.backgroundColor = _defaultIconBgColor;
    });

    icon.onclick = async () => {
        window.open('https://github.com/LSTM-Kirigaya/Live2dRender', '_blank');
    };

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
    // 4. 跳转到我的 github
    const starIcon = makeStarIcon(container);

    container.appendChild(showLive2dIcon);
    container.appendChild(showExpressionsIcon);
    container.appendChild(refreshCacheIcon);
    container.appendChild(starIcon);

    document.body.appendChild(container);

    return container;
}

export function reloadToolBox() {
    if (!container) {
        return;
    }
    
    hideContainer();
    document.body.removeChild(container);
    container = makeBoxItemContainer();
    showContainer();

    // 添加工具栏的事件
    container.onmouseenter = async () => {
        showContainer();
    }
    container.onmouseleave = async () => {
        hideContainer();
    }
}


export function addToolBox() {
    addCssClass();

    container = makeBoxItemContainer();

    // 添加工具栏的事件
    hideContainer();
    container.onmouseenter = async () => {
        showContainer();
    }
    container.onmouseleave = async () => {
        hideContainer();
    }

    // 添加 live2d 区域的光标事件
    const canvas = LAppDefine.Canvas;
    canvas.onmouseenter = async () => {
        showContainer();
    }

    canvas.onmouseleave = async () => {
        hideContainer();
    }
}