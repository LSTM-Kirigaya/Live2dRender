/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * 配置参数
 */

interface ILAppDefine {
    CanvasId: string
    MessageBoxId: string
    BackgroundRGBA: [number, number, number, number]

    CanvasSize: { width: number; height: number } | 'auto'
    LoadFromCache: boolean

    // 画面参数
    ViewScale: number
    ViewMaxScale: number
    ViewMinScale: number

    ViewLogicalLeft: number
    ViewLogicalRight: number
    ViewLogicalBottom: number
    ViewLogicalTop: number

    ViewLogicalMaxLeft: number
    ViewLogicalMaxRight: number
    ViewLogicalMaxBottom: number
    ViewLogicalMaxTop: number

    // 资源路径，必须是model3文件的地址
    ResourcesPath: string

    // 结束按钮
    PowerImageName: string

    MotionGroupIdle: string     // 
    MotionGroupTapBody: string  // 点击身体

    HitAreaNameHead: string
    HitAreaNameBody: string

    // 优先度
    PriorityNone: number
    PriorityIdle: number
    PriorityNormal: number
    PriorityForce: number

    // MOC3 一致性验证
    MOCConsistencyValidationEnable: boolean

    // 调试日志显示选项
    DebugLogEnable: boolean
    DebugTouchLogEnable: boolean

    // Framework 输出日志级别
    CubismLoggingLevel: LogLevel

    // 默认渲染大小
    RenderTargetWidth: number
    RenderTargetHeight: number
}



const LAppDefine: ILAppDefine = {
    CanvasId: 'live2d',
    MessageBoxId: 'live2dMessageBox',
    BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],
    CanvasSize: 'auto',
    LoadFromCache: false,

    ViewScale: 1.0,
    ViewMaxScale: 2.0,
    ViewMinScale: 0.8,
    ViewLogicalLeft: - 1.0,
    ViewLogicalRight: 1.0,
    ViewLogicalBottom: - 1.0,
    ViewLogicalTop: 1.0,
    ViewLogicalMaxLeft: - 2.0,
    ViewLogicalMaxRight: 2.0,
    ViewLogicalMaxBottom: - 2.0,
    ViewLogicalMaxTop: 2.0,
    ResourcesPath: '',
    PowerImageName: '',
    MotionGroupIdle: 'Idle',
    MotionGroupTapBody: 'TapBody',
    HitAreaNameHead: 'Head',
    HitAreaNameBody: 'Body',

    PriorityNone: 0,
    PriorityIdle: 1,
    PriorityNormal: 2,
    PriorityForce: 3,

    MOCConsistencyValidationEnable: true,
    DebugLogEnable: true,
    DebugTouchLogEnable: false,
    CubismLoggingLevel: LogLevel.LogLevel_Verbose,

    RenderTargetWidth: 1900,
    RenderTargetHeight: 1000
}


export default LAppDefine;