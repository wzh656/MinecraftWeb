const Events = {
	/**
	* 挖掘
	*/
	digging: false, //正在挖掘
	digThing: null, //正在挖掘的物体
	digId: null,
	/* 开始挖掘 */
	startDig(x, y){
		console.log("try startDig")
		
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
		
		const thing = obj.object.userData.thingObject, //物体对象
			hold = deskgood.hold[deskgood.choice]; //挖掘工具
		
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
			free = deskgood.choice;
			idealDigSpeed = thing.get("attr", "block", "idealDigSpeed", "手");
			
			//实体无法用于挖掘
		}else if (hold.type == "Entity"){
			return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#f00");
			
			//用工具挖掘
		}else if (hold.type == "Tool"){
			const left = deskgood.hold[deskgood.choice-1];
			if (left &&
				hold.name == left.name && //同种方块
				hold.get("attr", "stackable") == true //可叠加
			){ //放在左边
				free = deskgood.choice - 1;
				take = left;
			}else{ //放在空位
				free = deskgood.hold.indexOf(null);
				if (free == -1)
					return print("东西太多，我拿不下了", "拿不下方块", 3, "#f00");
			}
			idealDigSpeed = thing.get("attr", "block", "idealDigSpeed", hold.name);
			
			//方块或实体方块
		}else{
			if (hold.name != (thing.get("attr", "block", "digGet") || thing.name) || //非同种物体
				hold.get("attr", "stackable") != true //不可叠加
			) return print("当前方块无法叠加", "无法挖掘", 3, "#f00");
			
			if (deskgood.hold.indexOf(null) == -1) //空出手来挖
				return print("东西太多，我没办法空出手来挖了", "没手挖方块", 3, "#f00");
			
			free = deskgood.choice; //挖到叠加
			idealDigSpeed = thing.get("attr", "block", "idealDigSpeed", "手"); //用手挖掘
			take = hold;
			if (hold.type == "Block") //要叠加的方块 转化为 实体方块
				hold = deskgood.hold[deskgood.choice] = hold.toEntityBlock();
		}
		if (!idealDigSpeed)
			return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#f00");
		
		//挖掘的物体 转化为 实体方块
		let entityBlock;
		switch (thing.type){
			case "Block": //方块 转化为 实体方块
				entityBlock = thing.toEntityBlock();
				const pos = thing.block.mesh.position.clone(); //单位: px=cm
				map.delete(thing);
				map.addID(entityBlock, pos.divideScalar(100)); //单位: m
				break;
			case "EntityBlock": //实体方块
				entityBlock = thing;
				break;
			case "Entity": //实体 无法挖掘 用事件特殊处理
				break;
		}
		entityBlock.set("attr","entityBlock","size",direction,
			entityBlock.get("attr","entityBlock","size",direction) || 100*direction[1] //x0: 0, x1: 100
		); //保证有值
		
		const thingS = ((entityBlock.get("attr","entityBlock","size", side[0]+"1") || 100) -
				(entityBlock.get("attr","entityBlock","size", side[0]+"0") || 0)) *
			((entityBlock.get("attr","entityBlock","size", side[1]+"1") || 100) -
				(entityBlock.get("attr","entityBlock","size", side[1]+"0") || 0)), //挖掘面积
			takeS = take?
				((take.get("attr","entityBlock","size", side[0]+"1") || 100) -
					(take.get("attr","entityBlock","size", side[0]+"0") || 0)) *
				((take.get("attr","entityBlock","size", side[1]+"1") || 100) -
					(take.get("attr","entityBlock","size", side[1]+"0") || 0))
				:thingS; //拿走物体面积
		
		this.digging = true; //正在挖掘
		this.digThing = entityBlock; //正在挖掘的物体
		console.log("startDig", {thing, hold, direction},
			"idealDigSpeed:", idealDigSpeed*time.getSpeed(), "cm³/s, ", thingS/idealDigSpeed/time.getSpeed(), "s/cm") //现实时间
		
		//处理事件
		if ( eval(thing.get("attr", "block", "onStartDig")) === false ) return;
		
		//挖掘振动
		if (typeof plus != "undefined"){
			plus.device.vibrate(20);
		}else if ("vibrate" in navigator){
			navigator.vibrate(20);
		}
		
		//挖掘
		const func = ()=>{
			
			if (!take){
				const digGet = entityBlock.get("attr", "block", "digGet");
				if (digGet){ //指定获得方块
					take = new EntityBlock({
						name: entityBlock.get("attr", "block", "digGet"), //挖掘获得 （仅name）
						attr: {
							entityBlock: {
								size: entityBlock.get("attr", "entityBlock", "size")
							}
						}
					});
				}else{
					take = entityBlock.cloneAttr();
				}
				take.set("attr","entityBlock","size", direction[0]+"1", 0); //x0,x1 -> x1
				deskgood.hold.addOne(take, free); //克隆一个放在手中
			}
			
			entityBlock.attr.entityBlock.size[direction] += 1-direction[1]*2; //x0 -> 1, x1 -> -1
			take.attr.entityBlock.size[direction[0] + "1"] += thingS/takeS; //x1: 0 ~> 100
			
			console.log("Digging", entityBlock.attr.entityBlock.size[direction], take.attr.entityBlock.size[direction])
			entityBlock.updateSize(); //更新大小
			
			if (direction[1] == "0"){ //x0: ++
				if (entityBlock.attr.entityBlock.size[direction]
					>=
					entityBlock.attr.entityBlock.size[direction[0] + "1"]
				){ //挖掘结束
					time.clearInterval(this.digId);
					this.digging = false; //挖掘结束
					deskgood.remove( entityBlock ); //删除方块
					return this.startDig(); //下一轮挖掘
				}
				
			}else{ //x1: --
				if (entityBlock.attr.entityBlock.size[direction]
					<=
					entityBlock.attr.entityBlock.size[direction[0] + "0"]
				){ //挖掘结束
					time.clearInterval(this.digId);
					this.digging = false; //挖掘结束
					deskgood.remove( entityBlock ); //删除方块
					return this.startDig(); //下一轮挖掘
				}
			}
			
			const {x,y,z} = entityBlock.block.mesh.position.clone() .divideScalar(100).round(); //单位: m
			map.updateRound(x, y, z); //更新周围方块
			
			this.digId = time.setTimeout(func, thingS/idealDigSpeed*rnd_error()*1000).id; // 下一cm
			
		};
		this.digId = time.setTimeout(func, thingS/idealDigSpeed*rnd_error()*1000).id; // s/cm 游戏时间 单位: ms
		
	},
	
	/* 结束挖掘 */
	endDig(){
		console.log("try endDig")
		
		//处理事件
		if ( this.digThing &&
			eval(this.digThing.get("attr", "block", "onEndDig")) === false
		) return;
		
		console.log("endDig")
		this.digging = false; //挖掘结束
		time.clearInterval(this.digId);
	},
	
	
	placing: false, //正在放置
	placeThing: null, //正在放置的物体
	/* 开始放置 */
	startPlace(x, y){
		console.log("try startPlace")
		
		//手上是否有效方块
		const hold = deskgood.hold[deskgood.choice];
		if ( !(hold instanceof Block) &&
			!(hold instanceof Entity) //非方块非实体（空气）
		) return;
		
		//获取物体和方块
		const obj = ray2D(x, y).filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject, //物体对象
			pos = obj.object.position.clone() .divideScalar(100); //单位:m
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "block", "onStartPlace")) === false
		) return;
		
		//转换为真正选中位置
		switch (obj.faceIndex){
			case 0:
			case 1:
				pos.x++; //单位:m
				break;
			case 2:
			case 3:
				pos.x--;
				break;
			case 4:
			case 5:
				pos.y++;
				break;
			case 6:
			case 7:
				pos.y--;
				break;
			case 8:
			case 9:
				pos.z++;
				break;
			case 10:
			case 11:
				pos.z--;
				break;
		}
		
		//是否超出手长
		if ( pos.clone() .multiplyScalar(100)
				.distanceToSquared( deskgood.pos )
			>= deskgood.handLength * deskgood.handLength
		) return; //距离**2 >= 手长**2  单位:px=cm
		
		//是否在头上 且 不可穿过
		if ( pos.distanceToSquared( deskgood.pos.clone() .divideScalar(100) )
			< 0.5*0.5 && //距离**2 < 0.5**2 单位:m
			hold.get("attr", "block", "through") !== true
		)  return print("想窒息吗？还往头上放方块！", "往头上放方块", 3); //放到头上
		
		//是否在腿上 且 不可穿过
		if ( pos.distanceToSquared( deskgood.pos.clone() .divideScalar(100).add(new THREE.Vector3(0,-1,0) ) )
			< 0.5*0.5 && //距离**2 < 0.5**2 单位:m
			hold.get("attr", "block", "through") !== true
		)  return print("想卡死吗？还往腿上放方块！", "往腿上放方块"); //放到腿上
		
		this.digThing = hold; //正在放置的物体
		this.placing = true; //正在放置
		
		deskgood.place(hold, pos); //放置方块 单位:m
		deskgood.hold.delete(deskgood.choice); //删除手里的方块
		
		this.placing = false; //结束放置
	},
	
	/* 结束放置 */
	endPlace(){
		console.log("try endPlace")
		
		//处理事件
		if ( this.placeThing &&
			eval(this.placeThing.get("attr", "block", "onEndPlace")) === false
		) return;
		
		this.placing = false; //结束放置
		
		console.log("endPlace")
	},
	
	
	
	/**
	* 时间
	*/
	/* 重置时间 */
	resetTime(){
		console.log("鼠标中键按下");
		time.tmpSpeed = 1;
	},
	
	
	
	/**
	* 选择
	*/
	/* 上一个 */
	choicePrev(){
		if ( keydown.key.has(16) ){ //shift
			console.log("shift+上滚轮");
			time.tmpSpeed *= 1.5; //时间流逝加速
			
		}else{
			console.log("上滚轮");
			const before = deskgood.choice; //之前的选择
			if ( deskgood.hold[before] && //切换前事件
				eval(deskgood.hold[before].get("attr", "onChangeLeave")) === false //取消事件
			) return;
			
			deskgood.choice--;
			if (deskgood.choice < 0)
				deskgood.choice = 3;
			
			if ( deskgood.hold[deskgood.choice] && //切换后事件
				eval(deskgood.hold[deskgood.choice].get("attr", "onChangeTo")) === false //取消事件
			) return (deskgood.choice = before); //恢复之前选择
			
			deskgood.hold.update(); //更新选择
		}
	},
	
	/* 下一个 */
	choiceNext(){
		if ( keydown.key.has(16) ){ //shift
			console.log("shift+下滚轮");
			time.tmpSpeed /= 1.5; //时间流逝减慢
			
		}else{
			console.log("下滚轮");
			const before = deskgood.choice;
			if ( deskgood.hold[before] && //切换前事件
				eval(deskgood.hold[before].get("attr", "onChangeLeave")) === false //取消事件
			) return;
			
			deskgood.choice++;
			if (deskgood.choice > 3)
				deskgood.choice = 0;
			
			if ( deskgood.hold[deskgood.choice] && //切换后事件
				eval(deskgood.hold[deskgood.choice].get("attr", "onChangeTo")) === false //取消事件
			) return (deskgood.choice = before); //恢复之前选择
			
			deskgood.hold.update(); //更新选择
		}
	},
	
};
