/*
* keydown
*/
let keydown = {
	key: new Set(),
	double_run: [],
	t0: null
};
document.addEventListener("keydown", function (e){
	if (e.keyCode == 69){ //E 切换背包
		if (stop == "bag" || stop == false){
			console.log("E:", keydown.key);
			state("bag");
			return false;
		}
	}
	if (e.keyCode == 27 && typeof stop == "string"){ //ESC 退出界面
		console.log("ESC", stop, ":", keydown.key);
		
		//手动切换退出
		$("#"+stop).css("display", "none");
		console.log(stop, ":close");
		stop = false;
		document.exitPointerLock();
		//手动更新锁定情况
		if (
			document.pointerLockElement === document.body ||
			document.mozPointerLockElement === document.body ||
			document.webkitPointerLockElement === document.body
		){ //已锁定
			console.log("pointerLock yes");
			stop = false;
			$("#help").css("display", "none");
		}else{ //未锁定
			console.log("pointerLock no");
			stop = true;
			$("#help").css("display", "inline-block");
			SQL_save();
		}
		
		return false;
	}
	
	if (e.keyCode == 19){ //Pause-Break 切换
		if (stop){ //暂停
			if (typeof stop == "string"){ //打开窗口
				let stop0 = stop;
				state(stop);
				console.log("Pause-Break", stop0, "changeTo", stop);
			}else{ //普通暂停
				let stop0 = stop;
				document.body.requestPointerLock();
				stop = false;
				console.log("Pause-Break", stop0, "changeTo", stop);
			}
		}else{ //未暂停
			let stop0 = stop;
			stop = true;
			// $("#game,#mouse").css("cursor", "default");
			SQL_save();
			document.exitPointerLock();
			console.log("Pause-Break", stop0, "changeTo", stop);
		}
		return false;
	}
	if (e.keyCode == 121){ //F10 切换调试
		console.log("F10:", keydown.key);
		if (gui.closed){
			gui.open();
		}else{
			gui.close();
		}
		return false;
	}
	if (e.keyCode == 113){ //F2 截图
		console.log("F2:", keydown.key);
		var oA = document.createElement("a");
		oA.download = "截图";
		oA.href = $("#game")[0].toDataURL();
		document.body.appendChild(oA);
		oA.click();
		oA.remove(); // 下载之后把创建的元素删除
	}
	if (e.keyCode == 114){ //F3 切换调试
		console.log("F3:", keydown.key);
		if (localStorage.getItem("debug") == "false"){ //false
			localStorage.setItem("debug", true);
		}else{ //true 或 null
			localStorage.setItem("debug", false);
		}
		location.reload();
	}
	
	if (stop){
		keydown.double_run = [];
		return false;
	}
	
	if (e.keyCode == 27){ //ESC 暂停游戏
		console.log("ESC:", keydown.key);
		
		stop = true;
		// $("#game,#mouse").css("cursor", "default");
		SQL_save();
		document.exitPointerLock();
		
		return false;
	}
	if (e.keyCode == 87 | e.keyCode == 38){
		if (keydown.double_run.length == 0){
			keydown.double_run[0] = +time.getTime();
		}else if (keydown.double_run.length == 2 && +time.getTime()-keydown.double_run[1] < 500){ //连按
			keydown.double_run = true;
			console.log("run");
		}
	}
	
	keydown.key.add(e.keyCode);
	
	return false;
});
document.addEventListener("keyup", function (e){
	keydown.key.delete(e.keyCode);
	
	if (e.keyCode == 87 | e.keyCode == 38){
		if (keydown.double_run.length == 1 && +time.getTime()-keydown.double_run[0] < 500){
			keydown.double_run[1] = +time.getTime();
		}else{
			keydown.double_run = [];
		}
	}
	return false;
});
let last_jump = time.getTime()-1000;
setInterval(function(){
	if (stop){
		keydown.key = new Set();
		keydown.t0 = null;
		return;
	}
	let t;
	if (keydown.t0){
		t = +time.getTime()-keydown.t0;
		keydown.t0 = +time.getTime();
	}else{
		keydown.t0 = +time.getTime();
		return;
	}
	
	let x=0, y=0, z=0;
	
	/* if (keydown.key.size)
		console.log("keydown:", keydown.key); */
	
	if ((keydown.key.has(87) | keydown.key.has(38)) & keydown.key.has(17)){ //control 按下
		keydown.double_run = true;
		console.log("run");
	}
	
	if (keydown.key.has(87) | keydown.key.has(38)){ //前
		console.log("front:", keydown.key);
		x += Math.cos( (deskgood.lookAt.left_right+0) /180*Math.PI) *(keydown.double_run==true?3:1) *rnd_error();
		z += Math.sin( (deskgood.lookAt.left_right+0) /180*Math.PI) *(keydown.double_run==true?3:1) *rnd_error();
	}
	if (keydown.key.has(83) | keydown.key.has(40)){ //后
		console.log("behind:", keydown.key);
		x += Math.cos( (deskgood.lookAt.left_right+180) /180*Math.PI) *rnd_error();
		z += Math.sin( (deskgood.lookAt.left_right+180) /180*Math.PI) *rnd_error();
	}
	if (keydown.key.has(65) | keydown.key.has(37)){ //左
		console.log("left:", keydown.key);
		x += Math.cos( (deskgood.lookAt.left_right-90) /180*Math.PI) *rnd_error();
		z += Math.sin( (deskgood.lookAt.left_right-90) /180*Math.PI) *rnd_error();
	}
	if (keydown.key.has(68) | keydown.key.has(39)){ //右
		console.log("right:", keydown.key);
		x += Math.cos( (deskgood.lookAt.left_right+90) /180*Math.PI) *rnd_error();
		z += Math.sin( (deskgood.lookAt.left_right+90) /180*Math.PI) *rnd_error();
	}
	if (keydown.key.has(32)){ //上
		console.log("up:", keydown.key);
		y += 1*rnd_error();
	}
	/* if (keydown.key.has(16)){ //下
		console.log("down:", keydown.key);
		y += -1*rnd_error();
	} */
	
	/* x = x*10 + (x>0? 10: x<0? -10: 0);
	z = z*10 + (z>0? 10: z<0? -10: 0);
	
	try{
		if (
			map.get((deskgood.pos.x+x)/100,
				deskgood.pos.y/100,
				deskgood.pos.z/100)
			!=
				null
		){ //无法向X移动
			x = 0;
		}
	}catch(err){}
	try{
		if (map.get((deskgood.pos.x+x)/100,
				deskgood.pos.y/100-1,
				deskgood.pos.z/100)
			!=
				null
		){ //无法向X移动
			x = 0;
		}
	}catch(err){}
	
	try{
		if (map.get(deskgood.pos.x/100,
				deskgood.pos.y/100,
				(deskgood.pos.z+z)/100)
			!=
				null
		){ //无法向Z移动
			z = 0;
		}
	}catch(err){}
	try{
		if (map.get(
				deskgood.pos.x/100,
				deskgood.pos.y/100-1,
				(deskgood.pos.z+z)/100)
			!=
				null
		){ //无法向Z移动
			z = 0;
		}
	}catch(err){}
	
	x -= (x>0? 10: x<0? -10: 0);
	z -= (z>0? 10: z<0? -10: 0);
	
	deskgood.pos.x += x*rnd_error();
	deskgood.pos.z += z*rnd_error(); */
	
	if (x && z)
		console.log("go",x,z);
	
	if (x || y || z)
		deskgood.go(x*t*0.1, 0, z*t*0.1); // 1m/s = 100px/s = 0.1px/ms
	
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-2,
			deskgood.pos.z/100)
	){ //脚下有方块
		if (time.getTime()-last_jump >= 1000 & y != 0){
			console.log("jump");
			deskgood.v.y += y * deskgood.jump_v*rnd_error();
			last_jump = +time.getTime();
		}
	}
}, 16.667);