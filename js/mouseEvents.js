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
if (DEBUG){
	let deskgood_choice_folder = gui.__folders["玩家/观察者(deskgood)"].addFolder("选择物体");
		deskgood_choice_folder.add(mouse_choice, "view").name("选择模式").listen();
		deskgood_choice_folder.add(mouse_choice, "x", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "y", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "z", -1000, 1000, 100).listen();
		deskgood_choice_folder.add(mouse_choice, "faceIndex", 0, 12, 1).listen();
		deskgood_choice_folder.add(mouse_choice, "id", 0, 9, 1).listen();
}

/* $(document).on("click", function (e){
	console.log( ray3D({},deskgood.lookAt)[0] );
}); */
document.addEventListener("mousemove", function (e){
	if (stop)
		return;
	
	if (e.path[0] != document.body)
		return;
	
	const dx =
		e.movementX ||
		e.mozMovementX ||
		e.webkitMovementX ||
		0,
		dy =
		e.movementY ||
		e.mozMovementY ||
		e.webkitMovementY ||
		0;
	
	const x = dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity,
		y = dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity;
	
	if (Math.sqrt(x**2 + y**2) > 15) return; //消除取消锁定前自动移动
	
	deskgood.look.left_right += dx/$("#game")[0].offsetWidth*360*deskgood.sensitivity;
	deskgood.look.top_bottom -= dy/$("#game")[0].offsetHeight*360*deskgood.sensitivity;
	
	if (deskgood.look.left_right > 360)
		while (deskgood.look.left_right > 360)
			deskgood.look.left_right -= 360;
	if (deskgood.look.left_right < 0)
		while (deskgood.look.left_right < 0)
			deskgood.look.left_right += 360;
	
	if (deskgood.look.top_bottom > 89.9)
		deskgood.look.top_bottom = 89.9;
	if (deskgood.look.top_bottom < -89.9)
		deskgood.look.top_bottom = -89.9;
	
	deskgood.look_update(); //刷新
	
	for (let i in mouse_choice.obj){
		mouse_choice.obj[i].material.dispose();
		mouse_choice.obj[i].geometry.dispose(); //清除内存
		scene.remove(mouse_choice.obj[i]); //删除
		// mouse_choice.obj.splice(i,1); //已经删除！
	}
	
	try{
		const get = ray3D({},deskgood.lookAt)[0];
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
			id: -1
		};
	}
});


//滚轮
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


//mousedown
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
					let {x,y,z} = click[i].object.position; //单位 px=cm
					
					x = x/100, y = y/100, z = z/100; //单位 m
					
					if (
						map.get(x, y, z) &&
						eval(map.get(x, y, z).get("attr", "block", "onLeftMouseDown")) === false
					) return;
					
					if (Math.sqrt(
						(x*100 - deskgood.pos.x) **2+
						(y*100 - deskgood.pos.y) **2+
						(z*100 - deskgood.pos.z) **2
					) >= deskgood.handLength) return; //距离>=手长
					
					let free = !deskgood.hold[deskgood.choice]? deskgood.choice: deskgood.hold.indexOf(null);
					if (free == -1){
						console.warn("not free!")
						return print("拿不下方块", "两只手拿4m³方块已经够多了，反正我是拿不下了", 3);
					}
					deskgood.hold.addOne(new Block(map.get(x, y, z)), free); //放在手中
					
					deskgood.remove( {x,y,z} ); //删除方块
					
					break;//跳出 寻找有效放置的 循环
				}
			}
		}
	}else if (e.button == 2){ //右键（放置）
		let click = ray2D();
		for (let i in click){
			if (click[i].object instanceof THREE.Mesh){
				let {x,y,z} = click[i].object.position; //单位 px=cm
				
				x = x/100, y = y/100, z = z/100; //单位 m
				if (
					map.get(x, y, z) &&
					eval(map.get(x, y, z).get("attr", "block", "onRightMouseDown")) === false
				) return;
				
				switch (click[i].faceIndex){
					case 0:
					case 1:
						x++;
						break;
					case 2:
					case 3:
						x--;
						break;
					case 4:
					case 5:
						y++;
						break;
					case 6:
					case 7:
						y--;
						break;
					case 8:
					case 9:
						z++;
						break;
					case 10:
					case 11:
						z--;
						break;
					default:
						throw ["faceIndex wrong:", click[i].faceIndex];
				}
				
				if (Math.sqrt(
					(x*100 - deskgood.pos.x) **2+
					(y*100 - deskgood.pos.y) **2+
					(z*100 - deskgood.pos.z) **2
				) >= deskgood.handLength) return; //距离>=手长
				
				if (!deskgood.hold[deskgood.choice]) //空气
					return;
				
				if ( Math.round(x) == Math.round(deskgood.pos.x/100) &&
					Math.round(y) == Math.round(deskgood.pos.y/100) &&
					Math.round(z) == Math.round(deskgood.pos.z/100)
				) return print("往头上放方块", "想窒息吗？还往头上放方块！"); //放到头上
				
				deskgood.place(deskgood.hold[deskgood.choice], {x,y,z}); //放置方块
				
				deskgood.hold.delete(1, deskgood.choice); //删除手里的方块
				
				break; //跳出 寻找有效放置的 循环
			}
		}
	}
	return false;
});

// mouseup(事件专用)
document.addEventListener("mousedown", function (e){
	if (stop)
		return;
	
	if (e.path[0] !== document.body)
		return;
	
	if (e.button == 0){ //左键(onLeftMouseUp)
		let click = ray2D();
		for (let i in click){
			if (click[i].faceIndex){
				if (click[i].object instanceof THREE.Mesh){
					let {x,y,z} = click[i].object.position; //单位 px=cm
					
					x = x/100, y = y/100, z = z/100; //单位 m
					
					if (
						map.get(x, y, z) &&
						eval(map.get(x, y, z).get("attr", "block", "onLeftMouseUp")) === false
					) return;
					
					break;//跳出 寻找有效放置的 循环
				}
			}
		}
	}else if (e.button == 2){ //右键(onRightMouseDown)
		let click = ray2D();
		for (let i in click){
			if (click[i].object instanceof THREE.Mesh){
				let {x,y,z} = click[i].object.position; //单位 px=cm
				
				x = x/100, y = y/100, z = z/100; //单位 m
				
				switch (click[i].faceIndex){
					case 0:
					case 1:
						x++;
						break;
					case 2:
					case 3:
						x--;
						break;
					case 4:
					case 5:
						y++;
						break;
					case 6:
					case 7:
						y--;
						break;
					case 8:
					case 9:
						z++;
						break;
					case 10:
					case 11:
						z--;
						break;
					default:
						throw ["faceIndex wrong:", click[i].faceIndex];
				}
				
				if (
					map.get(x, y, z) &&
					eval(map.get(x, y, z).get("attr", "block", "onRightMouseDown")) === false
				) return;
				
				break; //跳出 寻找有效放置的 循环
			}
		}
	}
	return false;
});