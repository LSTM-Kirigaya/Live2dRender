![Live2dRender](https://socialify.git.ci/LSTM-Kirigaya/Live2dRender/image?description=1&font=Jost&forks=1&issues=1&language=1&logo=https%3A%2F%2Fpic1.zhimg.com%2F80%2Fv2-16af50337a4ecec461aba0dade8e7403_1440w.png&name=1&pattern=Formal%20Invitation&pulls=1&stargazers=1&theme=Light)

👉 [Live2dRender 官方文档](https://document.kirigaya.cn/blogs/live2d-render/main.html) | [English Document](https://www.npmjs.com/package/live2d-render)

# Live2dRender

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


#### 2. 了解和准备 live2d 文件

先准备一个 live2d 模型，一个 live2d 模型通常是一个包含了如下几类文件的文件夹：

- xxx.moc3
- xxx.model3.json (配置文件，live2d 最先读取的就是这个文件，可以认为它是 live2d 模型的入口文件，里面列举了所有模型需要使用的静态资源的相对路径)
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

在 `./src/App.vue` 中：
```javascript
<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue';
import * as live2d from './lib/live2d-render';

defineComponent({
    name: 'App'
});

onMounted(async () => {
    await live2d.initializeLive2D({
        // live2d 所在区域的背景颜色
        BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

        // live2d 的 model3.json 文件的相对路径
        ResourcesPath: './cat/sdwhite cat b.model3.json',

        // live2d 的大小
        CanvasSize: {
            height: 500,
            width: 400
        },
        
        // 展示工具箱（可以控制 live2d 的展出隐藏，使用特定表情）
        ShowToolBox: true,

        // 是否使用 indexDB 进行缓存优化，这样下一次载入就不会再发起网络请求了
        LoadFromCache: true
    });
    
    console.log('finish loading');
});

</script>
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

#### 打包调优

如果你觉得 png 太大影响网络传输速度，可以考虑将 png 转化成 webp 后，然后把 model3.json 文件里面的 Textures 选项修改为 webp 的相对路径。

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

---

## Buy me a coffee

Sponsor me in my own website: [https://kirigaya.cn/sponsor](https://kirigaya.cn/sponsor).

---

## CHANHELOG

[2024.04.02]

- 使用 indexDB 解决了 localStorage 只能存储 5MB 数据的问题

[2024.04.02]

- 将外部的两个库的载入融合进初始化内
- 使用 `localStorage` 优化网络请求
- 大幅度压缩库的大小: 2240 KB -> 190 KB

[2023.10.01]

- 完成主体工作
