# 我的世界（仿）
修改日期:2020.9.14

> # 运行

最新版：暂未打包，可访问网页版（可能处于调试之中）

+ [手机版(apk)v1.0.0.3-alpha临时完整版（较大，30+MB）（与之前不兼容，无存档，需先卸载重装）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.0.0.3-alpha/full.apk)
+ [手机版(apk)v1.0.0.3-alpha临时简化版（在线字体、BGM，6+MB）（与之前不兼容，无存档，需先卸载重装）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.0.0.3-alpha/full.apk)

+ [手机版(apk)v0.5.0-alpha完整版（较大，20+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-full.apk)
+ [手机版(apk)v0.5.0-alpha简化版（在线字体、BGM，5+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha//Minecraft-simplified.apk)

+ [web版（对网速要求较高，网速慢者无法运行）](https://wzh656.github.io/MinecraftWeb/home.html)

可在[后面（㈧关于运行）](#关于运行)详细查看

> # 目录
0. [（零）序](#零序)
1. [㈠关于地图(Map)](#关于地图Map)
2. [㈡关于角(jiǎo)色](#关于角jiǎo色)
3. [㈢关于移动(move)与按键(key)](#关于移动move与按键key)
4. [㈣关于物品(Thing)](#关于物品Thing)
5. [㈤关于天气(weather)](#关于天气weather)
6. [㈥关于工具](#关于工具)
7. [㈦注意事项](#注意事项)
8. [㈧关于运行](#关于运行)
9. [㈨效果图片](#效果图片)  

……

> # 说明（正文）

## （零）序
本游戏是基于《我的世界》游戏思想的仿造，仿造原则是：
**加强游戏真实性**（such as physics&chemistry~~，牛顿&爱因斯坦正在入群~~），故曰之***真实性原则***。
而为实现*真实性原则*，需：提高运行速度、减小CPU及内存占用、提高游戏体验感


## ㈠关于地图(Map)
1. 《我的世界》地图由种子(seed)经过柏林噪声(perlin noise)产生  
2. 《我的世界（仿）》地图使用柏林噪声函数生成，大部分参数可以在`新的世界`中的`高级设置`中调整，目前参数如下

| 		名称			|		默认			|	误差		|
| ----------------: | :----------------	| :--------	|
| 区块大小			| 17\*17\*128		| /			|
| 海拔				| 1~64				| ±1		|
| 泥土与石头之比		| 0.1~0.4			| ±0.1		|
| 允许石头露天		| -0.99~0.01		| /			|
| 区块类型：森林		| 0.0~0.4			| /			|
| 区块类型：草原		| 0.4~0.8			| /			|
| 区块类型：沙漠		| 0.8~1.0			| /			|
| 生成树的概率		| 1/12				| ±0.1		|
| 树的高度			| 1~10				| ±1		|
| 树叶与树高之比		| 0.4~0.8			| ±0.1		|


## ㈡关于角(jiǎo)色
1. 本游戏的角色是一个名为`deskgood`（桌子好）的“桌子”~~以纪念同桌桌子好之死和他的ugly~~
2. 事实上，在场景(scene)中，并没有加入(add)角色，而是通过控制透视相机(`PerspectiveCamera`)的移动(封装命令方法`deskgood.move`=`deskgood.moveTo`,`deskgood.go`…)，并记录只读变量：朝向(`deskgood.lookAt`)、位置矢量(`deskgood.pos`)、速度矢量(`deskgood.v`)来实现对角色`deskgood`的控制
3. 在程序中，定义了一个全局变量`deskgood`以封装控制角色的方法  


## ㈢关于移动(move)与按键(key)
先不管那些调试工具，~~懒得删（跟`deskgood`学的）~~，先看那两个圆(circles)：移动(move)、跳跃(jump)

> 手机版（摇杆）

1. 移动：左边的大圆(left big circle)，摇杆操作（其实我觉得按键较好，但摇杆做起来方便~~（懒×2）~~）  
2. 跳跃：右边的小圆(right small circle)，可以与移动同时操作。按下(`touch start`)之后，如果脚下不为空气(#0)并且距离上一次跳跃超过1s（依照*真实性原则*`deskgood`会累），则将以约5m/s竖直向上的速度(v.y+=5m/s)“灰”起来

> 电脑版（按键）

所有按键包括：

| 按键					| 操作																			|
| -----------	| -------------------------------	|
| `W S A D`		| *前 后 左 右*方向移									|
| *鼠标左键*	| 删除所指方块													|
| *鼠标右键*	| 在所指位置放置手中指定方块		|
| *空格*				| 跳跃(jump)															|
| 双击`W`，或 `Ctrl`+`W`	|	疾跑(run)								|
| `ESC`					| 暂停游戏/关闭交互窗口（命令方块、背包）																							|
| `Pause-Break`	| 暂停/开始游戏 或 关闭交互窗口（命令方块、背包）															|
| `F2`						| 截图																			|
| `F10`					| 打开/关闭dat.gui											|

### 关于重力加速度(gravity)和空气阻力的*真实性原则*体现
角色`deskgood`跳起后，初速度v₀≈5m/s，由于地~~球~~面的吸引（地心引力），产生一个aᵧ≈-9.8m/s²的沿y轴竖直向下的加速度，致使角色`deskgood`进行匀变速直线运动。  
同时，由于空气阻力作用，部分机械能转化为与空气摩擦的内（热）能，导致速度减小~~（刚说是真空呢）~~。  
若忽略空气阻力便于计算，  则：
于玩家跳起点为时空原点向上建立时空数轴坐标系，当时间为t时，玩家速度v=v₀-aᵧt，玩家y坐标可由玩家速度v进行积分得到：y =∫ v dt =∫ v₀-aᵧt dt =v₀t-(1/2)aᵧt²；当v=v₀-aᵧt=0时，玩家到达最高点，此时t=v₀/aᵧ, s =v₀t-(1/2)aᵧt² =v₀²/aᵧ-(1/2)v₀²/aᵧ =(1/2)v₀²/aᵧ  
空气阻力(F/N)大小与空气密度(ρ/(kg/m³))摩擦面大小(S/m²)、速度(v/(m/s))的平方成正比（根据百度公式：F=(1/2)CρSv²，及牛顿第二定律(Newton second law)：F=ma）。因此得到，当速度达到一个值(|v|≈100m/s)时，将可能出现空气阻力（摩擦力）与重力平衡，使角色`deskgood`“匀速”直线运动  


## ㈣关于物品(Thing)
物品类型当前基本只有*方块*。
1. 方块类型：空气(#0)，草方块，木板，石头，原石，命令方块……
2. 方块大小：当前，每个原始方块为边长1m=100cm=100px的立方体（+贴图）；而变形方块（such as 橡木）大小可变。
3. 方块放置：短按(<1000ms=1s的touch)屏幕，使用光线(ray)投射法判断点击面与点击物体，若与之距离小于5m=500cm=500px（deskgood is 长臂猿），则在相应点击方块的相应方向放置一个玩家手中的方块。  
4. 方块删除：长按(>=1000ms=1s的touch)屏幕使用光线投射法判断点击物体，若与之距离小于5m=500px（deskgood is 长臂猿），且手中可以拿下（依照*真实性原则*，4m³物品已经不符合实际了），则删除对应位置物体并放入手中指定位置。  
5. ### 关于命令方块及教程：
    可使用dat.gui.js(control)设置角色`deskgood`的工具栏(tools)物品id得到，点击后将打开命令方块界面，将可在里面输入JavaScript命令  
    一些命令：
    1. `deskgood.move(x,y,z);`（请在x,y,z处填上对应的值，单位：px或cm）可让角色`deskgood`移动到指定笛卡尔坐标。 e.g. `deskgood.move(0,0,10000*100);`可使角色`deskgood`到达坐标(0,0,1000000) ~~，即坐标原点的万米高空~~
    2. `deskgood.moveTo(x,y,z);` 同①(`deskgood.move(x,y,z)`)，只是不同名称。
    3. `deskgood.go(x,y,z);` （请在x,y,z处填上对应的值，单位：px或cm）将角色`deskgood`的坐标向量与向量(x,y,z)相加。 e.g. `deskgood.go(0,0,10000*100);`可使角色`deskgood`往上移动10000m=10000*100cm=1000000px ~~还是万米高空（但前提是不碰头），只是以当前坐标为基础再+10000m~~
    4. `deskgood.die();`或`deskgood.die("原因");` （请在原因处填上适当的死亡原因，也可缺省）使角色`deskgood`死亡。 e.g. `deskgood.die("Too LAZY and Too自恋");`
    5. 其他封装命令暂请期待……
    6. 由于是直接运行JavaScript代码，所以可以直接输入原生JavaScript代码。
    e.g.
        1. `location.href="https://www.baidu.com/";`可改变浏览网址，跳转到百度；
        2. `location.reload();`可刷新页面，相当于重启应用；
        3. `alert(message);`可弹出提示框，显示信息message，e.g. `alert("hello world")`；
    7. #### *《免责协议》*
    由于玩家可能受到欺骗而自己输入**病毒性代码**（尤其是在APK与electron上运行时权限最大）从而导致损失。故运行代码即表示同意*《免责协议》*：输入代码产生的一切后果由玩家自行承担，与开发者无关。


## ㈤关于天气(weather)
每次进入游戏后，将有25%的概率发生降水
+ 不降水：雨滴增加率=0  
+ 降水：雨滴增加率=随机数（**非平均分布**）∈[0,1)  

之后，将每隔1ms(实际要远大于此值)检测一次，根据随机数判断是否增加雨滴。若增加，则在x∈[-1000,1000),y∈[50000,10000),z∈[-1000,1000)中的随机一位置产生 【间隔时间(ms)/3.6】 个 【宽:[3,6)px,高:[10,36)px】 的雨滴。并且每个雨滴都将的以y:-10m/s的速度下落（这里的空气阻力~~胡萝卜鸡~~忽略不计）。

### 改善计划
+ [ ] 每个已加载区块都有概率下雨
+ [ ] *雨滴增加率*随时间t用perline噪声计算

### 关于雨滴
雨滴是一种sprite，即只有一个面（永远平行于屏幕）的物体，颜色为<font style="background-color: #4c51a7;">#4c51a7</font>


## ㈥关于工具
> ⑴*state.js*库：左上角(left-top corner)默认蓝色(normal <font style="color:blue;">blue</font>)

可以使用该工具查看当前渲染状态，该工具有3种状态（点击切换(click to change)）
+ fps:<font style="color:blue;">蓝色fps（默认）</font>，查看当前每秒可渲染的帧数，越大越流畅（一般最佳：61fps（电脑就这样，手机（特烂）只有20+fps））
+ ms:<font style="color:green;">绿色(green)ms</font>，查看渲染每帧需要的时间(ms)，越小越流畅（一般最佳：16ms/帧）
+ MB:<font style="color:red;">红色MB(red)</font>，查看当前使用的内存(MB兆字节)  

> ⑵*dat.gui.js*库：右上角(right-top corner)，点击可展开

1. save按钮：手动保存存档（每隔60*1000ms=60s=1min会自动保存一次）（每次退出前请保存）
2. 场景(scene)
    1. 雾(fog)：具有far,near,颜色(color)属性
    2. 区块预加载(perload)范围：当玩家运动时，若有未加载区块在此范围内，则加载此区块。如果设备性能好，可以适当调大。
3. 角色(deskgood)（相机(camera)）
    1. 灵敏度：游戏玩家滑动屏幕时改变角色`deskgood`朝向的程度，默认值：1，手机版可适当调大
    2. 位置：分为x,y,z轴，单位px(100px=1m)
    3. 速度：分为x,y,z轴，单位m/s，可以通过调节位置和速度来从虚空中上来，或是挽救被卡(qiǎ)住的`deskgood`角色（千万别动x,z轴的速度，否则除非找到物体挡住就停不下来了）。
    4. 朝向（球坐标系），分为上下(top-bottom)角度，左右(left-right)角度，单位度
    5. 朝向（笛卡尔坐标系），分为x,y,z轴，采用标准单位向量表示
    6. 天旋地转：对应camera的up属性，反正看不懂就别乱动就对了，如果乱调就会造成移动朝向时天旋地转的效果，电脑最明显，头晕了别怪我
    7. 工具(tools)栏（对应角色`deskgood`拿在手中的物品~~，虽然两只手拿4m³物品不太可能，但比《我的世界》真实多了~~）
        1. 选择工具：指当前选择要操作的物品。如果为空，挖掘物品时默认先放入此位置；如果要方块，放置物品时则放置此物品
        2. 物品：接下来的四个对应手中拿的四样物品的ID（0为空气/真空），**不可修改！**

> ⑶*VConsole.js*库：手机调试工具，点击右下角绿色即可看到一堆日志输出（看不懂就别乱动，~~（懒×3）~~），也可以运行JavaScript代码，等效与命令方块


## ㈦注意事项
### ⑴不应跑得比地图加载快
（~~Although没什么后果，只有一条提示~~），BUT 有时候会**掉落虚空**(null)，掉落虚空后，将会发现速度不断增大至100m/s左右，直到空气阻力与重力平衡，然后便到达*地狱*了  

### ⑵You'd better not修改*dat.gui.js(control)*里面的东西
尤其是
+ **天气(weather)中sprite雨滴个数**。如果被修改，必须点击下方的`清空(clean)`按钮以清空所有雨滴（无效请刷新/重启应用），否则将有一部分雨滴会停留在空中
+ **场景(scene)的子对象(children)Objects的个数**。如果修改了，就**不能**怎么清空了，必须刷新/重启应用
*注：刷新可以用命令`location.reload();`*
+ **deskgood的工具栏(hold)的物品ID**。如果修改，可能导致意想不到的后果？

### ⑶掉落虚空(null)解决办法*（生命诚可贵，生命只有一次，请珍爱生命）*
1. **在进入地狱前**，使用调试工具修改角色`deskgood`坐标（输入`camera.userData.pos.y=1000;`）
2. **死亡点击`结束`按钮前**，试图找到种子和存档（手机上几乎不可能的，我自己都没找到）并copy备份，重新开始游戏后覆盖存档
3. 死亡后，清除localStorage.die（`localStorage.remove("die");`），重新打开应用
4. 死亡后，删除应用数据，重新打开应用，开始新的世界（deskgood开始新的人生）
5. 死亡后，重装应用，重新打开应用，开始新的世界（deskgood开始新的人生）

### ⑷*地狱* 和 *天堂* （*《黑与白》*）
1. *地狱*：当玩家的Y坐标达到-18\*10000px(cm)=-18\*100m以下（~~即-18层地狱~~）时，将会到达地狱。约3s后，角色`deskgodd`将会死亡。
2. *天堂*：当玩家的Y坐标达到无限(Infinity)以上时，将会到达天堂。约3s后，角色`deskgood`也会死亡。

### ⑸关于角色`deskgood`的死亡
当`deskgood`死亡时，将会自动删除存档，弹出提示，并自动关闭，**无法复活**，只能重新开始游戏*（生命诚可贵，生命只有一次，请珍爱生命）*


## ㈧关于运行
1. 网页版运行：当前可以直接访问 <https://wzh656.github.io/MinecraftWeb/home.html> 运行，注意，部分~~垃圾~~浏览器可能不支持。还有竖屏时会有一个提示使用横屏或者下载，如果浏览器~~不垃圾~~支持横屏，可以将手机横屏使用；也可以点击关闭，直接竖屏运行（虽然竖屏的我的世界有点怪）  
2. 手机apk软件运行：直接横屏运行
    + [手机版(apk)v1.0.0.3-alpha临时完整版（较大，30+MB）（无存档，与v0.x.x不兼容，需先卸载重装）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.0.0.3-alpha/full.apk)
    + [手机版(apk)v1.0.0.3-alpha临时简化版（在线字体、BGM，6+MB）（无存档，与v0.x.x不兼容，需先卸载重装）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.0.0.3-alpha/full.apk)
    
    + [手机版(apk)v0.5.0-alpha完整版（较大，20+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-full.apk)  
    + [手机版(apk)v0.5.0-alpha简化版（在线字体、BGM，5+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-simplified.apk)  

（简化版只是因为觉得完整版太大了，并且可能有一些不必要的资源占内存）

## ㈨效果图片

> 网页版（竖屏）

<img alt="效果图片（竖屏我的世界）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/10.png" />  
<img alt="效果图片（好雨知时节）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/11.png" />  
<img alt="效果图片（命令方块）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/12.png" />  
<img alt="效果图片（工具栏&bgm）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/13.png" />  

> 0.4.1版

<img alt="效果图片" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/8.png" />  
<img alt="效果图片（火柴盒）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/9.png" />  

> 0.4.0版

<img alt="效果图片（W）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/5.png" />  
<img alt="效果图片（Z）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/6.png" />  
<img alt="效果图片（H）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/7.png" />  
<img alt="效果图片（落日）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/t.gif" />  

> 0.3.2版

<img alt="效果图片（诡异落日）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/1.jpg" />  
<img alt="效果图片" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/2.png" />  
<img alt="效果图片（虚空景观）" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/3.png" />  
<img alt="效果图片" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/4.png" />
