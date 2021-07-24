class Player{
	constructor (opt){
		this.name = opt.name; //名称
		this.map = opt.map; //所在的Map
		this.pos = opt.position; //位置
		this.v = opt.v; //速度
		this.ideal_v = {
			walk: opt.ideal_v.walk, //行走
			sprint: opt.ideal_v.sprint, //疾跑
			jump: opt.ideal_v.jump //跳跃
		}; //理想速度
		this.collisionBox = { //碰撞箱大小
			x0: opt.collisionBox.x0,
			x1: opt.collisionBox.x1,
			y0: opt.collisionBox.y0,
			y1: opt.collisionBox.y1,
			z0: opt.collisionBox.z0,
			z1: opt.collisionBox.z1
		};
		this.look = opt.look; //朝向
		this.mesh = opt.mesh; //网格对象
		this.handLength = opt.handLength; //手长（谐音360°全方位手残）
		this.hold = opt.hold; //手上拿的物品
		this.choice = 0; //手上拿的物品序号
		this.head = opt.head; //头上
		this.body = opt.body; //身
		this.leg = opt.leg; //腿
		this.foot = opt.foot; //脚
		this.onKill = opt.onKill; //kill事件
		this.ids = {
			preload: null, //预加载区块
			update: null, //更新周围方块
			roundBlocks: [] //周围方块
		};
	}
	
	
	
	move(x=this.pos.x, y=this.pos.y, z=this.pos.z){
		if (
			this.map.get(x/100, y/100, z/100) !== undefined && //不能移动到未加载的方块
			this.map.getInitedChunks().some((item)=>{
				return item[0] == Math.round(x/100/this.map.size.x) &&
					item[1] == Math.round(z/100/this.map.size.z);
			}) //含有（已加载和加载中的区块）
		){
			const changed_x_z = this.pos.x != x || this.pos.z != z, //改变了x|z坐标
				changed = changed_x_z || this.pos.y != y; //改变了x|y|z坐标
			
			this.pos.set(x, y, z);
			
			const ids = this.ids;
			//预加载区块
			if (changed_x_z && !ids.preload)
				ids.preload =  setTimeout(()=>{
					this.map.preloadChunk();
					ids.preload = null;
				}, 100);
			//更新周围方块
			if (changed && !ids.update)
				ids.update = setTimeout(()=>{
					this.updateRoundBlocks();
					ids.update = null;
				}, 100);
		}else{
			print("区块暂未加载完成，无法进入<br/>（想加载快可以调节区块预加载范围）", "区块未加载完成", 1);
		}
	}
	moveX(x){
		this.move(x);
	}
	moveY(y){
		this.move(undefined, y);
	}
	moveZ(z){
		this.move(undefined, undefined, z);
	}
	
	
	
	go(x=0, y=0, z=0){
		x = x*rnd_error(),
		y = y*rnd_error(),
		z = z*rnd_error(); //随机化
		
		const rt = [0,0,0]; //返回值
		
		if ( y < 0 && this.map.get(
			this.pos.x/100,
			this.pos.y/100-1,
			this.pos.z/100
		) ){ //腿上有方块
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
				x + this.collisionBox.x1
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).min() - this.collisionBox.x1; //获取碰撞点，计算移动位置
				rt[0] = px - (this.pos.x+x);
				this.moveX(px);
				// console.log("x+ 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				this.moveX(this.pos.x + x);
			}
			
			//下半身
			objs = ray3D(
				{y: this.pos.y-100},
				{x: 1},
				0,
				x + this.collisionBox.x1
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).min() - this.collisionBox.x1; //获取碰撞点，计算移动位置
				rt[0] = px - (this.pos.x + x);
				this.moveX(px);
				// console.log("x+ 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				this.moveX(this.pos.x + x);
			}
		
		// X-
		}else if (x < 0){
			//上半身
			let objs = ray3D(
				{},
				{x: -1},
				0,
				-x + this.collisionBox.x0
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).max() + this.collisionBox.x0; //获取碰撞点，计算移动位置
				rt[0] = px - (this.pos.x + x);
				this.moveX(px);
				// console.log("x- 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				this.moveX(this.pos.x + x);
				// console.log("x- 上 无碰撞",x)
			}
			
			//下半身
			objs = ray3D(
				{y: this.pos.y-100},
				{x: -1},
				0,
				-x + this.collisionBox.x0
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const px = objs.map(v => v.point.x).max() + this.collisionBox.x0; //获取碰撞点，计算移动位置
				rt[0] = px - (this.pos.x + x);
				this.moveX(px);
				// console.log("x- 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), px, rt[0])
			}else{ //无阻挡
				this.moveX(this.pos.x + x);
				// console.log("x- 下 无碰撞",x)
			}
		}
		
		//Y+
		if (y > 0){ //上
			let objs = ray3D(
				{},
				{y: 1},
				0,
				y + this.collisionBox.y1
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const py = objs.map(v => v.point.y).min() - this.collisionBox.y1; //获取碰撞点，计算移动位置
				rt[1] = py - (this.pos.y + y);
				this.moveY(py);
			}else{ //无阻挡
				this.moveY(this.pos.y + y);
			}
		
		//Y-
		}else if (y < 0){ //下
			let objs = ray3D(
				{},
				{y: -1},
				0,
				-y + this.collisionBox.y0
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const py = objs.map(v => v.point.y).max() + this.collisionBox.y0; //获取碰撞点，计算移动位置
				rt[1] = py - (this.pos.y + y);
				this.moveY(py);
			}else{ //无阻挡
				this.moveY(this.pos.y + y);
			}
		}
		
		//Z+
		if (z > 0){
			//上半身
			let objs = ray3D(
				{},
				{z: 1},
				0,
				z + this.collisionBox.z1
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).min() - this.collisionBox.z1; //获取碰撞点，计算移动位置
				rt[2] = pz - (this.pos.z + z);
				this.moveZ(pz);
				// console.log("z+ 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				this.moveZ(this.pos.z + z);
			}
			//下半身
			objs = ray3D(
				{y: this.pos.y-100},
				{z: 1},
				0,
				z + this.collisionBox.z1
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).min() - this.collisionBox.z1; //获取碰撞点，计算移动位置
				rt[2] = pz - (this.pos.z + z);
				this.moveZ(pz);
				// console.log("z+ 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				this.moveZ(this.pos.z + z);
			}
		
		//Z-
		}else if (z < 0){
			//上半身
			let objs = ray3D(
				{},
				{z: -1},
				0,
				-z + this.collisionBox.z0
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).max() + this.collisionBox.z0; //获取碰撞点，计算移动位置
				rt[2] = pz - (this.pos.z + z);
				this.moveZ(pz);
				// console.log("z- 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				this.moveZ(this.pos.z + z);
				// console.log("z- 上 无碰撞",z)
			}
			//下半身
			objs = ray3D(
				{y: this.pos.y-100},
				{z: -1},
				0,
				-z + this.collisionBox.z0
			).filter(value => value.object.userData.thingObject &&
				value.object.userData.thingObject.get("attr", "through") != true
			); //过滤透明方块
			if (objs.length){ //被阻挡
				const pz = objs.map(v => v.point.z).max() + this.collisionBox.z0; //获取碰撞点，计算移动位置
				rt[2] = pz - (this.pos.z + z);
				this.moveZ(pz);
				// console.log("z- 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), pz, rt[2])
			}else{ //无阻挡
				this.moveZ(this.pos.z + z);
				// console.log("z- 下 无碰撞",z)
			}
		}
		
		return rt;
	}
	goX(x){
		this.go(x);
	}
	goY(y){
		this.go(0, y);
	}
	goZ(z){
		this.go(0, 0, z);
	}
	
	
	//放置方块
	place(thing, {x,y,z}){
		/* 单位:m */
		
		//处理事件
		if ( eval(thing.get("attr", "onPut")) === false)
			return;
		
		console.log("player.place", {x,y,z}, thing)
		
		this.map.addID(thing, {x,y,z}); //添加方块
		
		const attr = JSON.stringify(thing.attr).slice(1,-1), //属性
			[cX, cZ] = this.map.p2c(x, z), //区块坐标
			edit = this.map.chunks[cX][cZ].edit;
		
		switch (thing.type){
			case "Block":
				for (let i=edit.length-1; i>=0; i--) //删除数组元素需倒序
					if (edit[i].x == x && edit[i].y == y && edit[i].z == z)
						edit.splice(i, 1); //删除重复
				
				edit.push({
					type: DB.TYPE.Block,
					x,
					y,
					z,
					name: thing.name,
					attr
				}); //添加edit
				this.map.updateRound(x, y, z); //刷新方块及周围
				
				console.time("db.addData1")
				DB.addBlock(x,y,z, thing.name, attr)
					.then(()=>console.timeEnd("db.addData1"));
				break;
				
			case "EntityBlock":
				const id = thing.block.mesh.id;
				
				for (let i=edit.length-1; i>=0; i--) //删除数组元素需倒序
					if (edit[i].id == id)
						this.map.chunks[cX][cZ].edit.splice(i, 1); //删除重复
				
				this.map.chunks[cX][cZ].edit.push({
					type: DB.TYPE.EntityBlock,
					id,
					x,
					y,
					z,
					name: thing.name,
					attr
				}); //添加edit
				this.map.updateRound(x, y, z); //刷新方块及周围
				
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
	}
	
	
	
	//移除方块
	remove(thing){
		const {x,y,z} = thing.block.mesh.position.clone().divideScalar(100).round(), //单位: m
			[cX, cZ] = this.map.p2c(x, z), //区块坐标
			edit = this.map.chunks[cX][cZ].edit;
		
		//处理事件
		if ( eval(thing.get("attr", "onRemove")) === false)
			return;
		
		console.log("player.remove", thing, {x,y,z}, {cX, cZ})
		
		switch (thing.type){
			case "Block":
				// x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
				this.map.delete(thing); //删除物体
				this.map.addID({name: "空气"}, {x,y,z}); //换成空气 防止undefined更新
				
				for (let i=edit.length-1; i>=0; i--) //删除数组元素需倒序
					if (edit[i].x == x && edit[i].y == y && edit[i].z == z)
						edit.splice(i, 1); //删除重复
				
				edit.push({
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
				const id = thing.block.mesh.id;
				
				this.map.delete(thing); //删除物体
				
				for (let i=edit.length-1; i>=0; i--) //删除数组元素需倒序
					if (edit[i].id == id)
						edit.splice(i, 1); //删除重复
				
				DB.deleteEntity(id);
				
				/* edit.push({
					type: DB.TYPE.Block,
					x,
					y,
					z,
					name: "空气"
				}); //添加edit */
				
				break;
		}
		this.map.updateRound(x, y, z); //刷新方块及周围
		
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
	
	
	
	kill(reason="未知"){
		scene.remove(this.mesh);
		this.onKill(reason);
	}
	
	
	
	//更新周围方块
	updateRoundBlocks(dx=1, dy=1, dz=1){
		const blocks = this.ids.roundBlocks;
		for (const pos of blocks)
			this.map.update(pos.x, pos.y, pos.z); //重新更新
		blocks.splice(0, blocks.length);
		
		for (let x=this.pos.x/100-dx; x<=this.pos.x/100+dx; x++)
			for (let y=this.pos.y/100-1-dy; y<=this.pos.y/100+dy; y++)
				for (let z=this.pos.z/100-dz; z<=this.pos.z/100+dz; z++)
					blocks.push(new THREE.Vector3(x, y, z));
		
		for (const pos of blocks){
			const {block, added} = this.map.getShould(pos.x, pos.y, pos.z);
			if (block === null || block.name === "空气") // 已加载 || 未加载
				continue; //空气不用显示
			
			if (!added)
				this.map.addID(block, pos.round());
			
			block.block.material.forEach(v => v.visible=true ); //显示所有面
		}
	}
}
/**
* 玩家(deskgood)
*/
const deskgood = new Player({
	name: "deskgood",
	map,
	position: camera.position,
	v: new THREE.Vector3(0, 0, 0),
	ideal_v: {
		walk: 1, //行走：1m/s
		sprint: 3, //疾跑：3m/s
		jump: 5, //跳跃：5m/s
	},
	collisionBox: {
		x0: 10,
		x1: 10,
		y0: 150,
		y1: 50,
		z0: 10,
		z1: 10
	},
	look: {
		get x(){ return THREE.Math.radToDeg(camera.rotation.x); },
		set x(v){ camera.rotation.x = THREE.Math.degToRad(v); },
		
		// y修正：0° X+, 90° Z+, 180° X-, 270° Z-
		get y(){ return -THREE.Math.radToDeg(camera.rotation.y)+270; },
		set y(v){ camera.rotation.y = THREE.Math.degToRad(-v+270); },
		
		get z(){ return THREE.Math.radToDeg(camera.rotation.z); },
		set z(v){ camera.rotation.z = THREE.Math.degToRad(v); }
	},
	mesh: null, //暂无
	handLength: 360, //手长（谐音360°全方位手残）
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
	onKill(reason){
		db.clearTable(DB.TABLE.WORLD); //删表
		//db.remove();
		indexedDB.deleteDatabase( db.db.name ); //删库
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
	}
});


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
		deskgood_folder.add(deskgood, "kill").name("Game Over(自杀)");
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
		const deskgood_idealV_folder = deskgood_folder.addFolder("理想速度(ideal_v/(m/s))");
			deskgood_idealV_folder.add(deskgood.ideal_v, "walk", 0, 10, 0.1).name("行走(walk)");
			deskgood_idealV_folder.add(deskgood.ideal_v, "sprint", 0, 10, 0.1).name("疾跑(sprint)");
			deskgood_idealV_folder.add(deskgood.ideal_v, "jump", 0, 36, 1).name("跳跃(jump)");
		const deskgood_collisionBox_folder = deskgood_folder.addFolder("碰撞箱大小(collisionBox)");
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "x1", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "x0", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "y1", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "y0", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "z1", 0, 200, 1);
			deskgood_collisionBox_folder.add(deskgood.collisionBox, "z0", 0, 200, 1);
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