/**
* Touch Control
*/
const touch_control = {
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
	
	const x = e.originalEvent.targetTouches[0].clientX,
		y = e.originalEvent.targetTouches[0].clientY;
	//console.log("touchstart(control):", x, y);
	
	touch_control.x0 = x,
	touch_control.y0 = y,
	touch_control.t0 = +time.getTime();
	
	touch_control.loop = setInterval(function(){
		if (touch_control.x0 !== null &
			touch_control.y0 !== null &
			touch_control.x !== null &
			touch_control.y !== null
		){
			const t = +time.getTime()-touch_control.t0;
			touch_control.t0 = +time.getTime();
			
			const dx = touch_control.x-touch_control.x0,
				dy = touch_control.y-touch_control.y0;
			
			const θ = new THREE.Vector2(dx, dy).angle();
			
			let l = Math.sqrt(dx**2 + dy**2);
			l = l>100? 0.26*t: l*t/866;
			
			const look = new THREE.Vector2(0, l)
				.rotateAround(
					new THREE.Vector2(0,0),
					THREE.Math.degToRad(deskgood.look.y)+θ
				);
			/*const gX = Math.cos( deskgood.look.y/180*Math.PI+r )*l,
				gZ = Math.sin( deskgood.look.y/180*Math.PI+r )*l;*/
			
			//console.log("touch control to move:", x, z);
			
			deskgood.go(look.x*rnd_error(), 0, look.y*rnd_error());
			
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
			
			deskgood.pos.x += i*rnd_error();
			deskgood.pos.z += j*rnd_error();*/
		}
	}, 16.667);
	
	return false;
});
$("#control").on("touchmove", function(e){
	if (stop)
		return;
	
	const x = e.originalEvent.targetTouches[0].clientX,
		y = e.originalEvent.targetTouches[0].clientY;
	//console.log("touchmove(control):", x, y);
	
	touch_control.x = x,
	touch_control.y = y;
	
	return false;
});
$("#control").on("touchend", function(e){
	const x = e.originalEvent.changedTouches[0].clientX,
		y = e.originalEvent.changedTouches[0].clientY;
	//console.log("touchend(control):", x, y);
	
	clearInterval(touch_control.loop);
	touch_control.x0 = touch_control.y0 = touch_control.x = touch_control.y = touch_control.t0 = touch_control.loop = null;
	
	return false;
});
$("#control").on("touchcancel", function(e){
	const x = e.originalEvent.changedTouches[0].clientX,
		y = e.originalEvent.changedTouches[0].clientY;
	//console.log("touchcancel(control):", x, y);
	
	clearInterval(touch_control.loop);
	touch_control.x0 = touch_control.y0 = touch_control.x = touch_control.y = touch_control.t0 = touch_control.loop = null;
	
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
const touch_screen = {
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
	
	let x = e.originalEvent.targetTouches[0].pageX,
		y = e.originalEvent.targetTouches[0].pageY;
	
	//console.log("touchstart(screen):", {x, y}, touch_screen);
	
	//[x0,y0] = [x, y];
	touch_screen.x = touch_screen.x0 = x,
	touch_screen.y = touch_screen.y0 = y;
	touch_screen.loop = setTimeout(()=>{ //长按1000ms（删除）
		touch_screen.loop = null;
		if ( Math.sqrt(
				(touch_screen.x0 - touch_screen.x) **2+
				(touch_screen.y0 - touch_screen.y) **2
			) < 36
		){ //误差36px
			for (const obj of ray2D(x, y) ){
				if ( !(obj.object instanceof THREE.Mesh) ) continue;
				
				let {x,y,z} = obj.object.position; //单位 px=cm
				x = x/100, y = y/100, z = z/100; //单位 m
				
				if ( map.get(x, y, z) &&
					eval(map.get(x, y, z).get("attr", "block", "onLongTouch")) === false
				) return;
				
				if ( Math.sqrt(
					(x*100 - deskgood.pos.x) **2+
					(y*100 - deskgood.pos.y) **2+
					(z*100 - deskgood.pos.z) **2
				) >= deskgood.handLength) return; //距离>=手长
				
				const free = !deskgood.hold[deskgood.choice]? deskgood.choice: deskgood.hold.indexOf(null);
				if (free == -1){
					console.warn("not free!")
					return print("拿不下方块", "两只手拿4m³方块已经够多了，反正我是拿不下了", 3);
				}
				const block = obj.object.block;
				switch (block.type){
					case "Block":
						deskgood.hold.addOne(new Block({
							name: block.name,
							attr: block.attr
						}), free); //放在手中
						break;
					case "EntityBlock":
						deskgood.hold.addOne(new EntityBlock({
							name: block.name,
							attr: block.attr
						}), free); //放在手中
						break;
					case "Entity":
						deskgood.hold.addOne(new Entity({
							name: block.name,
							attr: block.attr
						}), free); //放在手中
						break;
				}
				
				deskgood.remove({x,y,z}); //删除方块
				
				break; //跳出 寻找有效放置的 循环
			}
		}
	}, 1000);
	
	return false;
});
$("#game").on("touchmove", function (e){
	if (stop)
		return false;
	
	/*if (touch_screen.pos.x === null || touch_screen.pos.y === null)
		return false;*/
	
	const x = e.originalEvent.targetTouches[0].pageX,
		y = e.originalEvent.targetTouches[0].pageY;
	
	//console.log("touchmove(start):", {x, y}, touch_screen);
	
	const dx = x - touch_screen.x,
		dy = y - touch_screen.y;
	
	touch_screen.x = x, touch_screen.y = y;
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
		touch_screen.x0 = -666;
		touch_screen.y0 = -666;
	}
	
	return false;
});
$("#game").on("touchend", function (e){
	if (stop)
		return false;
	
	const x = e.originalEvent.changedTouches[0].pageX,
		y = e.originalEvent.changedTouches[0].pageY;
	
	//console.log("touchend(screen):", {x, y}, touch_screen);
	
	if (touch_screen.loop !== null){ //短按（放置）
		clearTimeout(touch_screen.loop);
		touch_screen.loop = null;
		if ( Math.sqrt(
			(touch_screen.x0 - touch_screen.x) **2+
			(touch_screen.y0 - touch_screen.y) **2)
			< 36
		){ //误差36px
			if ( deskgood.hold[deskgood.choice] instanceof Block ){ //是方块
				for (const obj of ray2D(x, y) ){
					if ( !(obj.object instanceof THREE.Mesh) ) continue;
					
					let {x,y,z} = obj.object.position; //单位 px=cm
					x = x/100, y = y/100, z = z/100; //单位 m
					
					if ( map.get(x, y, z) &&
						eval(map.get(x, y, z).get("attr", "block", "onShortTouch")) === false
					) return;
					
					switch (obj.faceIndex){
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
							throw ["faceIndex wrong:", obj.faceIndex];
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
					
					deskgood.hold.delete(deskgood.choice); //删除手里的方块
					
					break; //跳出 寻找有效放置的 循环
				}
			}
		}
	}
	
	touch_screen.x = touch_screen.y = touch_screen.x0 = touch_screen.y0 = null;
});
$("#game").on("touchcancel", function (e){
	if (stop)
		return;
	
	let x = e.originalEvent.changedTouches[0].pageX,
		y = e.originalEvent.changedTouches[0].pageY;
	
	//console.log("touchcancel(screen):", {x, y}, touch_screen);
	
	touch_screen.x = touch_screen.y = touch_screen.x0 = touch_screen.y0 = null;
	clearTimeout(touch_screen.loop);
});