/**
* 创建场景对象Scene
*/
const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#fff", 0.01, 300*100);
//						 雾气颜色，近处的距离，远处的距离(66m)

if (DEBUG){
	const scene_folder = gui.addFolder("场景(scene)");
		scene_folder.add(scene.children, "length", 0, 10000).name("物体(object)个数").listen();
		scene_folder.add(localStorage, "我的世界_seed").name("地图种子");
		const scene_fog_folder = scene_folder.addFolder("雾(fog)");
			scene_fog_folder.add(scene.fog, "far", 15*100, 1000*100, 100);
			scene_fog_folder.add(scene.fog, "near", 0.001, 10);
			scene_fog_folder.addColor(scene.fog, "color").listen();
		const scene_chunk_folder = scene_folder.addFolder("区块(chunk)");
			scene_chunk_folder.add(map, "perloadLength", 100, 10000, 100).name("预加载范围/px");
}

/* const floor_geometry = new THREE.PlaneGeometry(1000, 1000, 6, 6);
const floor_material = new THREE.MeshBasicMaterial({ color:"#fff"});
//floor_material.wireframe = true; //仅框架
floor_mesh = new THREE.Mesh(floor_geometry, floor_material);
// 由于平地添加后默认是在正前方 所以需要旋转一下
floor_mesh.rotation.x = -0.5 * Math.PI;
floor_mesh.position.y = -10;
scene.add(floor_mesh); */


/* // 改变AxesHelper构造函数的参数，可以改变三维坐标轴的大小
// 参数设置坐标轴大小:1000
const axesHelper = new THREE.AxesHelper(1666);
scene.add(axesHelper); */


/**
* 光源设置
*/

/*//点光源
const point = new THREE.PointLight(0xffffff);
point.position.set(0, 10*100, 0); //点光源位置
scene.add(point); //点光源添加到场景中*/
if (DEBUG){
	const scene_light_folder = gui.__folders["场景(scene)"].addFolder("光源(light)");
}

//平行光
const directionalLight = new THREE.DirectionalLight("#fff", 1);
directionalLight.position.set(2, 1, 2);
directionalLight.castShadow = true;
directionalLight.onlyShadow = true;
directionalLight.shadow.mapSize.width = 2**10;  // default:512
directionalLight.shadow.mapSize.height = 2**10; // default:512
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 200*100;
directionalLight.shadow.camera.left = -200*100;
directionalLight.shadow.camera.right = 200*100;
directionalLight.shadow.camera.top = 200*100;
directionalLight.shadow.camera.bottom = -200*100;
setTimeout(function(){
	message("设备性能提示",
	`<font style="font-size:16px">`+
		`如果设备`+
			`<b>性能差</b>`+
			`，使用光影效果将会导致`+
			`<b>卡顿</b>。`+
			`<button onclick="directionalLight.castShadow=false;message('关闭光影','妈妈再也不用担心手机卡还发烫了（只担心画质丑的一批）', 3);">`+
				`点此可关闭光影`+
			`</button>`+
		`</font>`, 5);
},1000);
/* document.addEventListener("plusready", function(){
	plus.nativeUI.toast(
		
		{
			type:"richtext",
			duration:"long",
			verticalAlign: "top",
			richTextStyle:{align:"center"}
		}
	);
}); */
scene.add(directionalLight);

if (DEBUG){
	const scene_light_directionalLight_folder = gui.__folders["场景(scene)"].__folders["光源(light)"].addFolder("平行光(directionalLight)");
		scene_light_directionalLight_folder.add(directionalLight, "castShadow").name("阴影").listen();
		const scene_light_directionalLight_mapSize_folder = scene_light_directionalLight_folder.addFolder("阴影贴图大小(mapSize)");
			scene_light_directionalLight_mapSize_folder.add(directionalLight.shadow.mapSize, "width", 2**9, 2**12, 2**9);
			scene_light_directionalLight_mapSize_folder.add(directionalLight.shadow.mapSize, "height", 2**9, 2**12, 2**9);
		const scene_light_directionalLight_position_folder = scene_light_directionalLight_folder.addFolder("位置(position)");
			scene_light_directionalLight_position_folder.add(directionalLight.position, "x", -3, 3, 0.1);
			scene_light_directionalLight_position_folder.add(directionalLight.position, "y", -3, 3, 0.1);
			scene_light_directionalLight_position_folder.add(directionalLight.position, "z", -3, 3, 0.1);
}

//辅助线
//const directionalLight_CameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(directionalLight_CameraHelper);

//户外光源
const hemiLight = new THREE.HemisphereLight("#87ceeb", "#f5deb3", 0.4/*"#aaf", "#888", 1*/);
hemiLight.position.set(0,500,0);
scene.add(hemiLight);

if (DEBUG){
	const scene_light_hemiLight_folder = gui.__folders["场景(scene)"].__folders["光源(light)"].addFolder("户外光源(hemiLight)");
		const scene_light_hemiLight_position_folder = scene_light_hemiLight_folder.addFolder("位置(position)");
			scene_light_hemiLight_position_folder.add(hemiLight.position, "x", -3, 3, 0.1);
			scene_light_hemiLight_position_folder.add(hemiLight.position, "y", -3, 3, 0.1);
			scene_light_hemiLight_position_folder.add(hemiLight.position, "z", -3, 3, 0.1);
}

//环境光
const ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

if (DEBUG){
	const scene_light_ambient_folder = gui.__folders["场景(scene)"].__folders["光源(light)"].addFolder("环境光(ambient)");
		scene_light_ambient_folder.addColor(ambient, "color").listen();
}

/**
* 相机设置
*/
/* let width = window.innerWidth; //窗口宽度
let height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 1000; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(0, 200, 0); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象) */

let WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

const camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 1000*100);
//								 view_angle, aspect, near, far(1km)
camera.position.set(0, ( Math.floor(sNoise.height(map.seed.noise, map.seed.h, 0, 0))+2 )*100, 0); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
/*setTimeout(function(){
	console.info(camera);
},1000);*/

/**
* 创建渲染器对象
*/
const renderer = new THREE.WebGLRenderer({
	antialias: true, //抗锯齿
	preserveDrawingBuffer: true // required to support .toDataURL()
});
renderer.setSize(WIDTH, HEIGHT);//设置渲染区域尺寸
renderer.setClearColor("#eef", 1); //设置背景颜色
renderer.domElement.style.margin = "0";
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
// renderer.domElement.style.cursor = "none";
renderer.domElement.id = "game";
renderer.shadowMapEnabled = true; //阴影
//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera);

renderer.color = {
	get clearColor(){
		return renderer.getClearColor();
	},
	set clearColor(value){
		console.log("set clear color:", value);
		renderer.setClearColor(
			"rgb("+
				Math.round(value.r)+","+
				Math.round(value.g)+","+
				Math.round(value.b)+
			")"
		, 1);
	}
};
if (DEBUG){
	const renderer_folder = gui.addFolder("渲染器(renderer)");
		renderer_folder.addColor(renderer.color, "clearColor").listen();
}

window.onresize = function(){
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix(); //更新投影矩阵
};


/**
* 背景
*/
const {latitude:40, longitude:116} = localStorage.setItem("我的世界_position") || {};
const θ = THREE.Math.degToRad(20); //纬度20°
let daytime;
time.setInterval(function(){
	let δ
	let daytime = 24 - 2/15 *Math.acos( Math.sin(23.5) * Math.sin(20) );
})
//clearColor
const backgroundColor = new ColorUpdater({
	//Red红色
	R:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5}, //时间time
		v: {s: 10, i: 220} //10->230
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 230, i: -220} //230->10
	}],
	//Green绿色
	G:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5},
		v: {s: 10, i: 220} //10->230
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 230, i: -220} //230->10
	}],
	//Blue蓝色
	B:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5},
		v: {s: 20, i: 230} //20->250
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 250, i: -230} //250->20
	}]
}, renderer.setClearColor).update().autoUpdate(20*1000); // 20s/time

//ambientColor
const ambientColor = new ColorUpdater({
	//Red红色
	R:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5}, //时间time
		v: {s: 20, i: 100} //20->120
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 120, i: -100} //120->20
	}],
	//Green绿色
	G:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5},
		v: {s: 20, i: 100} //20->120
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 120, i: -100} //120->20
	}],
	//Blue蓝色
	B:[{ //日出
		t: {s: ColorUpdater.dateToNumber(6), d: 0.5},
		v: {s: 36, i: 100} //36->136
	},{ //日落
		t: {s: ColorUpdater.dateToNumber(18), d: 0.5},
		v: {s: 136, i: -100} //136->36
	}]
}, (v)=>{
	ambient.color = new THREE.Color(v);
}).update().autoUpdate(20*1000); // 20s/time
/*function dateToNumber(h=0, m=0, s=0){
	return (s/60+m)/60+h;
}
const bgcConfig = {
	//Red红色
	R:[{ //日出
		t: {s: dateToNumber(6), c: 0.5}, //时间time
		v: {s: 10, i: 230} //范围range（起始）
	},{
		t: {s: dateToNumber(18,10), c: 0.5},
		v: {s: 240, i: -230}
	}],
	//Green绿色
	G:[{ //日出
		t: {s: dateToNumber(6,10), c: 0.5},
		v: {s: 10, i: 230}
	},{
		t: {s: dateToNumber(18), c: 0.5},
		v: {s: 240, i: -230}
	}],
	//Blue蓝色
	B:[{ //日出
		t: {s: dateToNumber(6,10), c: 0.5},
		v: {s: 20, i: 230}
	},{
		t: {s: dateToNumber(18), c: 0.5},
		v: {s: 250, i: -230}
	}],
	//更新函数
	update(){
		let h = time.getTime(), colors={};
		h = h.getHours() + h.getMinutes()/60 + h.getSeconds()/3600;
		//h = (h.getSeconds()+h.getMilliseconds()/1000)/60*24
		
		const pow = Math.pow, E = Math.E;
		for (const i of ["R", "G", "B"]){
			const t = bgcConfig[i];
			colors[i] = Math.round(Math.min(
				t[0].v.i / ( 1+pow( E,-(E/t[0].t.c)*(h-t[0].t.s) ) ) + t[0].v.s,
				t[1].v.i / ( 1+pow( E,-(E/t[1].t.c)*(h-t[1].t.s) ) ) + t[1].v.s
			));
		}
		console.log(colors, h);
		renderer.setClearColor(`rgb(${colors.R},${colors.G},${colors.B})`);
	}
};
setInterval(bgcConfig.update, 66);*/
//0~5:45	5:45	6:15		6:45~18:25	18:55		19:25		19:25~24
//天黑		日出(R)	日出(G,B)	白天		日落(G,B)	日落(R)		天黑
/*
setTimeout(function(){
	let h = time.getTime();
	//h = (h.getSeconds()+h.getMilliseconds()/1000)/60*24
	h = h.getHours() + h.getMinutes()/60 + h.getSeconds()/3600;
	if (h > dateToNumber(19,25) | h < dateToNumber(5,45)){ // 天黑
		ambient.color = new THREE.Color("#223");
		//renderer.setClearColor("#334", 1);
	}else if (h > dateToNumber(18,25) | h < dateToNumber(6,45)){ // 日出/日落
		ambient.color = new THREE.Color("#f9a");
		//renderer.setClearColor("#a34", 1);
	}else{ //白天
		ambient.color = new THREE.Color("#aac");
		//renderer.setClearColor("#eef", 1);
	}
	renderer.setClearColor(
		"rgb("+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(5,45) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(19,25) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+20, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+20 ))+
		")"
	);
}, 0);
setInterval(function(){
	let h = time.getTime();
	// h = (h.getSeconds()+h.getMilliseconds()/1000)/60*24
	h = h.getHours() + h.getMinutes()/60 + h.getSeconds()/3600;
	if (h > dateToNumber(19,25) | h < dateToNumber(5,45)){ // 天黑
		ambient.color = new THREE.Color("#223");
		//renderer.setClearColor("#334", 1);
	}else if (h > dateToNumber(18,25) | h < dateToNumber(6,45)){ // 日出/日落
		ambient.color = new THREE.Color("#f9a");
		//renderer.setClearColor("#a34", 1);
	}else{ //白天
		ambient.color = new THREE.Color("#aac");
		//renderer.setClearColor("#eef", 1);
	}
	renderer.setClearColor(
		"rgb("+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(5,45) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(19,25) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+20, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+20 ))+
		")"
	);
	/*console.log(
		"time:"+h,
		"\nR:",
		230/(1+Math.pow(6,-36/30*(h- dateToNumber(5,45) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(19,25) ))))+10,
		"\nG:",
		230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+10,
		"\nB:",
		230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+20, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+20,
		"\nRESULT:",
		"rgb("+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(5,45) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(19,25) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+10, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+10 ))+","+
			Math.round(Math.min( 230/(1+Math.pow(6,-36/30*(h- dateToNumber(6,15) )))+20, 230-(230/(1+Math.pow(6,-36/30*(h- dateToNumber(18,55) ))))+20 ))+
		")"
	);*//*
}, 5*1000); // 5s/次*/


let T0 = time.getTime(); //上次时间
function render(){
	const t = time.getTime()-T0; //时间差
	T0 = time.getTime(); //把本次时间赋值给上次时间
	requestAnimationFrame(render);
	renderer.render(scene, camera); //执行渲染操作
	stats.update();
	
	if (!stop){
		const ρ = 1.25*rnd_error(), //空气密度/(kg/m³)
			c = 0.4*rnd_error(), //空气阻力系数
			s = [0.5, 0.2, 0.5], //面积/m²
			v = [deskgood.v.x, deskgood.v.y, deskgood.v.z], //速度/(m/s)
			Fw = [], //空气阻力/N
			m = 50, //质量/m
			Aw = [] //空气阻力产生的加速度/(m/s²)
		for (let i=0; i<3; i++){
			Fw[i] = (1/2) * c * ρ * s[i] * v[i]*v[i]; //F = (1/2)CρSV²
			if (v[i] > 0) Fw[i] *= -1; //方向相反
			Aw[i] = Fw[i] / m; //F=ma => a=F/m
		}
		
		deskgood.v.y -= 9.8*t/1000*rnd_error(); //重力加速度
		deskgood.v.x +=
			Math.abs(Aw[0]*t/1000) < Math.abs(deskgood.v.x)?
				Aw[0]*t/1000
			:
				-deskgood.v.x
		;
		deskgood.v.y +=
			Math.abs(Aw[1]*t/1000) < Math.abs(deskgood.v.y)?
				Aw[1]*t/1000
			:
				-deskgood.v.y
		;
		deskgood.v.z +=
			Math.abs(Aw[2]*t/1000) < Math.abs(deskgood.v.z)?
				Aw[2]*t/1000
			:
				-deskgood.v.z
		;
		// console.info("aw:",Aw[1], "Fw:",Fw[1], "v:", deskgood.v)
		
		const rt = deskgood.go(deskgood.v.x*100*t/1000, deskgood.v.y*100*t/1000, deskgood.v.z*100*t/1000);
		//					m/s*100*ms/1000 => cm/s*s => cm => px
		if (rt[0]) deskgood.v.x = 0;
		if (rt[1]) deskgood.v.y = 0;
		if (rt[2]) deskgood.v.x = 0;
	}
}

//卡住检测
setInterval(()=>{
	const warn = [];
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100).get("attr", "block", "through")
	){ //头被卡住
		warn.push("头被卡住？");
		if (
			!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100,
				deskgood.pos.z/100).get("attr", "block", "transparent") //不透明
		) print("窒息提示", "你的头竟然卡到方块里了，想窒息吗？看你怎么出来", 1, "#f68");
		/* try{
			plus.nativeUI.toast(
				"<font size=\"16\">想窒息吗？还往头上放方块，看你怎么出来！</font>",
				{
					type:"richtext",
					verticalAlign: "top",
					richTextStyle:{align:"center"}
				}
			);
		}catch(err){} */
		/*setTimeout(function(){
			try{ plus.nativeUI.closeToast(); }catch(err){}
		},1);*/
	}
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100).get("attr", "block", "through")
	){ //脚被卡住
		warn.push("脚被卡住？");
	}
	
	if (warn.length && !stop){
		if (!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100,
				deskgood.pos.z/100
			) &&
			!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100+1,
				deskgood.pos.z/100
			) &&
			+time.getTime()-last_jump >= 1000
		){
			last_jump = +time.getTime();
			deskgood.v.y += deskgood.jump_v*rnd_error(); //自动跳跃
		}
		
		if (warn[0] & warn[1]){
			console.warn(warn[0], warn[1]);
		}else{
			console.warn(warn[0]);
		}
	}
}, 36);
// render();
// 间隔30ms周期性调用函数fun
//setInterval("render()",16.7)

/* const controls = new THREE.OrbitControls(camera,renderer.domElement);//创建控件对象
controls.addEventListener("change", render);//监听鼠标、键盘事件 */