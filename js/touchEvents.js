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
$("#control > .move").on("touchstart", function(e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	// console.log("touchstart(control):", x, y);
	
	touch.control.x0 = x,
	touch.control.y0 = y,
	touch.control.t0 = +time.getTime();
	
	//循环
	touch.control.id = setInterval(function(){
		if ( touch.control.x0 === null ||
			touch.control.y0 === null ||
			touch.control.x === null ||
			touch.control.y === null
		) return;
		
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
	}, 16);
	
	$("#control > .move")
		.css("left", x+"px")
		.css("top", y+"px")
		.css("transform", "translate(-50%, -50%)");
	$("#control > .move > .direction").hide();
	$("#control > .position").show()
		.css("left", x+"px")
		.css("top", y+"px");
	
	return;
});

//move
$("#control > .move").on("touchmove", function(e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	//console.log("touchmove(control):", x, y);
	
	touch.control.x = x,
	touch.control.y = y;
	
	const d = new THREE.Vector2(x - touch.control.x0, y - touch.control.y0),
		rotation = Math.atan(d.y / d.x) + (d.x<0? Math.PI: 0);
	if (d.length() > 8/2*VMAX)
		d.setLength(8/2*VMAX);
	$("#control > .move > .direction").show()
		.css("transform", "rotate("+rotation+"rad)");
	$("#control > .position").show()
		.css("left", touch.control.x0 + d.x + "px")
		.css("top", touch.control.y0 + d.y + "px");
	
	return;
});

//end
$("#control > .move").on("touchend", function(e){
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchend(control):", x, y);
	
	clearInterval(touch.control.id);
	touch.control.x0 = touch.control.y0 = touch.control.x = touch.control.y = touch.control.t0 = touch.control.id = null;
	
	$("#control > .move")
		.css("left", "")
		.css("top", "")
		.css("transform", "");
	$("#control > .move > .direction").hide();
	$("#control > .position").hide();
	
	return;
});

//cancel
$("#control > .move").on("touchcancel", function(e){
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchcancel(control):", x, y);
	
	clearInterval(touch.control.id);
	touch.control.x0 = touch.control.y0 = touch.control.x = touch.control.y = touch.control.t0 = touch.control.id = null;
	
	$("#control > .move > .direction").hide();
	$("#control > .position").hide();
	
	return;
});



/**
* Touch Jump
*/
//start
$("#control > .jump").on("touchstart", function(){
	if (stop)
		return;
	
	console.log("try jump");
	
	$("#control > .jump").addClass("active");
	
	if ( map.get(deskgood.pos.x/100,
			(deskgood.pos.y - deskgood.collisionBox["y-"] - 50)/100, //到方块中心
			deskgood.pos.z/100) && //脚下有方块
		time.getTime()-last_jump >= 1000*rnd_error() //达到休息时间
	){
		deskgood.v.y += deskgood.ideal_v.jump * rnd_error();
		last_jump = +time.getTime();
	}
	
	return;
});
//end
$("#control > .jump").on("touchend", function(){
	if (stop)
		return;
	
	$("#control > .jump").removeClass("active");
	
	return;
});



/**
* Touch Screen
*/
touch.screen = {
	x0: null,
	y0: null, //开始位置
	x: null,
	y: null, //当前位置
	id: null,
	valid: null //操作是否有效（挖掘/放置）
};

//start
$("#game").on("touchstart", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	
	//console.log("touchstart(screen):", {x, y}, touch.screen);
	
	//处理事件
	const obj = ray2D(x, y).filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	if (Events.onTouchStart && Events.onTouchStart() === false)
		return;
	if (thing &&
		eval(thing.get("attr", "block", "onTouchStart")) === false
	) return;
	
	touch.screen.x = touch.screen.x0 = x,
	touch.screen.y = touch.screen.y0 = y;
	touch.screen.valid = true;
	touch.screen.id = setTimeout(()=>{ //长按1000ms（挖掘）
		touch.screen.id = null;
		if (touch.screen.valid)
			Events.startDig(x ,y); //开始挖掘
	}, 1000);
	
	return;
});

//move
$("#game").on("touchmove", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.targetTouches[0];
	//console.log("touchmove(start):", {x, y}, touch.screen);
	
	const dx = x - touch.screen.x,
		dy = y - touch.screen.y; //与上次变化量
	
	//处理事件
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	if (Events.onTouchMove && Events.onTouchMove() === false)
		return;
	if (thing &&
		eval(thing.get("attr", "block", "onTouchMove")) === false
	) return;
	
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
	) touch.screen.valid = false; //无效操作 仅滑动屏幕
	
	return;
});

//end
$("#game").on("touchend", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchend(screen):", {x, y}, touch.screen);
	
	//处理事件
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	if (Events.onTouchEnd && Events.onTouchEnd() === false)
		return;
	if (thing &&
		eval(thing.get("attr", "block", "onTouchEnd")) === false
	) return;
	
	if (touch.screen.id === null){ //长按抬起
		Events.endDig();
		
	}else{ //短按抬起（放置）
		clearTimeout(touch.screen.id); //防止长按
		
		if (touch.screen.valid)
			if (Events.placing){ //正在放置
				Events.endPlace(); //结束放置
			}else{ //不在放置
				Events.startPlace(); //开始放置
			}
	}
	
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = touch.screen.id = touch.screen.valid = null;
	
	return;
});

//cancel
$("#game").on("touchcancel", function (e){
	if (stop)
		return;
	
	const {pageX: x, pageY: y} = e.originalEvent.changedTouches[0];
	//console.log("touchcancel(screen):", {x, y}, touch.screen);
	
	//处理事件
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	if (Events.onTouchCancel && Events.onTouchCancel() === false)
		return;
	if (thing &&
		eval(thing.get("attr", "block", "onTouchCancel")) === false
	) return;
	
	clearTimeout(touch.screen.id);
	touch.screen.x = touch.screen.y = touch.screen.x0 = touch.screen.y0 = touch.screen.id = touch.screen.valid =null;
	
	return;
});