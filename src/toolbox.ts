import LAppDefine from "./lappdefine";
import { LAppLive2DManager } from './lapplive2dmanager';

const iconSize = 20;
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
        height: 20px;
        width: 20px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 0.7rem;
        background-color: rgb(255, 149, 188);
        color: white;
        border-radius: 0.9em;
        transition: .5s ease;
    }

    .${live2dBoxItemCss}:hover {
        scale: 1.3;
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

function makeCommonIcon(text?: string) {
    const div = document.createElement('div');

    div.classList.add(live2dBoxItemCss);

    if (text) {
        div.textContent = text;
    }
    return div;
}


// 收起和展开 live2d
function makeCollapseIcon(container: HTMLDivElement) {
    const icon = makeCommonIcon('➡️');
    icon.style.transition = '.5s ease';
    icon.style.backgroundColor = '#00A6ED';
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


// 展示所有的表情
function makeExpressionListIcons(container: HTMLDivElement) {
    const manager = LAppLive2DManager.getInstance();
    const canvas = LAppDefine.Canvas;
    const icons: HTMLDivElement[] = [];

    if (manager && canvas) {
        const maxExpNum = Math.max(0, Math.floor(canvas.height / iconSize) - 1);
        const model = manager.model;
        const expNum = Math.min(model._expressions.getSize(), maxExpNum);
        
        for (let i = 0; i < expNum; ++ i) {
            const icon = makeCommonIcon('E' + (i + 1));
            const name = model._expressions._keyValues[i].first;
            icon.onclick = async() => {
                model.setExpression(name);
            }

            icons.push(icon);
        }
    }

    return icons;
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
    const showIcon = makeCollapseIcon(container);
    const expIcons = makeExpressionListIcons(container);

    container.appendChild(showIcon);
    expIcons.forEach(el => container.appendChild(el));

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