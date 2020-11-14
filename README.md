# 我的世界（仿）

[![Join the chat at https://gitter.im/wzh656/Minecraft](https://badges.gitter.im/wzh656/Minecraft.svg)](https://gitter.im/wzh656/Minecraft?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

修改日期:2020.11.14

> # 运行

1. 手机apk软件运行：直接横屏运行
    + [手机版(apk)v1.1.0-alpha临时完整版（较大，30+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.1.0-alpha/Minecraft.apk)
2. 网页版运行：当前可以直接访问 <https://wzh656.github.io/MinecraftWeb/home.html> 运行。  
    注意，GitHub是国外网站，网络不好将**无法打开**并且部分旧版浏览器可能不支持。  
    竖屏使用时会有一个提示使用横屏或者下载，如果浏览器支持横屏，可以将手机横屏使用；  
    也可以点击关闭，直接竖屏运行（可能显示会有些奇怪）

> # 介绍

## （零）序
本游戏是基于《我的世界》游戏思想的仿造，仿造原则是：
在原版基础上**增加游戏真实性**（比如在物理和化学方面），但拒绝完全复制（体现在*“仿”*字），故名之***真实性原则***。

### 战略方针(plans)
目前，本游戏仍处在初级阶段，对此，根据*真实性原则*，需要坚持*三个战略*（总称*改革优化创新战略*）：
1. ***改革***：泛指修bug
3. ***优化***：泛指不断提高运行速度，减小CPU及内存占用
2. ***创新***：泛指不断发展新功能

目前阶段，这三个战略缺一不可，并且是当前发展中需长期坚持的重要战略。

## （一）总述(general)
本游戏使用WebGL技术，依赖Three.js进行更便捷的3D渲染。  
规定：每1px为1cm，每100px为1m
> 注：*deskgood*为~~前任同桌~~某人的外号，作为游戏主角名，不要在意名称

## （二）操作方式
> ### 电脑

| 事件						| 操作												|
| -------------------------	| -------------------------------------------------	|
| `W S A D`					| *前 后 左 右*方向移动								|
| *鼠标左键*				| 删除所指方块										|
| *鼠标右键*				| 在所指位置放置手中指定方块						|
| *空格*					| 跳跃(jump)										|
| 双击`W`，或 `Ctrl`+`W`	| 疾跑(run)											|
| `ESC`						| 暂停游戏/关闭交互窗口（命令方块、背包）			|
| `Pause-Break`				| 暂停/开始游戏 或 关闭交互窗口（命令方块、背包）	|
| `F2`						| 截图												|
| `F10`						| 打开/关闭dat.gui									|
| `shift`+`F3`				| 隐藏*dat.gui*（将重载生效）						|

> ### 手机版（摇杆）

1. 移动：左边的大圆(left big circle)
    摇杆操作，`touch`移动控制行走
2. 跳跃：右边的小圆(right small circle)
    可以与移动同时操作。  
    按下(`touch-start`)之后，如果脚下有方块
    并且距离上一次跳跃超过1s
    则将以速度向量(0m/s, ≈5m/s, 0m/s)即沿着y轴正半轴方向以≈5m/s的速度跳起来

## （三）引用的js工具
+ > *state.js*：左上角(left-top corner) Canvas
    
    可以使用该工具查看当前渲染状态，该工具有3种状态，点击切换
    + fps:<font style="color:blue;">蓝色/fps</font>  
        查看当前每秒可渲染的帧数，1s更新1次
    + ms:<font style="color:green;">绿色/ms</font>  
        查看渲染每帧需要的时间/ms，渲染1帧更新1次
    + MB:<font style="color:red;">红色/MB</font>  
        查看当前运行占用的内存/MB(兆字节)

+ > *dat.gui.js*：右上角(right-top corner)
    
    点击可展开，内含一些配置调试选项
    
    注意：对性能有很大影响，可按`shift`+`F3`隐藏（会重新加载页面生效）

+ > *VConsole*与*eruda*：右下角(right-bottom corner)
    
    手机调试工具，点击右下角即可看到一堆输出，可以调试html+css+js，也可以运行JavaScript代码，等效于*命令方块*


## （四）更多
俗话说：“*最好的文档就是没有文档*”，鉴于保留神秘感，则介绍至此，更多内容请自行[运行尝试](#运行)
