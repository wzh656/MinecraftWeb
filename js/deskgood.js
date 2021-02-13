/**
* 玩家(deskgood)
*/
const delay_id = {
	update_block: null,
	perloadChunk: null
}, body_blocks = [];
const deskgood = { //桌子好
	v: {
		x: 0,
		y: 0,
		z: 0
	},
	pos: camera.position,
	/*size: {
		"x+": 50,
		"x-": 50,
		"y+": 50,
		"y-": 150,
		"z+": 50,
		"z-": 50
	},*/
	jump_v: 5,
	up: camera.up,
	look: {
		get x(){ return THREE.Math.radToDeg(camera.rotation.x); },
		set x(v){ camera.rotation.x = THREE.Math.degToRad(v); },
		
		// y修正：0° X+, 90° Z+, 180° X-, 270° Z-
		get y(){ return -THREE.Math.radToDeg(camera.rotation.y)+270; },
		set y(v){ camera.rotation.y = THREE.Math.degToRad(-v+270); },
		
		get z(){ return THREE.Math.radToDeg(camera.rotation.z); },
		set z(v){ camera.rotation.z = THREE.Math.degToRad(v); }
	},
	VR: false,
	sensitivity: device? 2.6: 1, //灵敏度：手机2，电脑1
	handLength: 360, //手长（谐音360°全方位手残）
	choice: 0,
	hold: new ThingGroup($("#tools")[0], {
		fixedLength: 4,
		updateCallback(children){
			for (let i=0, len=children.length; i<len; i++){
				$(children[i]).css("borderColor", (i==deskgood.choice)?"#cba":"#edc")
					.css("borderWidth", (i==deskgood.choice)?"0.6vmax":"0.5vmax")
					.css("transform", (i==deskgood.choice)?"translateY(-3px)":"")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					const before = deskgood.choice;
					
					if ( deskgood.hold[before] &&
						eval( deskgood.hold[before].get("attr", "onChangeLeave") ) === false
					) return;
					
					deskgood.choice = i;
					
					if ( deskgood.hold[i] &&
						eval( deskgood.hold[i].get("attr", "onChangeTo") ) === false
					) return (deskgood.choice = before);
					
					deskgood.hold.update();
				};
			}
			children.push(
				$("<li></li>").append( $("<img/>").attr("src", "./img/more.png") )
				.click(()=>status("bag"))[0]
			);
		}
	}),
	head: new ThingGroup($("#bag .head")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i=0, len=children.length; i<len; i++){
				$(children[i]).css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.head[i]){ //有方块（放到手上）
						if ( deskgood.head[deskgood.head.length-1] &&
							eval( deskgood.head[deskgood.head.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.head[deskgood.head.length-1], deskgood.choice);
						deskgood.head.delete();
					}else{ //无方块
						const choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToHead") ) === false)
							return;
						
						deskgood.head.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	body: new ThingGroup($("#bag .body")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i=0, len=children.length; i<len; i++){
				$(children[i]).css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.body[i]){ //有方块（放到手上）
						if ( deskgood.body[deskgood.body.length-1] &&
							eval( deskgood.body[deskgood.body.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.body[deskgood.body.length-1], deskgood.choice);
						deskgood.body.delete();
					}else{ //无方块
						const choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToBody") ) === false)
							return;
						
						deskgood.body.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	leg: new ThingGroup($("#bag .leg")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i=0, len=children.length; i<len; i++){
				$(children[i]).css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.leg[i]){ //有方块（放到手上）
						if ( deskgood.leg[deskgood.leg.length-1] &&
							eval( deskgood.leg[deskgood.leg.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.leg[deskgood.leg.length-1], deskgood.choice);
						deskgood.leg.delete();
					}else{ //无方块
						const choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						console.log(choice, TEMPLATES, choice.get("attr", "onPutToLeg"))
						if ( eval( choice.get("attr", "onPutToLeg") ) === false )
							return;
						
						deskgood.leg.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	foot: new ThingGroup($("#bag .foot")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i=0, len=children.length; i<len; i++){
				$(children[i]).css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if ( deskgood.foot[deskgood.foot.length-1] &&
							eval( deskgood.foot[deskgood.foot.length-1].get("attr", "onHold") ) === false
						) return;
						
					if (deskgood.foot[i]){ //有方块（放到手上）
						deskgood.hold.addOne(deskgood.foot[deskgood.foot.length-1], deskgood.choice);
						deskgood.foot.delete();
					}else{ //无方块
						const choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToFoot") ) === false)
							return;
						
						deskgood.foot.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	// 死亡
	die(reason="使用命令自杀"){
		db.clearTable(TABLE.WORLD); //删表
		indexedDB.deleteDatabase( db.db.name );
		//db.remove(); //删库
		localStorage.removeItem("我的世界_seed");
		localStorage.removeItem("我的世界_seed");
		localStorage.removeItem("我的世界_time");
		localStorage.removeItem("我的世界_position");
		localStorage.removeItem("我的世界_height");
		localStorage.removeItem("我的世界_dirt");
		localStorage.removeItem("我的世界_type");
		localStorage.removeItem("我的世界_treeHeight");
		localStorage.removeItem("我的世界_leavesScale");
		localStorage.removeItem("我的世界_openStone");
		localStorage.removeItem("我的世界_weatherRain"); //删存储
		
		document.exitPointerLock(); //取消鼠标锁定
		gui.close(); //隐藏gui
		$("body > h1, #command, #bag").hide(); //隐藏 遮罩、横屏提示
		$("#die")
			.css("display", "block")
			.children(".resaon").html(reason);
		$("#die").hide().fadeIn("slow");
		
		const bgm = $("#bgm")[0];
		bgm.volume = 1;
		bgm.src = "./music/凉凉.mp3";
		bgm.play();
		
		console.warn("deskgood死亡");
	},
	/*// 旋转角&仰俯角更新
	look_update(x,y,z){
		if (x !== undefined || y !== undefined || z !== undefined){ //有不为undefined的值
			x = x||deskgood.lookAt.x,
			y = y||deskgood.lookAt.y,
			z = z||deskgood.lookAt.z;
			const v = new THREE.Vector3(x,y,z).setLength(1); //单位向量（标准化）
			camera.lookAt(deskgood.pos.x+v.x, deskgood.pos.y+v.y, deskgood.pos.z+v.z);
			deskgood.lookAt.x = v.x,
			deskgood.lookAt.y = v.y,
			deskgood.lookAt.z = v.z;
		}else{ //无参数调用
			const x =
					Math.cos(deskgood.look.y/180*Math.PI)*
					Math.cos(deskgood.look.x/180*Math.PI),
				z =
					Math.sin(deskgood.look.y/180*Math.PI)*
					Math.cos(deskgood.look.x/180*Math.PI),
				y = Math.sin(deskgood.look.x/180*Math.PI);
			camera.lookAt(deskgood.pos.x+x, deskgood.pos.y+y, deskgood.pos.z+z);
			deskgood.lookAt.x = x,
			deskgood.lookAt.y = y,
			deskgood.lookAt.z = z;
		}
	},*/
	update_round_blocks(dx=1, dy=1, dz=1){
		for (const i of body_blocks)
			if (i)
				map.update(i.x, i.y, i.z); //重新更新
		
		body_blocks.splice(0, body_blocks.length);
		for (let x=deskgood.pos.x/100-dx; x<=deskgood.pos.x/100+dx; x++)
			for (let y=deskgood.pos.y/100-1-dy; y<=deskgood.pos.y/100+dy; y++)
				for (let z=deskgood.pos.z/100-dz; z<=deskgood.pos.z/100+dz; z++)
					body_blocks.push({x, y, z});
		
		for (const i of body_blocks){
			//[i.x, i.y, i.z] = [i.x, i.y, i.z].map(Math.round)
			const block = map.get(i.x, i.y, i.z);
			//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn(block);
			if (!block) continue;
			
			block.block.material.forEach((item, index, arr) => {
				arr[index].visible = true;
			}); //显示所有
			//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn(block.block.material.map(v => v.visible));
			// console.info("显示面", i, [i.x,i.y,i.z].map(Math.round), block);
			if (!block.block.addTo){
				//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn("add", block.block.addTo);
				scene.add(block.block.mesh);
				block.block.addTo = true;
				// console.info("显示体", i, [i.x,i.y,i.z].map(Math.round), block);
			}
		}
	},
	// 移动
	move (x=deskgood.pos.x, y=deskgood.pos.y, z=deskgood.pos.z){
		/*[x, z] = [x, z].map(
			value => value+(0.1*Math.random()-0.05)
		); //随机化*/
		
		if (
			map.get(x/100, y/100, z/100) !== undefined && //不能移动到未加载的方块
			map.getInitedChunks().some((item)=>{
				return item[0] == Math.round(x/100/map.size.x) &&
					item[1] == Math.round(z/100/map.size.z);
			}) //含有（已加载和加载中的区块）
		){
			/* if (
				(
					map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100) && //有方块在头上
					(
						map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100).get("attr", "block", "through") || //可穿透
						map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100).get("attr", "block", "transparent") //透明
					)
				) || !map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100) //没有方块在头上
			){ */
				const changed_x_z = deskgood.pos.x != x || deskgood.pos.z != z, //改变了x|z坐标
					changed = changed_x_z || deskgood.pos.y != y;
				
				deskgood.pos.x = x,
				deskgood.pos.y = y,
				deskgood.pos.z = z;
				
				//perloadChunk
				if (changed_x_z && !delay_id.perloadChunk)
					delay_id.perloadChunk =  setTimeout(()=>{
						map.perloadChunk();
						delay_id.perloadChunk = null;
					}, 100);
				//更新周围方块
				if (changed && !delay_id.update_block)
					delay_id.update_block = setTimeout(()=>{
						deskgood.update_round_blocks();
						delay_id.update_block = null;
					}, 36);
			/* }else{
				deskgood.v.y = 0;
				throw "";
			} */
		}else{
			// throw "block";
			print("区块未加载完成", "区块暂未加载完成，禁止进入<br/>（想加载快可以调节区块预加载范围，只要不卡死就行）", 1);
		}
	},
	// 前进
	go (x=0, y=0, z=0){
		x = x*rnd_error(),
		y = y*rnd_error(),
		z = z*rnd_error(); //随机化
		
		const rt = [0,0,0]; //返回值
		
		if (y<0 && map.get(
			deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100
		)){ //腿上有方块
			// console.warn("卡住leg go不了");
			rt[1] = y;
			y = 0;
		}
		
		//X
		if (x > 0){
			//上半身
			let objs = ray3D(
				{x: deskgood.pos.x-50},
				{x: 1},
				0,
				x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fx = Math.min(...objs.map(v => v.point.x))-10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				// console.log("x+ 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
			}
			//下半身
			objs = ray3D(
				{x: deskgood.pos.x-50, y: deskgood.pos.y-100},
				{x: 1},
				0,
				x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fx = Math.min(...objs.map(v => v.point.x))-10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				// console.log("x+ 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
			}
		}else if (x < 0){
			//上半身
			let objs = ray3D(
				{x: deskgood.pos.x+50},
				{x: -1},
				0,
				-x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fx = Math.max(...objs.map(v => v.point.x))+10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				// console.log("x- 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
				// console.log("x- 上 无碰撞",x)
			}
			//下半身
			objs = ray3D(
				{x: deskgood.pos.x+50, y: deskgood.pos.y-100},
				{x: -1},
				0,
				-x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fx = Math.max(...objs.map(v => v.point.x))+10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				// console.log("x- 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
				// console.log("x- 下 无碰撞",x)
			}
		}
		
		//Y
		if (y > 0){ //上
			let objs = ray3D(
				{y: deskgood.pos.y+50},
				{y: 1},
				0,
				y
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				/*const fy = Math.min(...ray3D(
					{y: deskgood.pos.y+50},
					{y: 1}
				).map(v => v.point.y))-50;*/
				const fy = Math.min(...objs.map(v => v.point.y))-50; //获取碰撞点，计算移动位置
				rt[1] = fy-(deskgood.pos.y+y);
				deskgood.moveY(fy);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y+y);
			}
		}else if (y < 0){ //下
			let objs = ray3D(
				{y: deskgood.pos.y-150},
				{y: -1},
				0,
				-y
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				/*const fy = Math.max(...ray3D(
					{y: deskgood.pos.y-150},
					{y: -1}
				).map(v => v.point.y))+150;*/
				const fy = Math.max(...objs.map(v => v.point.y))+150; //获取碰撞点，计算移动位置
				rt[1] = fy-(deskgood.pos.y+y);
				deskgood.moveY(fy);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y+y);
			}
		}
		
		//z
		if (z > 0){
			//上半身
			let objs = ray3D(
				{z: deskgood.pos.z-50},
				{z: 1},
				0,
				z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fz = Math.min(...objs.map(v => v.point.z))-10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				// console.log("z+ 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
			}
			//下半身
			objs = ray3D(
				{z: deskgood.pos.z-50, y: deskgood.pos.y-100},
				{z: 1},
				0,
				z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fz = Math.min(...objs.map(v => v.point.z))-10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				// console.log("z+ 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
			}
		}else if (z < 0){
			//上半身
			let objs = ray3D(
				{z: deskgood.pos.z+50},
				{z: -1},
				0,
				-z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fz = Math.max(...objs.map(v => v.point.z))+10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				// console.log("z- 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
				// console.log("z- 上 无碰撞",z)
			}
			//下半身
			objs = ray3D(
				{z: deskgood.pos.z+50, y: deskgood.pos.y-100},
				{z: -1},
				0,
				-z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				const fz = Math.max(...objs.map(v => v.point.z))+10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				// console.log("z- 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
				// console.log("z- 下 无碰撞",z)
			}
		}
		
		return rt;
		
		/*if (x & z)
			console.log(x,y,z);
		
		const rt = [false, false, false];
		//x
		if (x > 0){ //向前
			for (var i=deskgood.pos.x; i<=deskgood.pos.x+x; i+=dx){
				if (map.get(i/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					// console.log("撞到脸，s:"+((deskgood.pos.x+x)-i));
					break;
				}
				if (map.get((i+10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					// console.log("撞到脚，s:"+((deskgood.pos.x+x)-i));
					break;
				}
			}
			deskgood.pos.x = i;
		}else if (x < 0){ //向后
			for (var i=deskgood.pos.x; i>=deskgood.pos.x+x; i-=dx){
				if (map.get((i-10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					// console.log("撞到后脑，s:"+(i-(deskgood.pos.x+x)));
					break;
				}
				if (map.get((i-10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					// console.log("撞到脚，s:"+(i-(deskgood.pos.x+x)));
					break;
				}
			}
			deskgood.pos.x = i;
		}
		//y
		if (y > 0){ //向上
			for (var j=deskgood.pos.y; j<=deskgood.pos.y+y; j+=dy){
				if (map.get(deskgood.pos.x/100,
						j/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[1] = true;
					const s = (deskgood.pos.y-150+y)-j;
					if (s)
						// console.log("撞到天花板，s:", s);
					break;
				}
			}
			deskgood.pos.y = j;
		}else if (y < 0){ //向下
			for (var j=deskgood.pos.y-150; j>=deskgood.pos.y-150+y; j-=dy){
				if (map.get(deskgood.pos.x/100,
						j/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[1] = true;
					const s = j-(deskgood.pos.y-150+y);
					if (s)
						console.log("撞到地面，s:", s);
					break;
				}
			}
			deskgood.pos.y = j+150;
		}
		
		//z
		if (z > 0){ //向右
			for (var k=deskgood.pos.z; k<=deskgood.pos.z+z; k+=dz){
				if (map.get((k+10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					// console.log("撞到头，s:"+((deskgood.pos.z+z)-i));
					break;
				}
				if (map.get((k+10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					// console.log("撞到腿，s:"+((deskgood.pos.z+z)-k));
					break;
				}
			}
			deskgood.pos.z = k;
		}else if (z < 0){ //向左
			for (var k=deskgood.pos.z; k>=deskgood.pos.z+z; k-=dz){
				if (map.get((k-10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					// console.log("撞到头，s:"+(k-(deskgood.pos.z+z)));
					break;
				}
				if (map.get((k-10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					// console.log("撞到腿，s:"+(k-(deskgood.pos.z+z)));
					break;
				}
			}
			deskgood.pos.z = k;
		}
		return rt;*/
	},
	
	// 放置方块
	place(block, {x, y, z}){ // 单位 px=cm
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z);
		
		if ( map.get(x, y, z) &&
			eval(map.get(x, y, z).get("attr", "block", "onPut")) === false
		) return;
		
		console.log("deskgood.place", {x,y,z}, block.id, block.attr)
		
		map.addID(block.id, {x,y,z}, TEMPLATES, {
			attr: block.attr
		});
		
		const attr = `'${JSON.stringify(map.get(x, y, z).attr).slice(1,-1)}'`,
			cX = Math.round(x/map.size.x),
			cZ = Math.round(z/map.size.z);
		map.chunks[cX][cZ].edit = map.chunks[cX][cZ].edit.filter(v =>
			v.x != x &&
			v.y != y &&
			v.z != z
		); //删除重复
		/*for (const [i, item] of Object.entries(map.chunks[cX][cZ].edit) )
			if (
				item.x == x &&
				item.y == y &&
				item.z == z
			) map.chunks[cX][cX].edit.splice(i,1); //删除重复*/
		map.chunks[cX][cZ].edit.push({
			x,
			y,
			z,
			id: block.id,
			attr
		}); //添加edit
		map.updateRound(x, y, z); //刷新方块及周围
		
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z); //存储必须整数
		//DB
		db.addData(TABLE.WORLD, {
			type: 0,
			x,
			y,
			z,
			id: block.id,
			attr
		}, {
			successCallback: function(){
				let find = false;
				db.readStep(TABLE.WORLD, {
					index: "type",
					range: ["only", 0],
					dirt: "prev",
					stepCallback: function(res){
						if (res.x!=x || res.y!=y || res.z!=z) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(TABLE.WORLD, res.key);
						}else{
							find = true;
						}
					}
				});
			}
		});
		/*db.deleteData(tableName, `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, ()=>{
			sql.insertData(tableName, ["type", "x", "y", "z", "id", "attr"], [
				0,
				x,
				y,
				z,
				block.id,
				attr
			])
		});*/
	},
	
	// 移除方块
	remove({x, y, z}){ // 单位 px=cm
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z);
		
		if (
			map.get(x, y, z) &&
			eval(map.get(x, y, z).get("attr", "block", "onDelete")) === false
		) return;
		
		console.log("deskgood.remove", {x,y,z}, map.get(x, y, z))
		
		map.delete(x, y, z); //删除方块
		
		const cX = Math.round(x/map.size.x),
			cZ = Math.round(z/map.size.z);
		map.chunks[cX][cZ].edit = map.chunks[cX][cZ].edit.filter(v =>
			v.x != x && v.y != y && v.z != z
		); //删除重复
		/*for (const [i, item] of Object.entries(map.chunks[cX][cZ].edit) )
			if (
				item.x == x &&
				item.y == y &&
				item.z == z
			) map.chunks[cX][cZ].edit.splice(i,1); //删除重复*/
		map.chunks[cX][cZ].edit.push({
			x,
			y,
			z,
			id: 0
		}); //添加edit
		map.updateRound(x, y, z); //刷新方块及周围
		
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z); //存储必须整数
		//DB
		db.addData(TABLE.WORLD, {
			type: 0,
			x,
			y,
			z,
			id: 0
		}, {
			successCallback: function(){
				let find = false;
				db.readStep(TABLE.WORLD, {
					index: "type",
					range: ["only", 0],
					dirt: "prev",
					stepCallback: function(res){
						if (res.x!=x || res.y!=y || res.z!=z) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(TABLE.WORLD, res.key);
						}else{
							find = true;
						}
					}
				});
			}
		});
		/*sql.deleteData(tableName, `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
			sql.insertData(tableName, ["type", "x", "y", "z", "id"], [
				0,
				x,
				y,
				z,
				0
			]);
		});*/
	}
}
deskgood.moveTo = deskgood.move;
deskgood.moveX = x=>deskgood.move(x);
deskgood.moveY = y=>deskgood.move(undefined, y);
deskgood.moveZ = z=>deskgood.move(undefined, undefined, z);
deskgood.goX = x=>deskgood.go(x);
deskgood.goY = y=>deskgood.go(0,y);
deskgood.goZ = z=>deskgood.go(0,0,z);


/*window.addEventListener("deviceorientation", function(e){
	/* e.alpha：左右旋转（度）
	e.beta：前后旋转（度）
	e.gamma：扭转设备（度） *//*
	deskgood.look.y = -e.alpha;
	deskgood.look.x = e.gamma-90;
	console.log(e, deskgood.look);
	deskgood.look_update();
}); */

DB.read(); //读取存档


//gui
if (DEBUG){
	const scene_chunk_folder = gui.__folders["场景(scene)"].__folders["区块(chunk)"];
		scene_chunk_folder.add({
			get x(){ return Math.round(deskgood.pos.x/100/map.size.x); },
			set x(v){ deskgood.pos.x = v*100*map.size.x; }
		}, "x", -16, 16, 1).listen();
		scene_chunk_folder.add({
			get z(){ return Math.round(deskgood.pos.z/100/map.size.z); },
			set z(v){ deskgood.pos.z = v*100*map.size.z; }
		}, "z", -16, 16, 1).listen();
		scene_chunk_folder.add({
			f(){
				cX = Math.round(deskgood.pos.x/100/map.size.x),
				cZ = Math.round(deskgood.pos.z/100/map.size.z);
				map.updateChunkGenerator(cX, cZ, {
					breakTime: 16
				});
			}
		}, "f").name("更新区块(update)");
		scene_chunk_folder.add(map, "perloadChunk").name("更新加载区块(perloadChunk)")
	const scene_chunk_weather_folder = gui.__folders["场景(scene)"].__folders["区块(chunk)"].__folders["天气"];
		scene_chunk_weather_folder.add({
			get r(){
				cX = Math.round(deskgood.pos.x/100/map.size.x),
				cZ = Math.round(deskgood.pos.z/100/map.size.z);
				return (map.chunks[cX] && map.chunks[cX][cZ] && map.chunks[cX][cZ].weather && map.chunks[cX][cZ].weather.rain)||0;
			},
			set r(v){
				cX = Math.round(deskgood.pos.x/100/map.size.x),
				cZ = Math.round(deskgood.pos.z/100/map.size.z);
				if ( map.chunks[cX] && map.chunks[cX][cZ] && map.chunks[cX][cZ].weather )
					map.chunks[cX][cZ].weather.rain = v;
			}
		}, "r", 0, 0.333, 1e-6).name("降水(rain)").listen();
	
	const deskgood_folder = gui.addFolder("玩家/观察者(deskgood)");
	deskgood_folder.open();
		deskgood_folder.add(window, "stop").listen();
		deskgood_folder.add(deskgood, "die").name("Game Over(自杀)");
		deskgood_folder.add(deskgood, "sensitivity", 0.1, 10).name("灵敏度");
		deskgood_folder.add(deskgood, "jump_v", 1, 36).name("跳跃速度");
		const deskgood_position_folder = deskgood_folder.addFolder("位置/px");
		deskgood_position_folder.open();
			deskgood_position_folder.add(deskgood.pos, "x", map.size[0].x*100, map.size[1].x*100, 0.01).listen();
			deskgood_position_folder.add(deskgood.pos, "y", map.size[0].y*100, map.size[1].y*100, 0.01).listen();
			deskgood_position_folder.add(deskgood.pos, "z", map.size[0].z*100, map.size[1].z*100, 0.01).listen();
		const deskgood_v_folder = deskgood_folder.addFolder("速度/(m/s)");
			deskgood_v_folder.add(deskgood.v, "x", -10, 10, 1e-3).listen();
			deskgood_v_folder.add(deskgood.v, "y", -100, 100, 1e-3).listen().onChange((value) => {
				deskgood.v.y = (value/100)**3 *100;
			});
			deskgood_v_folder.add(deskgood.v, "z", -10, 10, 1e-3).listen();
		const deskgood_look_folder = deskgood_folder.addFolder("朝向(rotation)");
			deskgood_look_folder.add(deskgood.look, "x", -90, 90, 0.1).listen();
			deskgood_look_folder.add(deskgood.look, "y", 0, 360, 0.1).listen();
			deskgood_look_folder.add(deskgood.look, "z", -180, 180, 0.1).listen();
			deskgood_look_folder.add(deskgood, "VR").name("VR模式").onChange(v =>{ if (!v) deskgood.look.z=0; });
		const deskgood_up_folder = deskgood_folder.addFolder("天旋地转（小心头晕）");
			deskgood_up_folder.add(deskgood.up, "x", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
				/* plus.nativeUI.toast(
					"<font size=\"16\">头晕别怪我</font>",
					{
						type: "richtext",
						verticalAlign: "top",
						richTextStyle: {align:"center"}
					}
				); }catch(err){} */
			});
			deskgood_up_folder.add(deskgood.up, "y", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
					/* plus.nativeUI.toast(
						"<font size=\"16\">头晕别怪我</font>",
						{
							type: "richtext",
							verticalAlign: "top",
							richTextStyle: {align:"center"}
						}
					); }catch(err){} */
				});
			deskgood_up_folder.add(deskgood.up, "z", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
					/* plus.nativeUI.toast(
						"<font size=\"16\">头晕别怪我</font>",
						{
							type: "richtext",
							verticalAlign: "top",
							richTextStyle: {align:"center"}
						}
					); }catch(err){} */
				});
		const deskgood_hold_folder = deskgood_folder.addFolder("工具栏(tools)");
		deskgood_hold_folder.open();
			deskgood_hold_folder.add(deskgood, "choice", 0, 3, 1).listen().name("选择工具").onChange(deskgood.hold.update);
			const deskgood_hold_things_folder = deskgood_hold_folder.addFolder("物品(只读勿编辑)");
			deskgood_hold_things_folder.open();
				deskgood_hold_things_folder.add(deskgood.hold[0] || {id:0}, "id").name("0").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[1] || {id:0}, "id").name("1").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[2] || {id:0}, "id").name("2").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[3] || {id:0}, "id").name("3").listen().onChange(deskgood.hold.update);
}


/*
* 卡住检测
*/
setInterval(()=>{
	const warn = [];
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100).get("attr", "block", "through")
	){ //头被卡住
		warn.push("头被卡住？");
		if (
			!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100,
				deskgood.pos.z/100).get("attr", "block", "transparent") //不透明
		) print("窒息提示", "你的头竟然卡到方块里了，想窒息吗？看你怎么出来", 1, "#f68");
		/* try{
			plus.nativeUI.toast(
				"<font size=\"16\">想窒息吗？还往头上放方块，看你怎么出来！</font>",
				{
					type:"richtext",
					verticalAlign: "top",
					richTextStyle:{align:"center"}
				}
			);
		}catch(err){} */
		/*setTimeout(function(){
			try{ plus.nativeUI.closeToast(); }catch(err){}
		},1);*/
	}
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100).get("attr", "block", "through")
	){ //脚被卡住
		warn.push("脚被卡住？");
	}
	
	if (warn.length && !stop){
		if (!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100,
				deskgood.pos.z/100
			) &&
			!map.get(deskgood.pos.x/100,
				deskgood.pos.y/100+1,
				deskgood.pos.z/100
			) &&
			+time.getTime()-last_jump >= 1000
		){
			last_jump = +time.getTime();
			deskgood.v.y += deskgood.jump_v*rnd_error(); //自动跳跃
		}
		
		/* if (warn[0] & warn[1]){
			console.warn(warn[0], warn[1]);
		}else{
			console.warn(warn[0]);
		} */
	}
}, 36);


/*
* 天堂、地狱
*/
setInterval(function(){
	if (deskgood.v.y == Infinity && deskgood.pos.y == Infinity){
		document.body.innerHTML = "";
		document.write(`
<body style="background-color: black; color: rgb(200,200,200); margin:0; padding:0;">
<h1 style="font-size:16vmin; width:100%; margin:0; text-align:center; position:absolute; top:50%; transform:translateY(-50%);">欢迎来到天堂！<br/>welcome to Infinity.</h1>
		`);
		setTimeout(()=>{
			deskgood.die("上天堂");
		},3*1000*rnd_error());
	}else if (deskgood.pos.y < -1800*100){
		document.body.innerHTML = "";
		document.write(`
<body style="background-color: black; color: white; margin:0; padding:0;">
<h1 style="font-size:16vmin; width:100%; margin:0; text-align:center; position:absolute; top:50%; transform:translateY(-50%);">欢迎来到地狱！<br/>welcome to L-18.</h1>
		`);
		setTimeout(()=>{
			deskgood.die("下地狱");
		},3*1000*rnd_error());
	}
},1000);