# 我的世界（仿）

运行：  
+ [web版](https://wzh656.github.io/MinecraftWeb/main.html)

+ [手机版(apk)v0.3.2-alpha（非最新）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.3.2-alpha/Minecraft_v0.3.2-alpha.apk)

提示：部分功能未完善，存在少量问题未解决

# 说明（终于补上了+修正）：
## ㈠先不管那些调试工具，~~懒得删（跟桌子好学的）~~


## ㈡先看那两个圆(circles)：移动(move)、跳跃(jump)
1. 移动：左边的大圆(left big circle)，摇杆操作（其实我觉得按键较好，但摇杆做起来方便~~（懒×2）~~）  
2. 跳跃：右边的小圆(right small circle)，可以与移动同时操作（按下(touch start)之后，如果脚下不为真空(#0)，则将以2m/s竖直向上的速度(v.y+=2m/s)“飞”起来，然后由于地球的吸引（地心引力），产生一个a=-9.8m/s²的竖直向下的加速度，致使玩家("deskgood")进行匀变速直线运动，同时，由于空气阻力作用，部分机械能转化为与空气摩擦的内能（热），导致速度减小~~（刚说是真空呢）~~，空气阻力大小与摩擦面大小、速度成正比，因此得到，当速度(∥v∥≈10.5m/s)达到一个值时，将可能出现摩擦力与重力平衡，使玩家("deskgood")匀速直线运动）  


## ㈢关于地图
1. 《我的世界》地图由种子(seed)经过柏林噪声(perlin noise)产生  
2. 《我的世界（仿）》地图为平坦模式，地面（20×20×2），可用（可放置方块）空间（20×20×20）  


## ㈣关于方块
1. 方块类型：真空（in fact is air），草方块，木板，石头，原石。  
2. 方块放置：短按(<1000ms=1s的touch)屏幕，使用光线投射法判断点击面与点击物体，若与之距离小于5m=500px（deskgood is 长臂猿），则在相应点击方块的相应方向放置一个石头方块。  
3. 方块删除：长按(>=1000ms=1s的touch)屏幕使用光线投射法判断点击物体，若与之距离小于5m=500px（deskgood is 长臂猿），则删除对应位置物体。  


## ㈤注意事项
### ⑴不应到达地图边缘，若到达则会发生：
+ 可能被卡住  
+ 可能掉落虚空(null)，掉落虚空后，将会发现速度不断增大，直到空气阻力与重力平衡  

### ⑵掉落虚空(null)解决办法*（生命诚可贵，生命只有一次，请珍爱生命）*
+ 使用调试工具  
+ 删除应用数据  
+ 重装应用  


## ㈥关于工具
> ⑴*state.js*库：左上角(left-top corner)默认蓝色(normal blue)，可以使用该工具查看当前渲染状态，该工具有3种状态（点击切换(click to change)）

+ fps:蓝色（默认），查看当前每秒可渲染的帧数，越大越流畅（一般最佳：60fps（电脑就这样，手机（特烂）只有10+fps））  
+ ms:绿色(green)，查看渲染每帧需要的时间(ms)，越小越流畅（一般最佳：16ms/帧）  
+ MB:红色(red)，查看当前使用的内存(MB兆字节)  

> ⑵*dat.gui.js*库：右上角(right-top corner)，点击可展开

1. backup按钮：本来是保存的意思（in fact is "save"）（每隔60*1000ms=60s=1min会自动保存一次）
2. 场景(scene)
    1. 雾(fog)：具有far,near,颜色(color)属性  
3. 玩家(player)（观察者(watcher)）（相机(camera)）
    1. 位置：分为x,y,z轴，单位px(100px=1m)  
    2. 速度：分为x,y,z轴，单位m/s，可以通过调节位置和速度来从虚空中上来，或是挽救被卡住的桌子好（千万别动x,z轴的速度，否则……，删除数据吧）。  
    3. 朝向（球坐标系），分为上下(top-bottom)角度，左右(left-right)角度，单位度  
    4. 朝向（笛卡尔坐标系），分为x,y,z轴，采用标准单位向量表示  

> ⑶*VConsole.js*库：手机调试工具，点击右下角绿色即可看到一堆日志输出（看不懂就别乱动，~~（懒×3）~~）


## ㈦关于运行
1.网页版运行：当前可以直接访问 <https://wzh656.github.io/MinecraftWeb/main.html> 运行，注意，部分~~垃圾~~浏览器可能不支持。还有竖屏时会有一个提示使用横屏或者下载，最好点击关闭，直接竖屏（虽然竖屏的我的世界有点怪），因为不知道横屏为什么会变形，and下载的是v0.3.2版，现在有更新版（至少是v0.3.3，解决了穿透方块的问题）了  
2.手机apk软件运行（[点击下载v0.3.2-alpha版（非最新）](https://github.com/wzh656/MinecraftWeb/releases/download/v0.3.2-alpha/Minecraft_v0.3.2-alpha.apk)）：直接转横屏运行（不会变形），并且运行之后会在`存储卡/Android/data/com.wzh656.mc`文件夹下创建一个`temp`临时文件夹，卸载后将自动删除。  


## ㈧关于效果（图片）

<img alt="效果图片1" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/1.jpg" />  
<img alt="效果图片2" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/2.jpg" />  
<img alt="效果图片3" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/3.jpg" />  
<img alt="效果图片4" style="width:100%;height:auto;" src="https://wzh656.github.io/MinecraftWeb/img/effect/4.jpg" />  

