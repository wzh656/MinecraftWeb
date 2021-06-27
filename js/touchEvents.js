const touch = {};



/**
* Touch Control
*/
touch.control = {
	x0: null,
	y0: null, //开始时位置
	x: null,
	y: null, //当前位置
	t0: null, //上次时间
	id: null
};

//start
$("#control").on("touchstart", function(e){
	if (stop)
		return;
	
	const {clientX: x, clientY: y} = e.originalEvent.targetTouches[0];
	//console.log("touchstart(control):", x, y);
	
	touch.control.x0 = x,
	touch.control.y0 = y,
	touch.control.t0 = +time.getTime();
	
	//循环
	touch.control.id = setInterval(function(){
		if ( touch.control.x0 !== null &&
			touch.control.y0 !== null &&
			touch.control.x !== null &&
			touch.control.y !== null
		){
			const t = time.getTime() - touch.control.t0; //时间间隔（游戏时间） 单位: ms
			touch.control.t0 = +time.getTime();
			
			const d = new THREE.Vector2(touch.control.x - touch.control.x0,
					touch.control.y - touch.control.y0), //与开始时的变化量
				len = d.length(); //长度
			
			if (len > 100){ //>100px 疾跑
				d.setLength(deskgood.ideal_v.sprint * t * 0.1); // 1m/s = 100cm/s = 0.1cm/ms
			}else{
				d.setLength(len/100*deskgood.ideal_v.walk * t * 0.1);
			}
			
			d.rotateAround(
				new THREE.Vector2(0, 0),
				Math.rad(deskgood.look.y + 90)
			);
			
			deskgood.go(d.x*rnd_error(), 0, d.y*rnd_error());
			
		}
	}, 16);
	
	return false;
});

//move
$("#control").on("touchmove", function(e){
	if (stop)
		return;
	
	const {clientX: x, clientY: y} = e.originalEvent.targetTouches[0];
	//console.log("touchmove(control):", x, y);
	
	touch.control.x = x,
	touch.control.y = y;
	
	return false;
});

//end
$("#control").on("touchend", function(e){
	const {clientX: x, clientY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchend(control):", x, y);
	
	clearInterval(touch.control.id);
	touch.control.x0 = touch.control.y0 = touch.control.x = touch.control.y = touch.control.t0 = touch.control.id = null;
	
	return false;
});

//cancel
$("#control").on("touchcancel", function(e){
	const {clientX: x, clientY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchcancel(control):", x, y);
	
	clearInterval(touch.control.id);
	touch.control.x0 = touch.control.y0 = touch.control.x = touch.control.y = touch.control.t0 = touch.control.id = null;
	
	return false;
});



/**
* Touch Jump
*/
$("#jump").on("touchstart", function(){
	if (stop)
		return;
	
	console.log("try jump");
	
	if ( map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-2,
			deskgood.pos.z/100)
	){ //脚下有方块
		if (time.getTime()-last_jump >= 1000*rnd_error()){
			deskgood.v.y += deskgood.ideal_v.jump * rnd_error();
			last_jump = +time.getTime();
		}
	}
	
	return false;
});



/**
* Touch Screen
*/
touch.screen = {
	operation: false, //是否操作（挖掘/放置）
	x0: null,
	y0: null, //开始位置
	x: null,
	y: null, //当前位置
	id: null
};

//start
$("#game").on("touchstart", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	
	//console.log("touchstart(screen):", {x, y}, touch.screen);
	
	touch.screen.x = touch.screen.x0 = x,
	touch.screen.y = touch.screen.y0 = y;
	touch.screen.operation = true;
	touch.screen.id = setTimeout(()=>{ //长按1000ms（挖掘）
		touch.screen.id = null; //非短按
		if (touch.screen.operation)
			Events.startDig(); //开始挖掘
	}, 1000);
	
	return false;
});

//move
$("#game").on("touchmove", function (e){
	if (stop)
		return false;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	//console.log("touchmove(start):", {x, y}, touch.screen);
	
	const dx = x - touch.screen.x,
		dy = y - touch.screen.y;
	
	touch.screen.x = x, touch.screen.y = y;
	
	//console.log("moved(screen):", dx, dy);
	deskgood.look.y += dx/$("#game")[0].offsetWidth*90*deskgood.sensitivity;
	deskgood.look.x -= dy/$("#game")[0].offsetHeight*90*deskgood.sensitivity;
	
	deskgood.look.x = Math.limitRange(deskgood.look.x, -89.9, 89.9);
	deskgood.look.y = Math.modRange(deskgood.look.y, 0, 360); //限制范围
	//deskgood.look_update(); //刷新俯仰角
	
	if ( (touch.screen.x0 - x) **2+
		(touch.screen.y0 - y) **2
		>= 36*36 //误差36px
	) touch.screen.operation = false; //停止操作
	
	return false;
});

//end
$("#game").on("touchend", function (e){
	if (stop)
		return false;
	
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchend(screen):", {x, y}, touch.screen);
	
	if (touch.screen.id !== null){ //短按（放置）
		clearTimeout(touch.screen.id); //防止长按
		touch.screen.id = null;
		
		if (touch.screen.operation)
			Events.startPlace(); //开始放置
		
	}else{ //长按抬起
		Events.endDig();
	}
	
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = touch.screen.operation = null;
});

//cancel
$("#game").on("touchcancel", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchcancel(screen):", {x, y}, touch.screen);
	
	clearTimeout(touch.screen.id);
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = touch.screen.operation = touch.screen.id = null;
});