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
	id: -1
};
if (ALLOW_GUI){
	let deskgood_choice_folder = gui.__folders["玩家/观察者(deskgood)"].addFolder("选择物体");
		deskgood_choice_folder.add(mouse_choice, "view").name("选择模式").listen();
		deskgood_choice_folder.add(mouse_choice, "x", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "y", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "z", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "faceIndex", 0, 12, 1).listen();
		deskgood_choice_folder.add(mouse_choice, "id", 0, 9, 1).listen();
}

/* $(document).on("click", function (e){
	console.log( ray3D({},deskgood.look)[0] );
}); */
document.addEventListener("mousemove", function (e){
	if (stop)
		return;
	
	if (e.path[0] != document.body)
		return;
	
	let dx =
		e.movementX ||
		e.mozMovementX ||
		e.webkitMovementX ||
		0
	;
	let dy =
		e.movementY ||
		e.mozMovementY ||
		e.webkitMovementY ||
		0
	;
	
	let [x,y] = [dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity, dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity];
	
	if (x**2 + y**2 > 200) return; //消除取消锁定前自动移动
	
	deskgood.lookAt.left_right += dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity;
	deskgood.lookAt.top_bottom -= dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity;
	
	if (deskgood.lookAt.left_right > 360)
		while (deskgood.lookAt.left_right > 360)
			deskgood.lookAt.left_right -= 360;
	if (deskgood.lookAt.left_right < 0)
		while (deskgood.lookAt.left_right < 0)
			deskgood.lookAt.left_right += 360;
	
	if (deskgood.lookAt.top_bottom > 89.9)
		deskgood.lookAt.top_bottom = 89.9;
	if (deskgood.lookAt.top_bottom < -89.9)
		deskgood.lookAt.top_bottom = -89.9;
	
	deskgood.look_update(); //刷新
	
	for (let i in mouse_choice.obj){
		mouse_choice.obj[i].material.dispose();
		mouse_choice.obj[i].geometry.dispose(); //清除内存
		scene.remove(mouse_choice.obj[i]); //删除
		// mouse_choice.obj.splice(i,1); //已经删除！
	}
	
	try{
		let get = ray3D({},deskgood.look)[0];
		mouse_choice.x = get.object.position.x;
		mouse_choice.y = get.object.position.y;
		mouse_choice.z = get.object.position.z;
		mouse_choice.faceIndex = get.faceIndex;
		mouse_choice.id = map.get(
			get.object.position.x/100,
			get.object.position.y/100,
			get.object.position.z/100
		).id;
		
		if (mouse_choice.view){
			let geometry1 = new THREE.BoxBufferGeometry(100, 100, 100);
			let material1 = new THREE.MeshBasicMaterial({
				color: "blue",
				transparent: true,
				opacity: 0.3
			});
			let material2 = new THREE.MeshBasicMaterial({
				color: "red",
				wireframe: true //只显示框架
			});
			let mesh1 = new THREE.Mesh(geometry1, material1);
			let mesh2 = new THREE.Mesh(geometry1, material2);
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
			id: -1
		};
	}
});

$(document).on("mousewheel DOMMouseScroll", function(event){ //on也可以 bind监听
	if (stop && stop != "bag")
		return;
	//Chorme
	let wheel = event.originalEvent.wheelDelta || event.originalEvent.detail; //判断浏览器IE,谷歌滚轮事件 Firefox滚轮事件
	if (wheel){
		if (wheel > 0) { //当滑轮向上滚动时
			console.log("上滚轮");
			if ( keydown.key.has(16) ){ //shift
				
				time.setSpeed(time.speed*1.5); //时间流逝加速
				console.log("time speed:", `${time.speed}s/s\n=${time.speed/60}min/s\n=${time.speed/3600}h/s\n=${time.speed/3600/24}day/s\n=${time.speed/3600/24/365.25}year/s`)
				
			}else{
				
				let before = deskgood.choice; //之前的选择
				if (
					deskgood.hold[before] && //切换前事件
					eval(deskgood.hold[before].get("attr", "block", "onChangeLeave")) === false //取消事件
				) return;
				
				deskgood.choice--;
				if (deskgood.choice < 0)
					deskgood.choice = 3;
				
				if (
					deskgood.hold[deskgood.choice] && //切换后事件
					eval(deskgood.hold[deskgood.choice].get("attr", "onChangeTo")) === false //取消事件
				) return (deskgood.choice = before); //恢复之前选择
				
				deskgood.hold.update(); //更新选择
			}
		}  
		if (wheel < 0) { //当滑轮向下滚动时
			console.log("下滚轮");
			if ( keydown.key.has(16) ){ //shift
			
				time.setSpeed(time.speed/1.5); //时间流逝减慢
				console.log("time speed:", `${time.speed}s/s\n=${time.speed/60}min/s\n=${time.speed/3600}h/s\n=${time.speed/3600/24}day/s\n=${time.speed/3600/24/365.25}year/s`)
				
			}else{
				
				let before = deskgood.choice;
				if (
					deskgood.hold[before] && //切换前事件
					eval(deskgood.hold[before].get("attr", "onChangeLeave")) === false //取消事件
				) return;
				
				deskgood.choice++;
				if (deskgood.choice > 3)
					deskgood.choice = 0;
				
				if (
					deskgood.hold[deskgood.choice] && //切换后事件
					eval(deskgood.hold[deskgood.choice].get("attr", "onChangeTo")) === false //取消事件
				) return (deskgood.choice = before); //恢复之前选择
				
				deskgood.hold.update(); //更新选择
			}
		}  
	}  
});

document.addEventListener("mousedown", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	if (e.button == 0){ //左键（删除）
		let click = ray2D();
		for (let i in click){
			if (click[i].faceIndex){
				if (click[i].object instanceof THREE.Mesh){
					deskgood.delete(click[i].object.position, click[i].faceIndex);
					break;//跳出 寻找有效放置的 循环
				}
			}
		}
	}else if (e.button == 2){ //右键（放置）
		let click = ray2D();
		for (let i in click){
			if (click[i].object instanceof THREE.Mesh){
				deskgood.put(click[i].object.position, click[i].faceIndex);
				break;//跳出 寻找有效放置的 循环
			}
		}
	}
	return false;
});