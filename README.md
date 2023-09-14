# Live2dRender

[English Document](https://www.fluentu.com/blog/chinese/best-website-to-learn-chinese/)

适用于最新版本 Live2D 模型文件的 Javascript 渲染器。

申明：
- 此项目仅适用于基于 webpack 构建的项目，如果是静态页面，自己想办法，反正也很简单。作者忙着打星际和写论文，没空回消息。
- 此项目不适用于 IE 浏览器。
- 这玩意儿是基于 `CubismSdkForWeb` 开发的，请不要商用！
- 使用前请确保你的 Live2d 模型的文件都是英文，如果是中文可能会出问题。

---

## 普通用户请看


### 基本使用 (vue3 为例)

目前该项目支持任何 webpack 管理的打包项目，静态文件玩家可以参考下述的操作制作。下面以 vue3 项目为例，举例如何使用该库。

#### 1. 新建 vue3 项目 并安装依赖

已有vue3项目直接跳过
```bash
$ vue create test-live2d-render
$ cd test-live2d-render
```

安装 `live2d-render` 这个库：

```
$ npm install live2d-render
```

然后在你的 html 入口文件的 head 部分，vue3 项目中是 `./public/index.html` 中加入：
```html
<script src="https://unpkg.com/core-js-bundle@3.6.1/minified.js"></script>
<script src = "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
```

#### 2. 了解和准备 live2d 文件

先准备一个 live2d 模型，一个 live2d 模型通常是一个包含了如下几类文件的文件夹：

- xxx.moc3
- xxx.model3.json
- 其他

比如我的模型为一个小猫娘，文件夹为 cat，这个文件夹下包含了如下的文件：
```
/cat
    -| sdwhite cat b.model3.json
    -| SDwhite cat B.moc3
    -| xxx.exp3.json
    -| ...
    -| ...
```

> 模型版权申明：Lenore莱诺尔（B站：一个ayabe）

我把 `cat` 文件夹放在了 `./public` 文件夹下。那么我的模型的基本路径为：`./cat/sdwhite cat b.model3.json`，记住这个路径。

#### 3. 使用 live2d-render

将 `./src/App.vue` 中的 `<script>` 标签下改为：
```javascript
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue';
import * as live2d from 'live2d-render';

export default {
    name: 'App',
    components: {
        HelloWorld
    },
    setup() {
        onMounted(async () => {
            await live2d.initializeLive2D({
                BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],
                ResourcesPath: './cat/sdwhite cat b.model3.json',
                CanvasSize: {
                    height: 500,
                    width: 400
                }
            })
            console.log('finish loading');
        });
    }
}
```


运行项目：

```bash
$ $Env:NODE_OPTIONS="--openssl-legacy-provider"
$ npm run serve
```

效果：

<div align=center>
<img src="https://picx.zhimg.com/80/v2-e4e1faa75ffec1165ce9845f1f6284d7_1440w.png" style="width: 80%;"/>
</div>

---

## 开发者请看

### 环境准备

如果你希望搭建开发环境，请：
1. 进入 [newest cubism-sdk](https://www.live2d.com/zh-CHS/download/cubism-sdk/download-web/)
2. 勾选 “同意软件使用授权协议以及隐私政策”
3. 找到 “Cubism SDK for Web”，选择 “下载最新版”
4. 下载后，解压为 `CubismSdkForWeb`.

然后 clone 本项目：
```bash
$ cd ./CubismSdkForWeb/Samples/TypeScript
$ git clone https://github.com/LSTM-Kirigaya/Live2dRender.git
$ cd Live2dRender
$ npm i
```

然后，自己去折腾吧。