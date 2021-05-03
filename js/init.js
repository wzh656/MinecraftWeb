var stop = true, //游戏状态
	device = 0; //设备代码
const time = new GameTime(localStorage.getItem("我的世界_time"), 1), //游戏时间
	REQUIRE_PICTURE = ["./img/textures/textures.png"]; //需要加载的贴图

//状态设置
function status(id, pointerLock){
	if ($("#"+id).css("display") != "none"){ //已显示
		$("#"+id).css("display", "none");
		stop = false;
		document.body.requestPointerLock();
		console.log(id, ":close");
	}else{ //未显示
		$("#"+id).css("display", $("#"+id).attr("data-display") || "block");
		stop = id;
		document.exitPointerLock();
		console.log(id, ":open");
	}
	return;
}

// 判断手机电脑
if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(
		navigator.userAgent.toLowerCase()
) ){ //手机(-)
	if ( navigator.userAgent.toLowerCase().indexOf("html5plus") != -1 ){ //html5+
		device = -2;
	}else{ //浏览器
		device = -1;
	}
}else{ //电脑(+)
	if (typeof require != "undefined"){ //electron
		device = +2;
	}else{ //浏览器
		device = +1;
	}
}
console.log("device:", device)


//退出
function exit(){
	if (typeof require != "undefined"){ //electron
		window.close();
	}

	window.open("home.html", "_self").close(); //website

	try{ //html5+
		plus.runtime.quit();
	}catch(e){}
}


//运行命令方块
function run(code){
	try{
		eval(code);
	}catch(err){
		console.error("【命令】\n代码运行出错，错误信息（自行翻译）：\n"+err);
		alert("代码运行出错，错误信息（自行翻译,可在VConsole查看）：\n"+err);
		/* $.get("http://fanyi.youdao.com/translate",{
			doctype: "json",
			type: "auto",
			i: err
		},function(data, state, xhr){
			console.log(data);
			try{
				if (state == "success" & !!data.translateResult[0][0].tgt){
					console.error("【命令方块】\n代码运行出错，错误信息：\n"+err+"\n译文（有道翻译提供）："+data.translateResult[0][0].tgt);
					alert("代码运行出错，错误信息（可在VConsole查看）：\n"+err+"\n译文（有道翻译提供）："+data.translateResult[0][0].tgt);
				}else{
					console.error("【命令方块】\n代码运行出错，错误信息（自行翻译）：\n"+err);
					alert("代码运行出错，错误信息（自行翻译,可在VConsole查看）：\n"+err);
				}
			}catch(e){
				console.error("【命令方块】\n代码运行出错，错误信息（自行翻译）：\n"+err);
				alert("代码运行出错，错误信息（自行翻译,可在VConsole查看）：\n"+err);
			}
		}); */
	}
}


//2维射线检测
function ray2D(x, y){
	if (x===undefined) x = WIDTH/2;
	if (y===undefined) y = HEIGHT/2;
	const raycaster = new THREE.Raycaster(), //光线投射，用于确定鼠标点击位置
		mouse = new THREE.Vector2(); //创建二维平面
	mouse.x = 2*(x/WIDTH)-1;
	mouse.y = -2*(y/HEIGHT)+1;
	//console.log("get:", x, y, mouse.x, mouse.y);
	//以camera为z坐标，确定所点击物体的3D空间位置
	raycaster.setFromCamera(mouse, camera);
	//确定所点击位置上的物体数量
	const objs = raycaster.intersectObjects(scene.children);
	//选中后进行的操作
	return objs.filter(obj => obj.faceIndex !== null); //过滤
}

//3维射线检测
function ray3D(start, end, near, far){
	start.x = start.x || deskgood.pos.x,
	start.y = start.y || deskgood.pos.y,
	start.z = start.z || deskgood.pos.z;
	end.x = end.x || 0,
	end.y = end.y || 0,
	end.z = end.z || 0;
	
	const ray = new THREE.Raycaster(
		new THREE.Vector3(start.x, start.y, start.z),
		new THREE.Vector3(end.x, end.y, end.z),
		near,
		far
	);
	ray.camera = camera;
	const objs = ray.intersectObjects(scene.children);
	return objs.filter(obj => obj.faceIndex !== null); //过滤
}


//随机误差(±10%)
function rnd_error(){
	return Math.random()*0.2+0.9;
}


//录屏
function record(canvas, time, opt={}){
	const {fps=30, audioBitsPerSecond=128000, videoBitsPerSecond=8500000} = opt,
		
		chunks = new Set(),
		mediaStream = canvas.captureStream(fps), // 设置帧频率(FPS)
		mediaRecord = new MediaRecorder(mediaStream, {
			audioBitsPerSecond,
			videoBitsPerSecond
		});
	
	mediaRecord.ondataavailable = (e)=>{ // 接收数据
		chunks.add(e.data);
		
		console.log(e.data);
		const videoBlob = new Blob(chunks, {type: "video/mp4"}),
			videoUrl = window.URL.createObjectURL(videoBlob);
		Img.download(videoUrl, "录屏.mp4");
	};
	
	mediaRecord.start(); //开始录屏
	return ()=>mediaRecord.stop();
}
