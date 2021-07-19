/*
* mouse
*/
const mouse = {};
mouse.choice = {
	view: false,
	obj: [],
	x: -1,
	y: -1,
	z: -1,
	faceIndex: -1,
	name: -1,
	event: null
};
if (DEBUG){
	const deskgood_choice_folder = gui.__folders["玩家/观察者(deskgood)"].addFolder("选择物体");
		deskgood_choice_folder.add(mouse.choice, "view").name("选择模式").listen();
		deskgood_choice_folder.add(mouse.choice, "x", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse.choice, "y", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse.choice, "z", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse.choice, "faceIndex", 0, 12, 1).listen();
		deskgood_choice_folder.add(mouse.choice, "name", 0, 9, 1).listen();
}

/* $(document).on("click", function (e){
	console.log( ray3D({},deskgood.lookAt)[0] );
}); */
document.addEventListener("mousemove", function (e){
	if (stop)
		return;
	
	if (e.path[0] != document.body)
		return;
	
	const dx = e.movementX ||
			e.mozMovementX ||
			e.webkitMovementX ||
			0,
		dy = e.movementY ||
			e.mozMovementY ||
			e.webkitMovementY ||
			0;
	
	const x = dx/$("#game")[0].offsetWidth*360 *deskgood.sensitivity,
		y = dy/$("#game")[0].offsetHeight*360 *deskgood.sensitivity;
	
	if (Math.sqrt(x**2 + y**2) > 15) return; //消除取消锁定前自动移动
	
	deskgood.look.y += x,
	deskgood.look.x += -y;
	
	deskgood.look.x = Math.limitRange(deskgood.look.x, -89.9, 89.9);
	deskgood.look.y = Math.modRange(deskgood.look.y, 0, 360);
	
	//deskgood.look_update(); //刷新
	
	for (let i=mouse.choice.obj.length-1; i>=0; i--){
		mouse.choice.obj[i].material.dispose();
		mouse.choice.obj[i].geometry.dispose(); //清除内存
		scene.remove(mouse.choice.obj[i]); //删除
		// mouse.choice.obj.splice(i,1); //已经删除！
	}
	
	if (!DEBUG) return;
	const get = ray2D()[0];
	if (!get) return (mouse.choice = {
			view: mouse.choice.view,
			obj: [],
			x: -1,
			y: -1,
			z: -1,
			faceIndex: -1,
			name: -1,
			event: null
		});
	mouse.choice.x = get.object.position.x;
	mouse.choice.y = get.object.position.y;
	mouse.choice.z = get.object.position.z;
	mouse.choice.faceIndex = get.faceIndex;
	mouse.choice.name = get.object.userData.thingObject.name;
	mouse.choice.event = get;
	
	if (!mouse.choice.view) return;
	const geometry1 = new THREE.BoxBufferGeometry(100, 100, 100),
		material1 = new THREE.MeshBasicMaterial({
			color: "blue",
			transparent: true,
			opacity: 0.3
		}),
		material2 = new THREE.MeshBasicMaterial({
			color: "red",
			wireframe: true //只显示框架
		}),
		mesh1 = new THREE.Mesh(geometry1, material1),
		mesh2 = new THREE.Mesh(geometry1, material2);
	
	mesh1.position.x = mesh2.position.x = get.object.position.x;
	mesh1.position.y = mesh2.position.y = get.object.position.y;
	mesh1.position.z = mesh2.position.z = get.object.position.z;
	scene.add(mesh1);
	scene.add(mesh2);
	mouse.choice.obj.push(mesh1);
	mouse.choice.obj.push(mesh2);
	/* let geometry2 = new THREE.BoxBufferGeometry(map.size.x*100, map.size.y*100, map.size.z*100);
	let mesh3 = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({
		color: "blue",
		transparent: true,
		opacity: 0.1
	}));
	mesh3.position.x = Math.round(get.object.position.x/100/map.size.x)*100;
	mesh3.position.y = map.size.y*100/2;
	mesh3.position.z = Math.round(get.object.position.z/100/map.size.z)*100;
	scene.add(mesh3);
	console.log(mesh3)
	mouse.choice.obj.push(mesh3); */
});


//滚轮
$(document).on("mousewheel DOMMouseScroll", function(event){ //on也可以 bind监听
	if (stop && stop != "bag")
		return;
	
	const wheel = event.originalEvent.wheelDelta || event.originalEvent.detail; //判断浏览器IE,谷歌滚轮事件 Firefox滚轮事件
	
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	
	if (wheel){
		if (wheel > 0){
			
			//处理事件
			if (Events.onMouseWheelScrollUp && Events.onMouseWheelScrollUp() === false)
				return;
			if (thing &&
				eval(thing.get("attr", "onMouseWheelScrollUp")) === false
			) return;
			//上一个
			Events.choicePrev();
			
		}else if (wheel < 0){
			
			//处理事件
			if (Events.onMouseWheelScrollDown && Events.onMouseWheelScrollDown() === false)
				return;
			if (thing &&
				eval(thing.get("attr", "onMouseWheelScrollDown")) === false
			) return;
			//下一个
			Events.choiceNext();
			
		}
	}
	return;
});


/* mousedown */
document.addEventListener("mousedown", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	
	if (e.button == 0){ //左键（挖掘）
		
		//处理事件
		if (Events.onLeftMouseDown && Events.onLeftMouseDown() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onLeftMouseDown")) === false
		) return false;
		//开始挖掘
		Events.startDig();
		
	}else if (e.button == 1){ //中键（重置时间）
		
		//处理事件
		if (Events.onMiddleMouseDown && Events.onMiddleMouseDown() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onMiddleMouseDown")) === false
		) return false;
		//重置时间
		Events.resetTime();
		
	}else if (e.button == 2){ //右键（放置）
		
		//处理事件
		if (Events.onRightMouseDown && Events.onRightMouseDown() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onRightMouseDown")) === false
		) return false;
		//开始放置
		Events.startPlace();
		
	}
	return false;
});


/* mouseup */
document.addEventListener("mouseup", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0], //Mesh物体
		thing = obj && obj.object.userData.thingObject;
	
	if (e.button == 0){ //左键（挖掘）
		
		//处理事件
		if (Events.onLeftMouseUp && Events.onLeftMouseUp() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onLeftMouseUp")) === false
		) return false;
		//结束挖掘
		Events.endDig();
		
	}else if (e.button == 1){ //中键
		
		//处理事件
		if (Events.onMiddleMouseUp && Events.onMiddleMouseUp() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onMiddleMouseUp")) === false
		) return false;
		
	}else if (e.button == 2){ //右键（放置）
		
		//处理事件
		if (Events.onRightMouseUp && Events.onRightMouseUp() === false)
			return false;
		if (thing &&
			eval(thing.get("attr", "onRightMouseUp")) === false
		) return false;
		//结束挖掘
		Events.endPlace();
		
	}
	return false;
});