const touch = {};



/**
* Touch Control
*/
touch.control = {
	x0: null,
	y0: null, //开始时位置
	x: null,
	y: null,
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
	
	touch.control.id = setInterval(function(){
		if ( touch.control.x0 !== null &&
			touch.control.y0 !== null &&
			touch.control.x !== null &&
			touch.control.y !== null
		){
			const t = time.getTime() - touch.control.t0; //游戏时间
			touch.control.t0 = +time.getTime();
			
			const d = new THREE.Vector2(touch.control.x - touch.control.x0,
					touch.control.y - touch.control.y0), //与开始时的变化
				len = d.length(); //长度
			
			if (len > 100){ //>100px 疾跑
				d.setLength(200 * t / 866);
			}else{
				d.setLength(len * t / 866);
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
		if (Number(time.getTime())-last_jump >= 1000){
			deskgood.v.y += deskgood.jump_v*rnd_error();
			last_jump = Number(time.getTime());
		}
	}
	
	return false;
});



/**
* Touch Screen
*/
touch.screen = {
	t: null,
	x: null,
	y: null,
	x0: null,
	y0: null,
	loop: null
};
$("#game").on("touchstart", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	
	//console.log("touchstart(screen):", {x, y}, touch.screen);
	
	//[x0,y0] = [x, y];
	touch.screen.x = touch.screen.x0 = x,
	touch.screen.y = touch.screen.y0 = y;
	touch.screen.loop = setTimeout(()=>{ //长按1000ms（删除）
		touch.screen.loop = null;
		if ( (touch.screen.x0 - touch.screen.x) **2+
			(touch.screen.y0 - touch.screen.y) **2
			< 36*36 //误差36px
		) Events.startDig(); //开始挖掘
	}, 1000);
	
	return false;
});
$("#game").on("touchmove", function (e){
	if (stop)
		return false;
	
	/*if (touch.screen.pos.x === null || touch.screen.pos.y === null)
		return false;*/
	
	const x = e.originalEvent.targetTouches[0].pageX,
		y = e.originalEvent.targetTouches[0].pageY;
	
	//console.log("touchmove(start):", {x, y}, touch.screen);
	
	const dx = x - touch.screen.x,
		dy = y - touch.screen.y;
	
	touch.screen.x = x, touch.screen.y = y;
	//[x0, y0] = [x, y];
	
	//console.log("moved(screen):", dx, dy);
	deskgood.look.y += dx/$("#game")[0].offsetWidth*90*deskgood.sensitivity;
	deskgood.look.x -= dy/$("#game")[0].offsetHeight*90*deskgood.sensitivity;
	
	deskgood.look.x = THREE.Math.clamp(deskgood.look.x, -89.9, 89.9);
	/*if (deskgood.look.x > 89.9)
		deskgood.look.x = 89.9;
	if (deskgood.look.x < -89.9)
		deskgood.look.x = -89.9;*/
	
	if (deskgood.look.y > 360)
		deskgood.look.y %= 360;
	if (deskgood.look.y < 0)
		deskgood.look.y = deskgood.look.y%360 + 360;
	
	//deskgood.look_update(); //刷新俯仰角
	
	if (Math.sqrt( dx**2 + dy**2 ) >= 16){ //误差16px
		touch.screen.x0 = -666;
		touch.screen.y0 = -666;
	}
	
	return false;
});
$("#game").on("touchend", function (e){
	if (stop)
		return false;
	
	const x = e.originalEvent.changedTouches[0].pageX,
		y = e.originalEvent.changedTouches[0].pageY;
	
	//console.log("touchend(screen):", {x, y}, touch.screen);
	
	if (touch.screen.loop !== null){ //短按（放置）
		clearTimeout(touch.screen.loop);
		touch.screen.loop = null;
		if ( (touch.screen.x0 - touch.screen.x) **2+
			(touch.screen.y0 - touch.screen.y) **2
			< 36*36 //误差36px
		) Events.startPlace(); //开始放置
	}
	
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = null;
});
$("#game").on("touchcancel", function (e){
	if (stop)
		return;
	
	let x = e.originalEvent.changedTouches[0].pageX,
		y = e.originalEvent.changedTouches[0].pageY;
	
	//console.log("touchcancel(screen):", {x, y}, touch.screen);
	
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = null;
	clearTimeout(touch.screen.loop);
});