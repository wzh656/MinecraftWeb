/**
* Touch
*/
let touch_control = {
	x0: null,
	y0: null,
	x: null,
	y: null,
	t0: null,
	loop: null
};
$("#control").on("touchstart", function(e){
	if (stop)
		return;
	
	let x = e.originalEvent.targetTouches[0].clientX,
		y = e.originalEvent.targetTouches[0].clientY;
	console.log("touchstart(control):", x, y);
	
	[touch_control.x0, touch_control.y0, touch_control.t0] = [x, y, +get_date()];
	
	touch_control.loop = setInterval(function(){
		if (touch_control.x0 !== null &
			touch_control.y0 !== null &
			touch_control.x !== null &
			touch_control.y !== null
		){
			let t = +get_date()-touch_control.t0;
			touch_control.t0 = +get_date();
			let dx = touch_control.x-touch_control.x0,
				dy = touch_control.y-touch_control.y0;
			let r = (
				dx>0? Math.atan(dy/dx)+Math.PI/2:
				dx<0? Math.atan(dy/dx)-Math.PI/2:
					dy>0? 0:
					dy<0? 180:
					0
			);
			let l = Math.sqrt(dx**2 + dy**2);
			l = l>100? 0.26*t: l*t/866;
			let x = Math.cos( deskgood.lookAt.left_right/180*Math.PI+r )*l;
			let z = Math.sin( deskgood.lookAt.left_right/180*Math.PI+r )*l;
			
			console.log("touch control to move:", x, z);
			
			deskgood.go(x, 0, z);
			
			/*x += x>0? 10: x<0? -10: 0;
			z += z>0? 10: z<0? -10: 0;
			
			if (x > 0){
				for (var i=deskgood.pos.x; i<=deskgood.pos.x+x; i+=2){
					try{
						if (
							every
								[Math.round(i/100)]
								[Math.round(deskgood.pos.y/100)]
								[Math.round(deskgood.pos.z/100)]
							!=
								0
						) break;
						if (
							every
								[Math.round(i/100)]
								[Math.round(deskgood.pos.y/100)-1]
								[Math.round(deskgood.pos.z/100)]
							!=
								0
						) break;
					}catch(err){}
				}
			}else{
				for (var i=deskgood.pos.x; i>=deskgood.pos.x+x; i-=2){
					try{
						if (
							every
								[Math.round(i/100)]
								[Math.round(deskgood.pos.y/100)]
								[Math.round(deskgood.pos.z/100)]
							!=
								0
						) break;
						if (
							every
								[Math.round(i/100)]
								[Math.round(deskgood.pos.y/100)-1]
								[Math.round(deskgood.pos.z/100)]
							!=
								0
						) break;
					}catch(err){}
				}
			}
			if (z > 0){
				for (var j=deskgood.pos.z; j<=deskgood.pos.z+z; j+=2){
					try{
						if (
							every
								[Math.round(deskgood.pos.x/100)]
								[Math.round(deskgood.pos.y/100)]
								[Math.round(j/100)]
							!=
								0
						) break;
						if (
							every
								[Math.round(deskgood.pos.x/100)]
								[Math.round(deskgood.pos.y/100)-1]
								[Math.round(j/100)]
							!=
								0
						) break;
					}catch(err){}
				}
			}else{
				for (var j=deskgood.pos.z; j>=deskgood.pos.z+z; j-=2){
					try{
						if (
							every
								[Math.round(deskgood.pos.x/100)]
								[Math.round(deskgood.pos.y/100)]
								[Math.round(j/100)]
							!=
								0
						) break;
						if (
							every
								[Math.round(deskgood.pos.x/100)]
								[Math.round(deskgood.pos.y/100)-1]
								[Math.round(j/100)]
							!=
								0
						) break;
					}catch(err){}
				}
			}
			
			i -= deskgood.pos.x;
			j -= deskgood.pos.z;
			
			i -= i>0? 10: i<0? -10: 0;
			j -= j>0? 10: j<0? -10: 0;
			
			deskgood.pos.x += i*(Math.random()*0.2+0.9);
			deskgood.pos.z += j*(Math.random()*0.2+0.9);*/
		}
	}, 16.667);
	
	return false;
});
$("#control").on("touchmove", function(e){
	if (stop)
		return;
	
	let x = e.originalEvent.targetTouches[0].clientX;
	let y = e.originalEvent.targetTouches[0].clientY;
	console.log("touchmove(control):", x, y);
	
	[touch_control.x, touch_control.y] = [x, y];
	
	return false;
});
$("#control").on("touchend", function(e){
	let x = e.originalEvent.changedTouches[0].clientX,
		y = e.originalEvent.changedTouches[0].clientY;
	console.log("touchend(control):", x, y);
	
	clearInterval(touch_control.loop);
	touch_control.x0 = touch_control.y0 = touch_control.x = touch_control.y = touch_control.t0 = touch_control.loop = null;
	
	return false;
});
$("#control").on("touchcancel", function(e){
	let x = e.originalEvent.changedTouches[0].clientX,
		y = e.originalEvent.changedTouches[0].clientY;
	console.log("touchcancel(control):", x, y);
	
	clearInterval(touch_control.loop);
	touch_control.x0 = touch_control.y0 = touch_control.x = touch_control.y = touch_control.t0 = touch_control.loop = null;
	
	return false;
});


$("#jump").on("touchstart", function(){
	if (stop)
		return;
	
	console.log("try jump");
	
	try{
		if (
			map.get(deskgood.pos.x/100,
				deskgood.pos.y/100-2,
				deskgood.pos.z/100)
			!=
				null
		){ //脚下有方块
			if (Number(get_date())-last_jump >= 1000){
				deskgood.v.y += deskgood.jump_v*(Math.random()*0.2+0.9);
				last_jump = Number(get_date());
			}
		}
	}catch(err){}
	
	return false;
});


let touch_screen = {
	t: null,
	pos: {x: null, y: null},
	loop: null
};
$("#game").on("touchstart", function (e){
	if (stop)
		return;
	
	let x = e.originalEvent.targetTouches[0].pageX;
	let y = e.originalEvent.targetTouches[0].pageY
	//console.log("touchstart(screen):", x, y, +get_date());
	
	//[x0,y0] = [x, y];
	
	touch_screen.t = get_date();
	touch_screen.pos = {x,y};
	touch_screen.loop = setTimeout(()=>{ //长按1000ms（删除）
		touch_screen.loop = null;
		if (Math.sqrt( (touch_screen.pos.x-x)**2 + (touch_screen.pos.y-y)**2 ) < 36){ //误差36px
			let click = get_choice_object(true, x, y);
			for (let i in click){
				if (click[i].faceIndex){
					if (click[i].object instanceof THREE.Mesh){
						let x = click[i].object.position.x,
							y = click[i].object.position.y,
							z = click[i].object.position.z;
						if (Math.sqrt(
							(x - deskgood.pos.x) **2+
							(y - deskgood.pos.y) **2+
							(z - deskgood.pos.z) **2
						) < 500){ //距离小于500
							if (
								map.get(x/100, y/100, z/100) &&
								map.get(x/100, y/100, z/100).attr.block &&
								map.get(x/100, y/100, z/100).attr.block.onLongTouch &&
								eval(map.get(x/100, y/100, z/100).attr.block.onLongTouch) === false
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
							let free = deskgood.hold[deskgood.choice]==0? deskgood.choice: deskgood.hold.indexOf(0);
							if (free == -1){
								console.info("not free!");
								message("<font style='font-size:14px;'>两只手拿4m³方块已经够多了，反正我是拿不下了</font>", 3);
								/* try{
									plus.nativeUI.toast("<font style=\"font-size:14px\">两只手拿4m³方块已经够多了，反正我是拿不下了</font>",
										{
											type:"richtext",
											verticalAlign: "top",
											richTextStyle:{
												align:"center"
											}
										}
									);
								}catch(err){} */
							}else{
								console.log("delete:", click[i].object.position);
								deskgood.hold[free] = map.get(x/100, y/100, z/100).id; //放在手中
								deskgood.hold_things_refresh(); //刷新方块
								map.delete(x/100, y/100, z/100); //删除方块
								map.updateRound(x/100, y/100, z/100); //更新方块
								//SQL
								[x, y, z] = [x, y, z].map(v => Math.round(v/100));
								sql.deleteData("file", `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
									sql.insertData("file", ["type", "x", "y", "z", "id", "attr"], [
										0,
										x,
										y,
										z,
										0,
										`""`
									])
								});
								//scene.remove(click[i].object);
								//every[ click[i].object.position.x/100 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] = 0;
								try{
									plus.device.vibrate(16); //挖掘震动
								}catch(e){ //原生震动
									if("vibrate" in navigator){
										navigator.vibrate(16);
									}
								}
								/* if (
									every[ click[i].object.position.x/100+1 ][ click[i].object.position.y/100 ][ click[i].object.position.z/100 ] 
								) */
							}
							break;
						}
					}
				}
			}
		}
	}, 1000);
	
	return false;
});
$("#game").on("touchmove", function (e){
	if (stop)
		return false;
	
	if (touch_screen.pos.x === null | touch_screen.pos.y === null)
		return false;
	
	let x = e.originalEvent.targetTouches[0].pageX;
	let y = e.originalEvent.targetTouches[0].pageY;
	console.log("touchmove:", x, y);
	
	let [dx, dy] = [x - touch_screen.pos.x, y - touch_screen.pos.y];
	touch_screen.pos = {x,y};
	//[x0, y0] = [x, y];
	console.log("move:", dx, dy);
	deskgood.lookAt.left_right += dx/$("#game")[0].offsetWidth*90*deskgood.sensitivity;
	deskgood.lookAt.top_bottom -= dy/$("#game")[0].offsetHeight*90*deskgood.sensitivity;
	
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
	
	if (Math.sqrt( (touch_screen.pos.x-x)**2 + (touch_screen.pos.y-y)**2 ) >= 100){ //误差100px
		touch_screen.pos.x = -666;
		touch_screen.pos.y = -666;
	}
	return false;
});
$("#game").on("touchend", function (e){
	if (stop)
		return;
	
	let x = e.originalEvent.changedTouches[0].pageX;
	let y = e.originalEvent.changedTouches[0].pageY;
	//console.log("touchend:", x, y, Number(get_date()));
	
	touch_screen.pos = {x: null, y:null};
	//x0 = null, y0 = null;
	
	if (touch_screen.loop !== null){ //短按（放置）
		clearTimeout(touch_screen.loop);
		touch_screen.loop = null;
		if (Math.sqrt( (touch_screen.pos.x-x)**2 + (touch_screen.pos.y-y)**2) < 36){ //误差36px
			let click = get_choice_object(true, x, y);
			for (let i in click){
				if (click[i].object instanceof THREE.Mesh){
					let x = click[i].object.position.x,
						y = click[i].object.position.y,
						z = click[i].object.position.z;
					/* if (
						Math.sqrt(
							(click[i].object.position.x - deskgood.pos.x) **2+
							(click[i].object.position.y - deskgood.pos.y) **2+
							(click[i].object.position.z - deskgood.pos.z) **2
					) < 500){ //距离<500
						if (
							map.get(click[i].object.position.x/100,
								click[i].object.position.y/100,
								click[i].object.position.z/100)
							&&
							map.get(click[i].object.position.x/100,
								click[i].object.position.y/100,
								click[i].object.position.z/100).id
							==
								1
						){ //命令方块
							state("command");
							return;
						}
					} */
					if (
						map.get(x/100, y/100, z/100) &&
						map.get(x/100, y/100, z/100).attr.block &&
						map.get(x/100, y/100, z/100).attr.block.onShortTouch &&
						eval(map.get(x/100, y/100, z/100).attr.block.onShortTouch) === false
					) return;
					if (deskgood.hold[deskgood.choice] == 0) //空气
						return;
					switch (click[i].faceIndex){
						case 0:
						case 1:
							x += 100;
							break;
						case 2:
						case 3:
							x -= 100;
							break;
						case 4:
						case 5:
							y += 100;
							break;
						case 6:
						case 7:
							y -= 100;
							break;
						case 8:
						case 9:
							z += 100;
							break;
						case 10:
						case 11:
							z -= 100;
							break;
						default:
							return console.error("faceIndex wrong:", click[i].faceIndex);
					}
					if (Math.sqrt(
						(x-deskgood.pos.x) **2+
						(y-deskgood.pos.y) **2+
						(z-deskgood.pos.z) **2
					) < 500){ //距离<5m
						map.addID(deskgood.hold[deskgood.choice], {
							x: x/100,
							y: y/100,
							z: z/100
						}, template);
						/* map.add(new Thing(template[ deskgood.hold[deskgood.choice] ]).block.makeMaterial().block.deleteTexture().block.makeMesh(), {
							x: x/100,
							y: y/100,
							z: z/100
						}); */
						map.updateRound(x/100, y/100, z/100); //更新方块及周围方块
						let thing_id = deskgood.hold[deskgood.choice];
						//SQL
						[x, y, z] = [x, y, z].map(v => Math.round(v/100));
						sql.deleteData("file", `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
							sql.insertData("file", ["type", "x", "y", "z", "id", "attr"], [
								0,
								x,
								y,
								z,
								thing_id,
								`""`
							])
						});
						deskgood.hold[deskgood.choice] = 0; //删除手里的方块
						deskgood.hold_things_refresh(); //刷新方块
						break; //跳出 寻找有效放置的 循环
					}
					/*if (click[i].faceIndex == 0 | click[i].faceIndex == 1){
						if (Math.sqrt(
							Math.pow((click[i].object.position.x+100) - deskgood.pos.x, 2)+
							Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
							Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
						) < 500){ //距离<50
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
						if (Math.sqrt(
							Math.pow((click[i].object.position.x-100) - deskgood.pos.x, 2)+
							Math.pow(click[i].object.position.y - deskgood.pos.y, 2)+
							Math.pow(click[i].object.position.z - deskgood.pos.z, 2)
						) < 500){ //距离<500
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
							let mesh = new THREE.Mesh(block_geometry, template[ deskgood.hold[deskgood.choice]].material);
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
	}
});
$("#game").on("touchcancel", function (e){
	if (stop)
		return;
	
	let x = e.originalEvent.changedTouches[0].pageX;
	let y = e.originalEvent.changedTouches[0].pageY;
	console.log("touchcancel:", x, y, Number(get_date()));
	
	touch_screen.pos = {x: null, y:null};
	//x0 = null, y0 = null;
	
	if (touch_screen.loop !== null){ //短按（放置）
		clearTimeout(touch_screen.loop);
	}
});