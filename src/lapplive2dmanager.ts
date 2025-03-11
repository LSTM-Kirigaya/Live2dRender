/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { ACubismMotion } from '@framework/motion/acubismmotion';
import { csmVector } from '@framework/type/csmvector';

import LAppDefine from './lappdefine';
import { canvas } from './lappdelegate';
import { LAppModel } from './lappmodel';
import { LAppPal } from './lapppal';
import { pinkLog, redLog } from './utils';
import { reloadToolBox } from './toolbox';

// 单例模式全局变量
export let s_instance: LAppLive2DManager = null;

/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager {
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    public static getInstance(): LAppLive2DManager {
        if (s_instance == null) {
            s_instance = new LAppLive2DManager();
        }

        return s_instance;
    }

    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance = void 0;
        }

        s_instance = null;
    }

    /**
     * 現在のシーンで保持しているモデルを返す。
     *
     * @param no モデルリストのインデックス値
     * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
     */
    public getModel(no: number): LAppModel {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }

        return null;
    }

    public get model(): LAppModel {
        return this.getModel(0);
    }

    /**
     * 現在のシーンで保持しているすべてのモデルを解放する
     */
    public releaseAllModel(): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }

        this._models.clear();
    }

    /**
     * 画面をドラッグした時の処理
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onDrag(x: number, y: number): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            const model: LAppModel = this.getModel(i);

            if (model) {
                model.setDragging(x, y);
            }
        }
    }

    /**
     * 画面をタップした時の処理
     *
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onTap(x: number, y: number): void {
        if (LAppDefine.DebugLogEnable) {
            LAppPal.printMessage(
                `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
            );
        }

        for (let i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    LAppPal.printMessage(
                        `[APP]hit area: [${LAppDefine.HitAreaNameHead}]`
                    );
                }
                this._models.at(i).setRandomExpression();
            } else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    LAppPal.printMessage(
                        `[APP]hit area: [${LAppDefine.HitAreaNameBody}]`
                    );
                }
                this._models
                    .at(i)
                    .startRandomMotion(
                        LAppDefine.MotionGroupTapBody,
                        LAppDefine.PriorityNormal,
                        this._finishedMotion
                    );
            }
        }
    }

    /**
     * 画面を更新するときの処理
     * モデルの更新処理及び描画処理を行う
     */
    public onUpdate(): void {
        const { width, height } = canvas;

        const modelCount: number = this._models.getSize();

        for (let i = 0; i < modelCount; ++i) {
            const projection: CubismMatrix44 = new CubismMatrix44();
            const model: LAppModel = this.getModel(i);

            if (model.getModel()) {
                if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
                    // 横に長いモデルを縦長ウィンドウに表示する際モデルの横サイズでscaleを算出する
                    model.getModelMatrix().setWidth(2.0);
                    projection.scale(1.0, width / height);
                } else {
                    projection.scale(height / width, 1.0);
                }

                // 必要があればここで乗算
                if (this._viewMatrix != null) {
                    projection.multiplyByMatrix(this._viewMatrix);
                }
            }

            model.update();
            model.draw(projection); // 参照渡しなのでprojectionは変質する。
        }
    }

    /**
     * 次のシーンに切りかえる
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    public nextScene(): void {

    }

    private getModelPath(modelJsonPath: string): string {
        if (!modelJsonPath.includes('/')) {
            return '.';
        }
        const pathComponents: string[] = modelJsonPath.split('/');
        pathComponents.pop();
        const modelDir = pathComponents.join('/');
        return modelDir + '/';
    }

    /**
     * @description 重新加载 Live2d 模型
     * @returns 
     */
    public async loadLive2dModel(): Promise<void> {
        const modelJsonPath = LAppDefine.ResourcesPath;
        if (!modelJsonPath.endsWith('.model3.json')) {
            redLog('无法加载模型！模型资源路径的结尾必须是.model3.json！');
            return;
        }

        const modelPath = this.getModelPath(modelJsonPath);

        // 释放所有模型，此操作会清空 this._models
        this.releaseAllModel();

        // 装载新的模型，并加载新的资源
        const appModel = new LAppModel();
        
        // TODO: 支持更多的模型
        this._models.pushBack(appModel);        

        // 装载模型
        await appModel.loadAssets(modelPath, modelJsonPath);

        // 下一个 tick 中，重新制作工具栏，更新表情
        setTimeout(() => {
            reloadToolBox();            
        }, 500);

        pinkLog("[Live2dRender] 模型重载完成，重载路径: " + modelPath);
    }

    public setViewMatrix(m: CubismMatrix44) {
        for (let i = 0; i < 16; i++) {
            this._viewMatrix.getArray()[i] = m.getArray()[i];
        }
    }

    /**
     * コンストラクタ
     */
    constructor() {
        this._viewMatrix = new CubismMatrix44();
        this._models = new csmVector<LAppModel>();
        this.loadLive2dModel();
    }

    _viewMatrix: CubismMatrix44; // モデル描画に用いるview行列
    _models: csmVector<LAppModel>; // モデルインスタンスのコンテナ
    _sceneIndex: number; // 表示するシーンのインデックス値
    // モーション再生終了のコールバック関数
    _finishedMotion = (self: ACubismMotion): void => {
        LAppPal.printMessage('Motion Finished:');
        console.log(self);
    };
}
