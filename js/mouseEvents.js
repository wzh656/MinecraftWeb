/*
* mouse
*/
let mouse_choice = {
	view: false,
	obj: [],
	x: -1,
	y: -1,
	z: -1,
	faceIndex: -1,
	name: -1
};
if (DEBUG){
	const deskgood_choice_folder = gui.__folders["玩家/观察者(deskgood)"].addFolder("选择物体");
		deskgood_choice_folder.add(mouse_choice, "view").name("选择模式").listen();
		deskgood_choice_folder.add(mouse_choice, "x", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "y", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "z", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "faceIndex", 0, 12, 1).listen();
		deskgood_choice_folder.add(mouse_choice, "name", 0, 9, 1).listen();
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
	
	const x = dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity,
		y = dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity;
	
	if (Math.sqrt(x**2 + y**2) > 15) return; //消除取消锁定前自动移动
	
	deskgood.look.y += dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity,
	deskgood.look.x -= dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity;
	
	deskgood.look.x = THREE.Math.clamp(deskgood.look.x, -89.9, 89.9);
	/*if (deskgood.look.x > 89.9)
		deskgood.look.x = 89.9;
	if (deskgood.look.x < -89.9)
		deskgood.look.x = -89.9;*/
	
	if (deskgood.look.y > 360)
		deskgood.look.y %= 360;
	if (deskgood.look.y < 0)
		deskgood.look.y = deskgood.look.y%360 + 360;
	
	//deskgood.look_update(); //刷新
	
	for (const i in mouse_choice.obj){
		mouse_choice.obj[i].material.dispose();
		mouse_choice.obj[i].geometry.dispose(); //清除内存
		scene.remove(mouse_choice.obj[i]); //删除
		// mouse_choice.obj.splice(i,1); //已经删除！
	}
	
	try{
		const get = ray2D()[0];
		mouse_choice.x = get.object.position.x;
		mouse_choice.y = get.object.position.y;
		mouse_choice.z = get.object.position.z;
		mouse_choice.faceIndex = get.faceIndex;
		mouse_choice.name = map.get(
			get.object.position.x/100,
			get.object.position.y/100,
			get.object.position.z/100
		).name;
		
		if (mouse_choice.view){
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
			mouse_choice.obj.push(mesh1);
			mouse_choice.obj.push(mesh2);
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
			mouse_choice.obj.push(mesh3); */
		}
	}catch(err){
		// console.error(err)
		mouse_choice = {
			view: mouse_choice.view,
			obj: [],
			x: -1,
			y: -1,
			z: -1,
			faceIndex: -1,
			name: -1
		};
	}
});


//滚轮
$(document).on("mousewheel DOMMouseScroll", function(event){ //on也可以 bind监听
	if (stop && stop != "bag")
		return;
	
	const wheel = event.originalEvent.wheelDelta || event.originalEvent.detail; //判断浏览器IE,谷歌滚轮事件 Firefox滚轮事件
	if (wheel){
		if (wheel > 0){
			Events.mouseWheelScrollUp(); //上滚轮
		}else if (wheel < 0){
			Events.mouseWheelScrollDown(); //下滚轮
		}  
	}  
});


/* mousedown */
document.addEventListener("mousedown", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	if (e.button == 0){ //左键（挖掘）
		Events.startDig(); //开始挖掘
	}else if (e.button == 2){ //右键（放置）
		Events.startPlace(); //开始放置
	}
	return false;
});


/* mouseup */
document.addEventListener("mousedown", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	if (e.button == 0){ //左键（挖掘）
		Events.endDig(); //结束挖掘
	}else if (e.button == 2){ //右键（放置）
		Events.endPlace(); //结束挖掘
	}
	return false;
});