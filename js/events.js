const Events = {
	/**
	* 挖掘
	*/
	digThing: null, //正在挖掘的物体
	digId: null,
	/* 开始挖掘 */
	startDig(x, y){
		//获取物体和方块
		const obj = ray2D(x, y).filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		let direction, //挖掘方向
			side; //旁边方向
		switch (obj.faceIndex){
			case 0:
			case 1:
				direction = "x1";
				side = ["y", "z"];
				break;
			case 2:
			case 3:
				direction = "x0";
				side = ["y", "z"];
				break;
			case 4:
			case 5:
				direction = "y1";
				side = ["x", "z"];
				break;
			case 6:
			case 7:
				direction = "y0";
				side = ["x", "z"];
				break;
			case 8:
			case 9:
				direction = "z1";
				side = ["x", "y"];
				break;
			case 10:
			case 11:
				direction = "z0";
				side = ["x", "y"];
				break;
		}
		
		let thing = obj.object.userData.thingObject, //物体对象
			select = deskgood.hold.select,
			hold = deskgood.hold[select]; //挖掘工具
		
		//是否超出手长
		if ( obj.object.position .distanceToSquared( deskgood.pos )
			>= deskgood.handLength * deskgood.handLength
		) return; //距离**2 >= 手长**2 单位:px=cm
		
		let free, //手上空闲位置
			idealDigSpeed, //理想挖掘速度 单位: cm³/s
			take; //拿走的方块
		//判断hold类型
			//用手挖掘
		if (hold == null){
			free = select;
			idealDigSpeed = thing.get("attr", "idealDigSpeed", "手");
			
			//实体无法用于挖掘
		}else if (hold.type == "Entity"){
			return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#ff0");
			
			//用工具挖掘
		}else if (hold.type == "Tool"){
			const left = deskgood.hold[select-1];
			if (left &&
				left.name == (thing.get("attr", "digGet") || thing.name) && //同种方块
				left.get("attr", "stackable") == true //可叠加
			){ //放在左边
				free = select - 1;
				take = left;
			}else{ //放在空位
				free = deskgood.hold.indexOf(null);
				if (free == -1)
					return print("东西太多，我拿不下了", "拿不下方块", 3, "#ff0");
			}
			idealDigSpeed = thing.get("attr", "idealDigSpeed", hold.name);
			
			//方块或实体方块
		}else{
			if (hold.name != (thing.get("attr", "digGet") || thing.name) || //非同种物体
				hold.get("attr", "stackable") != true //不可叠加
			) return print("当前方块无法叠加", "无法挖掘", 3, "#ff0");
			
			if (deskgood.hold.validLength >= deskgood.hold.maxLength) //空出手来挖
				return print("东西太多，我没办法空出手来挖了", "没手挖方块", 3, "#ff0");
			
			free = select; //挖到叠加
			idealDigSpeed = thing.get("attr", "idealDigSpeed", "手"); //用手挖掘
			take = hold;
		}
		if (!idealDigSpeed){
			idealDigSpeed = thing.get("attr", "idealDigSpeed"); //默认挖掘速度
			if (!idealDigSpeed) //仍然无法挖掘
				return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#ff0");
		}
		
		
		/* 直接获得 不用挖掘 */
		if ( thing.get("attr", "directGet") ){
			const thingV = (OR(thing.get("attr", "size", "x1"), 100) -
					OR(thing.get("attr", "size", "x0"), 0)) *
				(OR(thing.get("attr", "size", "y1"), 100) -
					OR(thing.get("attr", "size", "y0"), 0)) *
				(OR(thing.get("attr", "size", "z1"), 100) -
					OR(thing.get("attr", "size", "z0"), 0)); //物体体积 单位: cm³
			
			//处理事件
			if ( eval(thing.get("attr", "onStartDig")) === false ) return;
			
			console.log("startDig")
			
			//挖掘振动
			if (typeof plus != "undefined"){
				plus.device.vibrate(20);
			}else if ("vibrate" in navigator){
				navigator.vibrate(20);
			}
			
			deskgood.state.digging = true; //挖掘开始
			this.digThing = thing; //正在挖掘的物体
			this.digId = time.setTimeout(()=>{
				deskgood.state.digging = false; //挖掘结束
				deskgood.hold.add(thing.cloneAttr(), free); //克隆一个放在手中
				deskgood.remove( thing ); //删除方块
				return this.startDig(OR(touch.screen.x, undefined), OR(touch.screen.y, undefined)); //下一轮挖掘
			}, thingV/idealDigSpeed*rnd_error()*1000).id; //（游戏时间） 单位: ms
			
			return print("拿走中……", "拿走中", 3, "#fff");
		}
		
		
		const thingS = (OR(thing.get("attr", "size", side[0]+"1"), 100) -
				OR(thing.get("attr", "size", side[0]+"0"), 0)) *
			(OR(thing.get("attr", "size", side[1]+"1"), 100) -
				OR(thing.get("attr", "size", side[1]+"0"), 0)), //挖掘面积 单位: cm²
			takeS = take?
				(OR(take.get("attr", "size", side[0]+"1"), 100) -
					OR(take.get("attr", "size", side[0]+"0"), 0)) *
				(OR(take.get("attr", "size", side[1]+"1"), 100) -
					OR(take.get("attr", "size", side[1]+"0"), 0))
				:thingS; //拿走物体面积 单位: cm²
		
		
		//预先判断 是否拿不下了
		if (take && take.attr){ //有take
			if (!take.attr.size || //无大小
				take.attr.size[direction[0]+"1"] === undefined //该方向为默认值
			) return print("手里方块太大拿不下了", "手里方块拿不下了", 3, "#ff0");
			
			if (take.attr.size[direction[0]+"1"] >= 100){
				take.attr.size[direction[0]+"1"] = 100;
				return print("手里方块太大拿不下了", "手里方块拿不下了", 3, "#ff0");
			}
		}
		
		//挖掘的物体 转化为 实体方块 （最后）
		let entityBlock;
		switch (thing.type){
			case "Block": //方块 转化为 实体方块
				entityBlock = thing.toEntityBlock();
				const pos = thing.block.mesh.position.clone(); //单位: px=cm
				deskgood.remove(thing);
				deskgood.place(entityBlock, pos.divideScalar(100)); //单位: m
				break;
			case "EntityBlock": //实体方块
				entityBlock = thing;
				break;
			case "Entity": //实体 无法挖掘 用事件特殊处理
				break;
		}
		entityBlock.set("attr", "size",direction,
			OR(entityBlock.get("attr", "size",direction), 100*direction[1]) //x0: 0, x1: 100
		); //保证有值
		
		//用方块挖掘
		if (hold && hold.type == "Block"){ //要叠加的方块 转化为 实体方块
			hold = deskgood.hold[select] = hold.toEntityBlock();
			hold.set("attr", "size", {});
		}
		
		//处理事件
		if ( eval(thing.get("attr", "onStartDig")) === false ) return;
		
		console.log("startDig", {thing, hold, direction},
			"idealDigSpeed:", idealDigSpeed*time.getSpeed(), "cm³/s, ", thingS/idealDigSpeed/time.getSpeed(), "s/cm") //现实时间
		
		//挖掘振动
		if (typeof plus != "undefined"){
			plus.device.vibrate(20);
		}else if ("vibrate" in navigator){
			navigator.vibrate(20);
		}
		
		deskgood.state.digging = true; //正在挖掘
		this.digThing = entityBlock; //正在挖掘的物体
		let t0 = time.getTime(); //（游戏时间）
		const func = ()=>{
			
			if (!take){
				const digGet = entityBlock.get("attr", "digGet");
				if (digGet){ //指定获得方块
					const {x0, x1, y0, y1, z0, z1} = entityBlock.get("attr", "entityBlock", "size") || {};
					take = new EntityBlock({
						name: entityBlock.get("attr", "digGet"), //挖掘获得 （仅name）
						attr: {
							size: {
								x1: (x1 || x0)? OR(x1, 100)-OR(x0, 0): undefined,
								y1: (y1 || y0)? OR(y1, 100)-OR(y0, 0): undefined,
								z1: (z1 || z0)? OR(z1, 100)-OR(z0, 0): undefined
							}
						}
					});
				}else{
					take = entityBlock.cloneAttr();
				}
				take.set("attr", "size", direction[0]+"1", 0); //x0,x1 -> x1
				deskgood.hold.add(take, free); //克隆一个放在手中
			}
			
			const t = (time.getTime()-t0) / 1000; //时间间隔（游戏时间） 单位: s
			t0 = time.getTime();
			let thick; //厚度（不超过剩下厚度）
			if (direction[1] == "0"){ //x0: 0->100
				thick = Math.limitRange(
					t / (thingS/idealDigSpeed*rnd_error()),
					0,
					OR(entityBlock.attr.size[direction[0] + "1"], 100) - //对面的大小
						entityBlock.attr.size[direction] //正面的大小
				);
			}else{ //x1: 100->0
				thick = Math.limitRange(
					t / (thingS/idealDigSpeed*rnd_error()),
					0,
					entityBlock.attr.size[direction] - //正面的大小
						OR(entityBlock.attr.size[direction[0] + "0"], 0) //对面的大小
				);
			}
			entityBlock.attr.size[direction] += (1 - direction[1]*2) * thick; //x0 -> 1, x1 -> -1
			take.attr.size[direction[0] + "1"] += thingS/takeS * thick; //x1: 0 ~> 100
			
			console.log("Digging", entityBlock.attr.size[direction], take.attr.size[direction])
			entityBlock.updateSize(); //更新大小
			deskgood.updateAttr(entityBlock); //更新属性
			
			//挖完了
			if (direction[1] == "0"){ //x0: ++
				if (entityBlock.attr.size[direction]
					>=
					OR(entityBlock.attr.size[direction[0] + "1"], 100)
				){ //挖掘结束
					time.clearInterval(this.digId);
					deskgood.state.digging = false; //挖掘结束
					deskgood.remove( entityBlock ); //删除方块
					return this.startDig(OR(touch.screen.x, undefined), OR(touch.screen.y, undefined)); //下一轮挖掘
				}
				
			}else{ //x1: --
				if (entityBlock.attr.size[direction]
					<=
					OR(entityBlock.attr.size[direction[0] + "0"], 0)
				){ //挖掘结束
					time.clearInterval(this.digId);
					deskgood.state.digging = false; //挖掘结束
					deskgood.remove( entityBlock ); //删除方块
					return this.startDig(OR(touch.screen.x, undefined), OR(touch.screen.y, undefined)); //下一轮挖掘
				}
			}
			
			//拿不下了
			if (take.attr.size[direction[0]+"1"] === undefined) //该方向为默认值
				return print("手里方块太大拿不下了", "手里方块拿不下了", 3, "#ff0");
			
			if (take.attr.size[direction[0]+"1"] >= 100){
				take.attr.size[direction[0]+"1"] = 100;
				return print("手里方块太大拿不下了", "手里方块拿不下了", 3, "#ff0");
			}
			
			const {x,y,z} = entityBlock.block.mesh.position.clone() .divideScalar(100).round(); //单位: m
			map.updateRound(x, y, z); //更新周围方块
			
			this.digId = time.setTimeout(func, thingS/idealDigSpeed*rnd_error()*1000).id; // 下一cm
			
		};
		this.digId = time.setTimeout(func, thingS/idealDigSpeed*rnd_error()*1000).id; // s/cm （游戏时间） 单位: ms
		
	},
	
	/* 结束挖掘 */
	endDig(){
		console.log("try endDig")
		
		//处理事件
		if ( this.digThing &&
			eval(this.digThing.get("attr", "onEndDig")) === false
		) return;
		
		console.log("endDig")
		deskgood.state.digging = false; //挖掘结束
		time.clearInterval(this.digId);
	},
	
	
	/* 开始放置 */
	placeThing: null, //放置的物体
	startPlace(x, y){
		console.log("try startPlace")
		
		//手上是否有效方块
		let hold = deskgood.hold[deskgood.hold.select] || this.placeThing;
		if ( !(hold instanceof Block) &&
			!(hold instanceof Entity) //非方块非实体（空气）
		) return;
		if (hold.type == "Block") //方块 转化为 实体方块
			hold = hold.toEntityBlock();
		
		if (this.placeThing)
			scene.remove(this.placeThing.block.mesh); //先删除方块
		
		//获取物体和方块
		const obj = ray2D(x, y).filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject, //物体对象
			sizeAttr = hold.get("attr", "size") || {},
			size = { //长宽高
				x: OR(sizeAttr.x1, 100) - OR(sizeAttr.x0, 0),
				y: OR(sizeAttr.y1, 100) - OR(sizeAttr.y0, 0),
				z: OR(sizeAttr.z1, 100) - OR(sizeAttr.z0, 0)
			};
		
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(-OR(size.x/2, 50), 0, 0)) ], "#ff0000");
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(OR(size.x/2, 50), 0, 0)) ], "#ff0000");
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(0, -OR(size.x/2, 50), 0)) ], "#00ff00");
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(0, OR(size.x/2, 50), 0)) ], "#00ff00");
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(0, 0, -OR(size.x/2, 50))) ], "#0000ff");
		// mark([ obj.point, obj.point.clone() .add(new THREE.Vector3(0, 0, OR(size.x/2, 50))) ], "#0000ff");
		
		const pos = obj.point.clone();
		switch (obj.faceIndex){
			case 0:
			case 1:
				// console.log("x+")
				pos.x += 3;
				break;
			case 2:
			case 3:
				// console.log("x-")
				pos.x -= 3;
				break;
			case 4:
			case 5:
				console.log("y+")
				pos.y += 3;
				break;
			case 6:
			case 7:
				// console.log("y-")
				pos.y -= 3;
				break;
			case 8:
			case 9:
				// console.log("z+")
				pos.z += 3;
				break;
			case 10:
			case 11:
				// console.log("z-")
				pos.z -= 3;
				break;
			default:
				throw ["faceIndex wrong:", obj.faceIndex];
		}
		// console.log(pos)
		const objs = {
			x0: ray3D(obj.point.clone().add( new THREE.Vector3(1,0,0) ), //x++
					{x: -1},
					0,
					size.x/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0],
				
			x1: ray3D(obj.point.clone().add( new THREE.Vector3(-1,0,0) ), //x--
					{x: 1},
					0,
					size.x/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0],
				
			y0: ray3D(obj.point.clone().add( new THREE.Vector3(0,1,0) ), //y++
					{y: -1},
					0,
					size.y/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0],
				
			y1: ray3D(obj.point.clone().add( new THREE.Vector3(0,-1,0) ), //y--
					{y: 1},
					0,
					size.y/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0],
				
			z0: ray3D(obj.point.clone().add( new THREE.Vector3(0,0,1) ), //z++
					{z: -1},
					0,
					size.z/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0],
				
			z1: ray3D(obj.point.clone().add( new THREE.Vector3(0,0,-1) ), //z--
					{z: 1},
					0,
					size.z/2
				).filter(obj => obj.object instanceof THREE.Mesh)[0]
		};
		
		if (objs.x0 && objs.x1) return;
		if (objs.y0 && objs.y1) return;
		if (objs.z0 && objs.z1) return;
		
		if (objs.x0){
			// mark(objs.x0.object, "#ff0000");
			pos.x = objs.x0.point.x + size.x/2;
		}else if (objs.x1){
			// mark(objs.x1.object, "#ff0000");
			pos.x = objs.x1.point.x - size.x/2;
		}
		
		if (objs.y0){
			// mark(objs.y0.object, "#00ff00");
			pos.y = objs.y0.point.y + size.y/2;
		}else if (objs.y1){
			// mark(objs.y1.object, "#00ff00");
			pos.y = objs.y1.point.y - size.y/2;
		}
		
		if (objs.z0){
			// mark(objs.z0.object, "#0000ff");
			pos.z = objs.z0.point.z + size.z/2;
		}else if (objs.z1){
			// mark(objs.z1.object, "#0000ff");
			pos.z = objs.z1.point.z - size.z/2;
		}
		
		pos.x += -size.x/2 + 50,
		pos.y += -size.y/2 + 50,
		pos.z += -size.z/2 + 50;
		
		// mark(pos, 200);
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "onStartPlace")) === false
		) return;
		
		const distanceSquared = pos.distanceToSquared( deskgood.pos ); //距离的平方 单位: px²=cm²
		//是否超出手长
		if ( distanceSquared >= deskgood.handLength * deskgood.handLength
		) return; //距离^2 >= 手长^2  单位: px=cm
		
		//是否在头上 且 不可穿过
		if ( distanceSquared < 0.5*0.5 && //距离^2 < 0.5^2 单位: m
			hold.get("attr", "through") !== true
		) return print("想窒息吗？还往头上放方块！", "往头上放方块", 3); //放到头上
		
		console.log("startPlace")
		deskgood.state.placing = true; //放置开始
		
		if (this.placeThing){
			this.placeThing.makeGeometry().updateSize().makeMesh();
			this.placeThing.block.mesh.position.copy(pos); //单位: px=cm
			scene.add(this.placeThing.block.mesh); //重新放置方块 单位:m
			
		}else{
			deskgood.hold.delete(deskgood.hold.select); //删除手里的方块
			
			hold.makeGeometry().updateSize().makeMesh();
			hold.block.mesh.position.copy(pos); //单位: px=cmm
			scene.add(hold.block.mesh); //放置方块
			
			this.placeThing = hold;
		}
	},
	
	/* 结束放置 */
	endPlace(){
		console.log("try endPlace")
		
		if (!this.placeThing) return; //无正在放置物体
		
		console.log("endPlace")
		
		const pos = this.placeThing.block.mesh.position.clone() .divideScalar(100); //单位: m
		scene.remove(this.placeThing.block.mesh);
		
		if ( this.placeThing.type == "EntityBlock" &&
			Object.every( pos, (v)=> NEAR(v, Math.round(v)) ) && //位置为整数
			Object.every( this.placeThing.attr.size||{}, (v,i)=> !v || NEAR(v, i[1]*100) ) //大小为默认
		){ //可转化为 方块
			this.placeThing = this.placeThing.toBlock();
			pos.round();
		}
		
		deskgood.place(this.placeThing, pos); //放置方块 单位:m
		deskgood.hold.delete(deskgood.hold.select); //删除手里的方块
		deskgood.state.placing = false; //放置开始
		this.placeThing = null;
	},
	
	/* 取消放置 */
	cancelPlace(){
		if (!this.placeThing) return; //无正在放置物体
		
		console.log("cancelPlace")
		scene.remove(this.placeThing.block.mesh); //删除方块
		deskgood.state.placing = false; //放置结束
		this.placeThing = null;
	},
	
	
	
	/**
	* 时间
	*/
	/* 重置时间 */
	resetTime(){
		console.log("鼠标中键按下");
		time.changeSpeed(1);
	},
	
	
	
	/**
	* 选择
	*/
	/* 上一个 */
	choicePrev(){
		if ( keydown.key.has(16) ){ //shift
			console.log("shift+上滚轮");
			
			//处理事件
			if (Events.onTimeSpeedIncrease && Events.onTimeSpeedIncrease() === false)
				return;
			
			time.changeSpeed( time.nextSpeed*1.5 ); //时间流逝加速
			
		}else if ( keydown.key.has(18) ){ //alt
			console.log("alt+上滚轮");
			const {hold, choice} = deskgood,
				nextChoice = Math.modRange(choice-1, 0, deskgood.hold.length); //左闭右开区间
			
			//处理事件
			if ( hold[choice] &&
				eval(hold[choice].get("attr", "onExchangeLeave")) === false //取消事件
			) return;
			if ( hold[nextChoice] && //不是null空气
				eval(hold[nextChoice].get("attr", "onExchangeTo")) === false //取消事件
			) return;
			
			//交换
			[ hold[choice], hold[nextChoice] ] = [ hold[nextChoice], hold[choice] ];
			deskgood.hold.select = nextChoice;
			hold.update(); //更新
			
		}else{
			console.log("上滚轮");
			deskgood.hold.selectSub();
		}
	},
	
	/* 下一个 */
	choiceNext(){
		if ( keydown.key.has(16) ){ //shift
			console.log("shift+下滚轮");
			
			//处理事件
			if (Events.onTimeSpeedReduce && Events.onTimeSpeedReduce() === false)
				return;
			
			time.changeSpeed( time.nextSpeed/1.5 ); //时间流逝减慢
			
		}else if ( keydown.key.has(18) ){ //alt
			console.log("alt+下滚轮");
			const {hold, choice} = deskgood,
				nextChoice = Math.modRange(choice+1, 0, deskgood.hold.length); //左闭右开区间
			
			//处理事件
			if ( hold[choice] &&
				eval(hold[choice].get("attr", "onExchangeLeave")) === false //取消事件
			) return;
			if ( hold[nextChoice] && //不是null空气
				eval(hold[nextChoice].get("attr", "onExchangeTo")) === false //取消事件
			) return;
			
			//交换
			[ hold[choice], hold[nextChoice] ] = [ hold[nextChoice], hold[choice] ];
			deskgood.hold.select = nextChoice;
			hold.update(); //更新
			
		}else{
			console.log("下滚轮");
			deskgood.hold.selectAdd();
		}
	},
	
};
