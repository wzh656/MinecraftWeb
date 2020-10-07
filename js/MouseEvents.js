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
let deskgood_choice_folder = deskgood_folder.addFolder("选择物体");
	deskgood_choice_folder.add(mouse_choice, "view").name("选择模式").listen();
	deskgood_choice_folder.add(mouse_choice, "x", -1000, 1000, 100).listen();
	deskgood_choice_folder.add(mouse_choice, "y", -1000, 1000, 100).listen();
	deskgood_choice_folder.add(mouse_choice, "z", -1000, 1000, 100).listen();
	deskgood_choice_folder.add(mouse_choice, "faceIndex", 0, 12, 1).listen();
	deskgood_choice_folder.add(mouse_choice, "id", 0, 9, 1).listen();

$(document).on("click", function (e){
	console.log( ray3D({},deskgood.look)[0] );
});
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
	
	// console.warn(x, y, e, stop);
	
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
	
	deskgood.look_refresh(); //刷新
	
	for (let i in mouse_choice.obj){
		mouse_choice.obj[i].material.dispose();
		mouse_choice.obj[i].geometry.dispose(); //清除内存
		scene.remove(mouse_choice.obj[i]); //删除
		// mouse_choice.obj.splice(i,1); //已经删除！
	}
	
	try{
		let get = ray({},deskgood.look)[0];
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
			let geometry1 = new THREE.BoxGeometry(100, 100, 100);
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
			/* let geometry2 = new THREE.BoxGeometry(map.size.x*100, map.size.y*100, map.size.z*100);
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
	if (stop)
		return;
	//Chorme
	let wheel = event.originalEvent.wheelDelta;
	let detal = event.originalEvent.detail;
	let up = function(){
		deskgood.choice--;
		if (deskgood.choice < 0)
			deskgood.choice = 3;
	};
	let down = function(){
		deskgood.choice++;
		if (deskgood.choice > 3)
			deskgood.choice = 0;
	};
	if (event.originalEvent.wheelDelta){ //判断浏览器IE,谷歌滚轮事件
		if (wheel > 0) { //当滑轮向上滚动时
			console.log("上滚轮");
			if (keydown.key.has(16)){ //shift
				TimeSpeed *= 1.5;
			}else{
				up();
				deskgood.hold_choice_refresh();
			}
		}  
		if (wheel < 0) { //当滑轮向下滚动时
			console.log("下滚轮");
			if (keydown.key.has(16)){ //shift
				TimeSpeed /= 1.5;
			}else{
				down();
				deskgood.hold_choice_refresh();
			}
		}  
	}else if (event.originalEvent.detail){ //Firefox滚轮事件
		if (detal > 0) { //当滑轮向下滚动时
			console.log("下滚轮");
			if (keydown.key.has(16)){ //shift
				TimeSpeed /= 1.5;
			}else{
				down();
				deskgood.hold_choice_refresh();
			}
		}
		if (detal < 0) { //当滑轮向上滚动时
			console.log("上滚轮");
			if (keydown.key.has(16)){ //shift
				TimeSpeed *= 1.5;
			}else{
				up();
				deskgood.hold_choice_refresh();
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
					let {x, y, z} = click[i].object.position; // 单位 px=cm
					[x, y, z] = [x, y, z].map(v => v/100); // 单位 m
					if (Math.sqrt(
						(x - deskgood.pos.x) **2+
						(y - deskgood.pos.y) **2+
						(z - deskgood.pos.z) **2
					) < 500){ //距离小于500
						if (
							map.get(x, y, z).get("attr", "block", "onLeftMouseDown") &&
							eval(map.get(x, y, z).get("attr", "block", "onLeftMouseDown")) === false
						) return;
						/*let free = -1;
						if (deskgood.hold[deskgood.choice] == 0){
							free = deskgood.choice;
						}else{
							for (let j in deskgood.hold){
								if (deskgood.hold[j] == 0){
									free = j;
									break;
								}
							}
						}*/
						let free = !deskgood.hold[deskgood.choice]? deskgood.choice: deskgood.hold.indexOf(null);
						if (free == -1){
							console.info("not free!");
							message("<font style='font-size:14px;'>两只手拿4m³方块已经够多了，反正我是拿不下了</font>", 3);
						}else{
							console.log("delete", click[i].object.position, map.get(x, y, z).id)
							
							deskgood.hold[free] = new Thing(map.get(x, y, z)); //放在手中
							deskgood.hold_things_refresh(); //刷新方块
							let attr = `'${JSON.stringify(map.get(x, y, z).attr).slice(1,-1)}'`;
							map.delete(x, y, z); //删除方块
							map.updateRound(x, y, z); //刷新方块及周围
							
							[x, y, z] = [x, y, z].map(Math.round); //存储必须整数
							//SQL
							sql.deleteData("file", `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
								sql.insertData("file", ["type", "x", "y", "z", "id", "attr"], [
									0,
									x,
									y,
									z,
									0,
									attr
								])
							});
							/*scene.remove(click[i].object);
							every[ click[i].object.position.x/100 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] = 0;*/
							/* if (
								every[ click[i].object.position.x/100+1 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] 
							) */
						}
						break;
					}
				}
			}
		}
	}else if (e.button == 2){ //右键（放置）
		let click = ray2D();
		for (let i in click){
			if (click[i].object instanceof THREE.Mesh){
				let {x, y, z} = click[i].object.position; // 单位px=cm
				[x, y, z] = [x, y, z].map(v => v/100); //单位 m
				/* if (
					Math.sqrt(
						(x - deskgood.pos.x) **2+
						(y - deskgood.pos.y) **2+
						(z - deskgood.pos.z) **2
				) < 500){ //距离<500
					if (map.get(x/100, y/100, z/100) &&
						map.get(x/100, y/100, z/100).id == 1
					){ //命令方块
						state("command");
						return;
					}
				} */
				if (
					map.get(x, y, z).get("attr", "block", "onRightMouseDown") &&
					eval(map.get(x, y, z).get("attr", "block", "onRightMouseDown")) === false
				) return;
				if (!deskgood.hold[deskgood.choice]) //空气
					return;
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
						return console.error("faceIndex wrong:", click[i].faceIndex);
				}
				if (Math.sqrt(
					(x*100 - deskgood.pos.x) **2+
					(y*100 - deskgood.pos.y) **2+
					(z*100 - deskgood.pos.z) **2
				) < 500){ //距离<5m
					console.log("put", {x,y,z}, deskgood.hold[deskgood.choice].id, deskgood.hold[deskgood.choice].attr)
					map.addID(deskgood.hold[deskgood.choice].id, {
						x,
						y,
						z
					}, TEMPLATES, {
						attr: deskgood.hold[deskgood.choice].attr
					});
					map.updateRound(x, y, z); //刷新方块及周围
					
					[x, y, z] = [x, y, z].map(Math.round); //存储必须整数
					//SQL
					let thing = deskgood.hold[deskgood.choice];
					sql.deleteData("file", `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
						sql.insertData("file", ["type", "x", "y", "z", "id"], [
							0,
							x,
							y,
							z,
							thing.id //,
							// `'${JSON.stringify(thing.attr).slice(1,-1)}'` //删除方块无需attr
						])
					});
					deskgood.hold[deskgood.choice] = 0; //删除手里的方块
					deskgood.hold_things_refresh(); //刷新方块
					break; //跳出 寻找有效放置的 循环
				}
				/*if (click[i].faceIndex == 0 | click[i].faceIndex == 1){
					x += 100;
					if (Math.sqrt(
						Math.pow((click[i].object.position.x+100) - deskgood.pos.x, 2)+
						Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
						Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let thing = new Thing(TEMPLATES[ deskgood.hold[deskgood.choice] ]);
						thing.block.makeMesh();
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice] ].material);
						mesh.position.x = click[i].object.position.x+100;
						mesh.position.y = click[i].object.position.y;
						mesh.position.z = click[i].object.position.z;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100+1 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}else if (click[i].faceIndex == 2 | click[i].faceIndex == 3){
					x -= 100;
					if (Math.sqrt(
						Math.pow((click[i].object.position.x-100) - deskgood.pos.x, 2)+
						Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
						Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice]].material);
						mesh.position.x = click[i].object.position.x-100;
						mesh.position.y = click[i].object.position.y;
						mesh.position.z = click[i].object.position.z;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100-1 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}else if (click[i].faceIndex == 4 | click[i].faceIndex == 5){
					if (Math.sqrt(
						Math.pow(click[i].object.position.x - deskgood.pos.x, 2)+
					 	Math.pow((click[i].object.position.y+100) - deskgood.pos.y, 2)+
						Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice]].material);
						mesh.position.x = click[i].object.position.x;
						mesh.position.y = click[i].object.position.y+100;
						mesh.position.z = click[i].object.position.z;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100 ][ click[i].object.position.y/100+1 ][ click[i].object.position.z/100 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}else if (click[i].faceIndex == 6 | click[i].faceIndex == 7){
					if (Math.sqrt(
						Math.pow(click[i].object.position.x - deskgood.pos.x, 2)+
						Math.pow((click[i].object.position.y-100) - deskgood.pos.y, 2)+
						Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice]].material);
						mesh.position.x = click[i].object.position.x;
						mesh.position.y = click[i].object.position.y-100;
						mesh.position.z = click[i].object.position.z;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100 ][ click[i].object.position.y/100-1 ][ click[i].object.position.z/100 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}else if (click[i].faceIndex == 8 | click[i].faceIndex == 9){
					if (Math.sqrt(
						Math.pow(click[i].object.position.x - deskgood.pos.x, 2)+
						Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
						Math.pow((click[i].object.position.z+100) - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice]].material);
						mesh.position.x = click[i].object.position.x;
						mesh.position.y = click[i].object.position.y;
						mesh.position.z = click[i].object.position.z+100;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100+1 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}else if (click[i].faceIndex == 10 | click[i].faceIndex == 11){
					if (Math.sqrt(
						Math.pow(click[i].object.position.x - deskgood.pos.x, 2)+
						Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
						Math.pow((click[i].object.position.z-100) - deskgood.pos.z, 2)
					) < 500){ //距离<500
						let mesh = new THREE.Mesh(block_geometry, TEMPLATES[ deskgood.hold[deskgood.choice]].material);
						mesh.position.x = click[i].object.position.x;
						mesh.position.y = click[i].object.position.y;
						mesh.position.z = click[i].object.position.z-100;
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						
						scene.add(mesh); //网格模型添加到场景中
						every[ click[i].object.position.x/100 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100-1 ] = deskgood.hold[deskgood.choice];
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break;
					}
				}*/
			}
		}
	}
	return false;
});