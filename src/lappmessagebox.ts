import LAppDefine from "./lappdefine";


export let s_instance: LAppMessageBox = null;
export let messageBox: HTMLDivElement = null;

export class LAppMessageBox {
    public static getInstance(): LAppMessageBox {
        if (s_instance == null) {
            s_instance = new LAppMessageBox();
        }

        return s_instance;
    }

    public getMessageBox(): HTMLDivElement {
        if (this._messageBox == null) {
            this._messageBox = document.querySelector('#live2dMessageBox-content');
        }
        return this._messageBox;
    }

    public initialize(canvas: HTMLCanvasElement): boolean {
        messageBox = document.createElement('div');

        messageBox.id = LAppDefine.MessageBoxId;
        messageBox.style.position = 'fixed';
        messageBox.style.padding = '10px';
        messageBox.style.zIndex = '9999';
        messageBox.style.display = 'flex';
        messageBox.style.justifyContent = 'center';
        
        messageBox.style.width = canvas.width + 'px';
        messageBox.style.height = '20px';
        messageBox.style.right = '0';
        messageBox.style.bottom = canvas.height + 50 + 'px';
        messageBox.innerHTML = '<div id="live2dMessageBox-content"></div>';
        document.body.appendChild(messageBox);
        
        this.hideMessageBox();
        return true;
    }

    public setMessage(message: string, duration: number=null) {
        const messageBox = this.getMessageBox();
        
        this.hideMessageBox();
        messageBox.textContent = message;

        setTimeout(() => {
            const wrapperDiv: HTMLDivElement = document.querySelector('#' + LAppDefine.MessageBoxId);
            wrapperDiv.style.bottom = (LAppDefine.CanvasSize === 'auto' ? 500: LAppDefine.CanvasSize.height) + messageBox.offsetHeight - 25 + 'px';    
        }, 10);

        this.revealMessageBox();
        if (duration != null) {
            setTimeout(() => {
                this.hideMessageBox();
            }, duration);
        }
    }

    // 隐藏对话框
    public hideMessageBox() {
        const messageBox = this.getMessageBox();
        messageBox.classList.remove('live2dMessageBox-content-visible');
        messageBox.classList.add('live2dMessageBox-content-hidden');
    }

    // 展示对话框
    public revealMessageBox() {
        const messageBox = this.getMessageBox();
        messageBox.classList.remove('live2dMessageBox-content-hidden');
        messageBox.classList.add('live2dMessageBox-content-visible');
    }

    _messageBox: HTMLDivElement = null
}