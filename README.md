# 我的世界（仿）
修改日期:2020.7.8

# 运行
+ [手机版(apk)v1.0.0.1-alpha临时完整版（较大，20+MB）（与之前不兼容，无存档，需先卸载重装）](https://github.com/wzh656/MinecraftWeb/releases/download/v1.0.0.1-alpha/Minecraft-full.apk)

+ [手机版(apk)v0.5.0-alpha完整版（较大，20+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-full.apk)

+ [手机版(apk)v0.5.0-alpha简化版（在线字体、BGM，5+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha//Minecraft-simplified.apk)

+ [web版（对网速要求较高，网速慢者无法运行）](https://wzh656.github.io/MinecraftWeb/home.html)

可在[后面（㈧关于运行）](#关于运行)详细查看

提示：部分功能未完善，存在少量问题未解决

# 说明：
## ㈠关于角色
1. 本游戏的角色是一个名为`deskgood`（桌子好）的“桌子”~~以纪念同桌桌子好之死和他的ugly~~  
2. 事实上，在场景(scene)中，并没有加入(add)角色，而是通过控制透视相机的移动(封装命令方法`deskgood.move`=`deskgood.moveTo`,`deskgood.go`…)及朝向(lookAt)来实现角色的移动与朝向  
3. 在程序中，定义了一个全局变量`deskgood`以封装控制角色的方法  


## ㈡先不管那些调试工具，~~懒得删（跟`deskgood`学的）~~，先看那两个圆(circles)：移动(move)、跳跃(jump)
1. 移动：左边的大圆(left big circle)，摇杆操作（其实我觉得按键较好，但摇杆做起来方便~~（懒×2）~~）  
2. 跳跃：右边的小圆(right small circle)，可以与移动同时操作。按下(touch start)之后，如果脚下不为真空(#0)，则将以约2m/s竖直向上的速度(v.y+=2m/s)“飞”起来
### 关于重力加速度(gravity)和空气阻力
角色`deskgood`跳起后，由于地球的吸引（地心引力），产生一个a=-9.8m/s²的竖直向下的加速度，致使角色`deskgood`进行匀变速直线运动。
同时，由于空气阻力作用，部分机械能转化为与空气摩擦的内（热）能，导致速度减小~~（刚说是真空呢）~~。
空气阻力大小与摩擦面大小、速度的平方成正比（根据百度公式：F=(1/2)CρSV²，及Newton first law:F=ma）。因此得到，当速度达到一个值(|v|≈98m/s)时，将可能出现摩擦力与重力平衡，使角色`deskgood`“匀速”直线运动  


## ㈢关于地图
1. 《我的世界》地图由种子(seed)经过柏林噪声(perlin noise)产生  
2. 《我的世界（仿）》地图为平坦模式，地面（20×20×2），可用（可放置方块）空间（20×20×20）  


## ㈣关于方块
1. 方块类型：真空~~（in fact is air）~~，草方块，木板，石头，原石，命令方块……。  
2. 方块大小：当前，每个方块为边长1m=100cm=100px的立方体（+贴图）
3. 方块放置：短按(<1000ms=1s的touch)屏幕，使用光线投射法判断点击面与点击物体，若与之距离小于5m=500px（deskgood is 长臂猿），则在相应点击方块的相应方向放置一个石头方块。  
4. 方块删除：长按(>=1000ms=1s的touch)屏幕使用光线投射法判断点击物体，若与之距离小于5m=500px（deskgood is 长臂猿），则删除对应位置物体。  
5. 关于命令方块及教程(id:8)：可使用dat.gui.js(control)设置工具栏(tools)物品id得到，点击后将打开命令方块界面，将可在里面输入JavaScript命令  
    1. 命令：`deskgood.move(x,y,z);`（请在x,y,z处填上对应的值，单位：px或cm）可让角色`deskgood`移动到指定笛卡尔坐标。 e.g. `deskgood.move(0,0,10000*100);`可使角色`deskgood`到达坐标(0,0,1000000) ~~，即坐标原点的万米高空~~  
    2. `deskgood.moveTo(x,y,z);` 同①(`deskgood.move(x,y,z)`)，只是不同名称。  
    3. `deskgood.go(x,y,z);` （请在x,y,z处填上对应的值，单位：px或cm）将角色`deskgood`的坐标向量与向量(x,y,z)相加。 e.g. `deskgood.go(0,0,10000*100);`可使角色`deskgood`往上移动10000m=10000*100cm=1000000px ~~还是万米高空，只是以当前坐标为基础再+10000m~~  
    4. 其他命令暂请期待……
    5. 由于是直接运行JavaScript代码，所以可以直接输入原生JavaScript代码。 e.g. `location.href="https://www.baidu.com/";`可改变浏览网址，跳转到百度。而`location.reload();`可刷新页面，相当于重启  


## ㈤关于天气(weather)
每次进入游戏后，将有50%的概率发生降水
+ 不降水：雨滴增加率=0  
+ 降水：雨滴增加率=随机数（*非平均分布*）∈[0,1)  

之后，将每隔1ms(实际要远大于此值)检测一次，根据随机数判断是否增加雨滴。若增加，则在x∈[-1000,1000),y∈[50000,10000),z∈[-1000,1000)中的随机一位置产生 【间隔时间(ms)/3.6】 个 【宽:[3,6)px,高:[10,36)px】 的雨滴。并且每个雨滴都将的以y:-10m/s²的加速度下落。

### 关于雨滴
雨滴是一种sprite，即只有一个面（永远平行于屏幕）的物体，颜色为`#4c51a7`


## ㈥注意事项
### ⑴不应到达地图边缘，若到达则会发生：
+ ~~可能被**卡住**~~（已修复）  
+ 可能**掉落虚空**(null)，掉落虚空后，将会发现速度不断增大，直到空气阻力与重力平衡  

### ⑵You'd better not修改*dat.gui.js(control)*里面的东西
尤其是
+ **天气(weather)中sprite雨滴个数**。如果被修改，必须点击下方的`清空(clean)`按钮以清空所有雨滴，否则将有一部分雨滴会停留在空中
+ **场景(scene)的子对象(children)Objects的个数**。如果修改了，就**不能**怎么清空了，必须刷新/重启应用 *注：刷新可以用命令`location.reload();`*

### ⑶掉落虚空(null)解决办法*（生命诚可贵，生命只有一次，请珍爱生命）*
1. 使用调试工具(输入`camera.userData.pos.y=1000;`)  
2. 删除应用数据  
3. 重装应用  


## ㈦关于工具
> ⑴*state.js*库：左上角(left-top corner)默认蓝色(normal blue)

可以使用该工具查看当前渲染状态，该工具有3种状态（点击切换(click to change)）
+ fps:蓝色（默认），查看当前每秒可渲染的帧数，越大越流畅（一般最佳：60fps（电脑就这样，手机（特烂）只有10+fps））  
+ ms:绿色(green)，查看渲染每帧需要的时间(ms)，越小越流畅（一般最佳：16ms/帧）  
+ MB:红色(red)，查看当前使用的内存(MB兆字节)  

> ⑵*dat.gui.js*库：右上角(right-top corner)，点击可展开

1. backup按钮：本来是保存的意思（in fact is "save"）（每隔60*1000ms=60s=1min会自动保存一次）
2. 场景(scene)
    1. 雾(fog)：具有far,near,颜色(color)属性  
3. 角色(deskgood)（观察者(watcher)）（相机(camera)）
    1. 灵敏度：游戏玩家滑动屏幕时改变角色`deskgood`朝向的程度，默认值：1，手机版可适当调大  
    2. 位置：分为x,y,z轴，单位px(100px=1m)  
    3. 速度：分为x,y,z轴，单位m/s，可以通过调节位置和速度来从虚空中上来，或是挽救被卡(qiǎ)住的`deskgood`角色（千万别动x,z轴的速度，否则……，删除数据吧）。  
    4. 朝向（球坐标系），分为上下(top-bottom)角度，左右(left-right)角度，单位度  
    5. 朝向（笛卡尔坐标系），分为x,y,z轴，采用标准单位向量表示  
    6. 天旋地转：对应camera的up属性，反正看不懂就别乱动就对了，如果乱调就会造成移动朝向时天旋地转的效果，电脑最明显，头晕了别怪我  
    7. 工具(tools)栏（对应角色`deskgood`拿在手中的物品~~，虽然两只手拿4m³物品不太可能，但比《我的世界》真实多了~~）
        1. 选择工具：指当前选择要操作的物品。如果为空，挖掘物品时默认先放入此位置；如果要方块，放置物品时则放置此物品
        2. 物品：接下来的四个对应手中拿的四样物品的ID（0为空气/真空）

> ⑶*VConsole.js*库：手机调试工具，点击右下角绿色即可看到一堆日志输出（看不懂就别乱动，~~（懒×3）~~）


## ㈧关于运行
1. 网页版运行：当前可以直接访问 <https://wzh656.github.io/MinecraftWeb/home.html> 运行，注意，部分~~垃圾~~浏览器可能不支持。还有竖屏时会有一个提示使用横屏或者下载，如果浏览器~~不垃圾~~支持横屏，可以将手机横屏使用，并会有提示重新刷新页面，否则将会变形；也可以点击关闭，直接竖屏（虽然竖屏的我的世界有点怪）  
2. 手机apk软件运行：直接横屏运行
    + [手机版(apk)v0.5.0-alpha完整版（较大，20+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-full.apk)  
    + [手机版(apk)v0.5.0-alpha简化版（在线字体、BGM，5+MB）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.5.0-alpha/Minecraft-simplified.apk)  


## ㈨关于效果（图片）

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
