/**
* 玩家(deskgood)
*/
const deskgood = { //桌子好
	v: new THREE.Vector3(),
	pos: camera.position,
	collisionBox: { //碰撞箱
		"x+": 10,
		"x-": 10,
		"y+": 50,
		"y-": 150,
		"z+": 10,
		"z-": 10
	},
	ideal_v: { //理想速度
		walk: 1, //行走：1m/s
		sprint: 3, //疾跑：3m/s
		jump: 5, //跳跃：5m/s
	},
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
				$(children[i])
					.removeClass("checked")
					.addClass(i==deskgood.choice? "checked": undefined);
					/* .css("borderColor", (i==deskgood.choice)?"#cba":"#edc")
					.css("borderWidth", (i==deskgood.choice)?"0.6vmax":"0.5vmax")
					.css("transform", (i==deskgood.choice)?"translateY(-3px)":"")
					.css("margin", "0 0"); */
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
				$(children[i])
					.removeClass("checked")
					.addClass(i==children.length-1? "checked": undefined);
					/* .css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0"); */
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
						deskgood.hold.delete(deskgood.choice);
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
				$(children[i])
					.removeClass("checked")
					.addClass(i==children.length-1? "checked": undefined);
					/* .css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0"); */
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
						deskgood.hold.delete(deskgood.choice);
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
				$(children[i])
					.removeClass("checked")
					.addClass(i==children.length-1? "checked": undefined);
					/* .css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0"); */
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
						
						if ( eval( choice.get("attr", "onPutToLeg") ) === false )
							return;
						
						deskgood.leg.addOne( choice );
						deskgood.hold.delete(deskgood.choice);
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
				$(children[i])
					.removeClass("checked")
					.addClass(i==children.length-1? "checked": undefined);
					/* .css("borderColor", (i==children.length-1)?"#876":"#a6917c")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0"); */
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
						deskgood.hold.delete(deskgood.choice);
					}
				};
			}
		}
	}),
	// 死亡
	die(reason="使用命令自杀"){
		db.clearTable(DB.TABLE.WORLD); //删表
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
		const blocks = deskgood.update_round_blocks.blocks;
		for (const pos of blocks)
			map.update(pos.x, pos.y, pos.z); //重新更新
		blocks.splice(0, blocks.length);
		
		for (let x=deskgood.pos.x/100-dx; x<=deskgood.pos.x/100+dx; x++)
			for (let y=deskgood.pos.y/100-1-dy; y<=deskgood.pos.y/100+dy; y++)
				for (let z=deskgood.pos.z/100-dz; z<=deskgood.pos.z/100+dz; z++)
					blocks.push(new THREE.Vector3(x, y, z));
		
		for (const pos of blocks){
			const {block, added} = map.getShould(pos.x, pos.y, pos.z);
			if (block === null || block.name === "空气") // 已加载 || 未加载
				continue; //空气不用显示
			
			if (!added)
				map.addID(block, pos.round());
			
			block.block.material.forEach(v => v.visible=true ); //显示所有面
		}
	},
	// 移动
	move (x=deskgood.pos.x, y=deskgood.pos.y, z=deskgood.pos.z){
		/*[x, z] = [x, z].map(
			value => value+(0.1*Math.random()-0.05)
		); //随机化*/
		
		if (
			( map.get(x/100, y/100, z/100) !== undefined ||
				map.getEntity(x/100, y/100, z/100, true) !== undefined
			) && //不能移动到未加载的方块
			map.getInitedChunks().some((item)=>{
				return item[0] == Math.round(x/100/map.size.x) &&
					item[1] == Math.round(z/100/map.size.z);
			}) //含有（已加载和加载中的区块）
		){
			const changed_x_z = deskgood.pos.x != x || deskgood.pos.z != z, //改变了x|z坐标
				changed = changed_x_z || deskgood.pos.y != y; //改变了x|y|z坐标
			
			deskgood.pos.set(x, y, z);
			
			const updater = deskgood.update_round_blocks;
			//预加载区块
			if (changed_x_z && !updater.preloadID)
				updater.preloadID =  setTimeout(()=>{
					map.preloadChunk();
					updater.preloadID = null;
				}, 100);
			//更新周围方块
			if (changed && !updater.updateID)
				updater.updateID = setTimeout(()=>{
					deskgood.update_round_blocks();
					updater.updateID = null;
				}, 100);
		}else{
			print("区块暂未加载完成，无法进入<br/>（想加载快可以调节区块预加载范围）", "区块未加载完成", 1);
		}
	},
	// 前进
	go (x=0, y=0, z=0){
		x = x*rnd_error(),
		y = y*rnd_error(),
		z = z*rnd_error(); //随机化
		
		const rt = [0,0,0]; //返回值
		
		if ( y<0 && map.get(
			deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100
		) ){ //腿上有方块
			// console.warn("卡住leg go不了");
			rt[1] = y;
			y = 0;
		}
		
		//X+
		if (x > 0){
			//上半身
			let objs = ray3D(
				{},
				{x: 1},
				0,
				x + deskgood.collisionBox["x+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).min() - deskgood.collisionBox["x+"]; //获取碰撞点，计算移动位置
				rt[0] = px - (deskgood.pos.x+x);
				deskgood.moveX(px);
				// console.log("x+ 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x + x);
			}
			
			//下半身
			objs = ray3D(
				{y: deskgood.pos.y-100},
				{x: 1},
				0,
				x + deskgood.collisionBox["x+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).min() - deskgood.collisionBox["x+"]; //获取碰撞点，计算移动位置
				rt[0] = px - (deskgood.pos.x + x);
				deskgood.moveX(px);
				// console.log("x+ 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x + x);
			}
		
		// X-
		}else if (x < 0){
			//上半身
			let objs = ray3D(
				{},
				{x: -1},
				0,
				-x + deskgood.collisionBox["x+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).max() + deskgood.collisionBox["x-"]; //获取碰撞点，计算移动位置
				rt[0] = px - (deskgood.pos.x + x);
				deskgood.moveX(px);
				// console.log("x- 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x + x);
				// console.log("x- 上 无碰撞",x)
			}
			
			//下半身
			objs = ray3D(
				{y: deskgood.pos.y-100},
				{x: -1},
				0,
				-x + deskgood.collisionBox["x-"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).max() + deskgood.collisionBox["x-"]; //获取碰撞点，计算移动位置
				rt[0] = px - (deskgood.pos.x + x);
				deskgood.moveX(px);
				// console.log("x- 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x + x);
				// console.log("x- 下 无碰撞",x)
			}
		}
		
		//Y+
		if (y > 0){ //上
			let objs = ray3D(
				{},
				{y: 1},
				0,
				y + deskgood.collisionBox["y+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const py = objs.map(v => v.point.y).min() - deskgood.collisionBox["y+"]; //获取碰撞点，计算移动位置
				rt[1] = py - (deskgood.pos.y + y);
				deskgood.moveY(py);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y + y);
			}
		
		//Y-
		}else if (y < 0){ //下
			let objs = ray3D(
				{},
				{y: -1},
				0,
				-y + deskgood.collisionBox["y-"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const py = objs.map(v => v.point.y).max() + deskgood.collisionBox["y-"]; //获取碰撞点，计算移动位置
				rt[1] = py - (deskgood.pos.y + y);
				deskgood.moveY(py);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y + y);
			}
		}
		
		//Z+
		if (z > 0){
			//上半身
			let objs = ray3D(
				{},
				{z: 1},
				0,
				z + deskgood.collisionBox["z+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).min() - deskgood.collisionBox["z+"]; //获取碰撞点，计算移动位置
				rt[2] = pz - (deskgood.pos.z + z);
				deskgood.moveZ(pz);
				// console.log("z+ 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z + z);
			}
			//下半身
			objs = ray3D(
				{y: deskgood.pos.y-100},
				{z: 1},
				0,
				z + deskgood.collisionBox["z+"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).min() - deskgood.collisionBox["z+"]; //获取碰撞点，计算移动位置
				rt[2] = pz - (deskgood.pos.z + z);
				deskgood.moveZ(pz);
				// console.log("z+ 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z + z);
			}
		
		//Z-
		}else if (z < 0){
			//上半身
			let objs = ray3D(
				{},
				{z: -1},
				0,
				-z + deskgood.collisionBox["z-"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).max() + deskgood.collisionBox["z-"]; //获取碰撞点，计算移动位置
				rt[2] = pz - (deskgood.pos.z + z);
				deskgood.moveZ(pz);
				// console.log("z- 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z + z);
				// console.log("z- 上 无碰撞",z)
			}
			//下半身
			objs = ray3D(
				{y: deskgood.pos.y-100},
				{z: -1},
				0,
				-z + deskgood.collisionBox["z-"]
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).max() + deskgood.collisionBox["z-"]; //获取碰撞点，计算移动位置
				rt[2] = pz - (deskgood.pos.z + z);
				deskgood.moveZ(pz);
				// console.log("z- 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z + z);
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
	place(thing, {x,y,z}){
		/* 单位:m */
		
		//处理事件
		if ( eval(thing.get("attr", "onPut")) === false)
			return;
		
		console.log("deskgood.place", {x,y,z}, thing)
		
		map.addID(thing, {x,y,z}); //添加方块
		
		const attr = JSON.stringify(thing.attr).slice(1,-1), //属性
			[cX, cZ] = map.p2c(x, z), //区块坐标
			edit = map.chunks[cX][cZ].edit;
		
		switch (thing.type){
			case "Block":
				for (let i=edit.length-1; i>=0; i--){ //删除数组元素需倒序
					if (edit[i].x == x && edit[i].y == y && edit[i].z == z)
						edit.splice(i, 1); //删除重复
				}
				
				edit.push({
					type: DB.TYPE.Block,
					x,
					y,
					z,
					name: thing.name,
					attr
				}); //添加edit
				map.updateRound(x, y, z); //刷新方块及周围
				
				console.time("db.addData1")
				DB.addBlock(x,y,z, thing.name, attr)
					.then(()=>console.timeEnd("db.addData1"));
				break;
				
			case "EntityBlock":
				const id = thing.block.mesh.id;
				
				for (let i=edit.length-1; i>=0; i--){ //删除数组元素需倒序
					if (edit[i].id == id)
						map.chunks[cX][cZ].edit.splice(i, 1); //删除重复
				}
				
				map.chunks[cX][cZ].edit.push({
					type: DB.TYPE.EntityBlock,
					id,
					x,
					y,
					z,
					name: thing.name,
					attr
				}); //添加edit
				map.updateRound(x, y, z); //刷新方块及周围
				
				console.time("db.addData1")
				DB.addEntity(id, x,y,z, thing.name, attr)
					.then(()=>console.timeEnd("db.addData1"));
				break;
		}
		
		// x = Math.round(x), y = Math.round(y), z = Math.round(z); //存储必须整数
		//DB
		/* console.time("db.addData1")
		db.addData(DB.TABLE.WORLD, {
			type: DB.TYPE[thing.type],
			x,
			y,
			z,
			name: thing.name,
			attr
		}, {
			successCallback: function(){
				console.timeEnd("db.addData1")
				let find = false;
				db.readStep(DB.TABLE.WORLD, {
					index: "type",
					range: ["only", DB.TYPE[thing.type]],
					dirt: "prev",
					stepCallback: function(res){
						if (res.x!=x || res.y!=y || res.z!=z) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(DB.TABLE.WORLD, res.key);
						}else{
							find = true;
						}
					}
				});
			}
		}); */
		/*db.deleteData(tableName, `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, ()=>{
			sql.insertData(tableName, ["type", "x", "y", "z", "id", "attr"], [
				0,
				x,
				y,
				z,
				thing.id,
				attr
			])
		});*/
	},
	
	// 移除方块
	remove(thing){
		const {x,y,z} = thing.block.mesh.position.clone().divideScalar(100).round(), //单位: m
			[cX, cZ] = map.p2c(x, z); //区块坐标
		
		//处理事件
		if ( eval(thing.get("attr", "onRemove")) === false)
			return;
		
		console.log("deskgood.remove", thing, {x,y,z}, {cX, cZ})
		
		map.delete(thing); //删除物体
		
		switch (thing.type){
			case "Block":
				// x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
				map.addID({name: "空气"}, {x,y,z}); //换成空气 防止undefined更新
				
				for (let i=map.chunks[cX][cZ].edit.length-1; i>=0; i--){ //删除数组元素需倒序
					v = map.chunks[cX][cZ].edit[i];
					if (v.x == x && v.y == y && v.z == z)
						map.chunks[cX][cZ].edit.splice(i, 1); //删除重复
				}
				
				map.chunks[cX][cZ].edit.push({
					type: DB.TYPE.Block,
					x,
					y,
					z,
					name: "空气"
				}); //添加edit
				
				console.time("db.addData2")
				DB.addBlock(x, y, z, "空气").then(()=>console.timeEnd("db.addData2"));
				break;
				
			case "EntityBlock":
				for (let i=map.chunks[cX][cZ].edit.length-1; i>=0; i--){ //删除数组元素需倒序
					v = map.chunks[cX][cZ].edit[i];
					if (v.id == thing.attr.entityID)
						map.chunks[cX][cZ].edit.splice(i, 1); //删除重复
				}
				
				DB.deleteEntity(thing.attr.entityID);
				
				/* map.chunks[cX][cZ].edit.push({
					type: DB.TYPE.Block,
					x,
					y,
					z,
					name: "空气"
				}); //添加edit */
				
				break;
		}
		map.updateRound(x, y, z); //刷新方块及周围
		
		// x = Math.round(x), y = Math.round(y), z = Math.round(z); //存储必须整数
		//DB
		/* console.time("db.addData2")
		DB.addData(x, y, z, "空气", )
		db.addData(DB.TABLE.WORLD, {
			type: DB.TYPE.Block,
			x,
			y,
			z,
			name: "空气"
		}, {
			successCallback: function(){
				console.timeEnd("db.addData2")
				let find = false;
				db.readStep(DB.TABLE.WORLD, {
					index: "type",
					range: ["only", DB.TYPE.Block],
					dirt: "prev",
					stepCallback: function(res){
						if (res.x!=x || res.y!=y || res.z!=z) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(DB.TABLE.WORLD, res.key);
						}else{
							find = true;
						}
					}
				});
			}
		}); */
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

deskgood.update_round_blocks.preloadID = null;
deskgood.update_round_blocks.updateID = null;
deskgood.update_round_blocks.blocks = [];


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
					breakTime: 6
				});
			}
		}, "f").name("更新区块(update)");
		scene_chunk_folder.add(map, "preloadChunk").name("更新加载区块(preloadChunk)")
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
		const deskgood_idealV_folder = deskgood_folder.addFolder("理想速度(ideal_v/(m/s))");
			deskgood_idealV_folder.add(deskgood.ideal_v, "walk", 0, 10, 0.1).name("行走(walk)");
			deskgood_idealV_folder.add(deskgood.ideal_v, "sprint", 0, 10, 0.1).name("疾跑(sprint)");
			deskgood_idealV_folder.add(deskgood.ideal_v, "jump", 0, 36, 1).name("跳跃(jump)");
		const deskgood_collisionBox_folder = deskgood_folder.addFolder("碰撞箱大小(collisionBox)");
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "x+", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "x-", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "y+", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "y-", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "z+", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "z-", 0, 200, 1);
		const deskgood_up_folder = deskgood_folder.addFolder("天旋地转（小心头晕）");
			deskgood_up_folder.add(deskgood.up, "x", -1, 1, 0.01).onChange(function(){
				print("头晕别怪我", "头晕");
			});
			deskgood_up_folder.add(deskgood.up, "y", -1, 1, 0.01).onChange(function(){
				print("头晕别怪我", "头晕");
			});
			deskgood_up_folder.add(deskgood.up, "z", -1, 1, 0.01).onChange(function(){
				print("头晕别怪我", "头晕");
			});
		const deskgood_hold_folder = deskgood_folder.addFolder("工具栏(tools)");
		deskgood_hold_folder.open();
			deskgood_hold_folder.add(deskgood, "choice", 0, 3, 1).listen().name("选择工具").onChange(deskgood.hold.update);
}


/*
* 卡住检测
*/
/* setInterval(()=>{
	// const warn = [];
	if ( map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100,
			deskgood.pos.z/100).get("attr", "through")
	){ //头被卡住
		// warn.push("头被卡住？");
		// print("你的头竟然卡到方块里了，想窒息吗？看你怎么出来", "窒息", 1, "#f00");
	}
	if (map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100) &&
		!map.get(deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100).get("attr", "through")
	){ //脚被卡住
		// warn.push("脚被卡住？");
	}
	
	// if (warn.length && !stop){
		/* if (!map.get(deskgood.pos.x/100,
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
		} */
		
		/* if (warn[0] & warn[1]){
			console.warn(warn[0], warn[1]);
		}else{
			console.warn(warn[0]);
		} *//*
	// }
}, 36); */


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