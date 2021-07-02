const Events = {
	/**
	* 通用操作
	*/
	digging: false, //正在挖掘
	digId: null,
	/* 开始挖掘 */
	startDig(){
		console.log("try startDig")
		
		//获取物体和方块
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject, //物体对象
			hold = deskgood.hold[deskgood.choice]; //挖掘工具
		
		//是否超出手长
		if ( obj.object.position .distanceToSquared( deskgood.pos )
			>= deskgood.handLength * deskgood.handLength
		) return; //距离**2 >= 手长**2 单位:px=cm
		
		let free, //手上空闲位置
			digSpeed; //挖掘速度 单位: cm³/s
		if (hold == null){
			free = deskgood.choice;
			digSpeed = thing.get("attr", "block", "digSpeed", "手");
			
		}else if (hold.type == "Entity"){ //实体无法用于挖掘
			return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#f00");
			
		}else if (hold.type == "Tool"){ //工具挖掘
			free = deskgood.hold.indexOf(null);
			if (free == -1)
				return print("东西太多，我拿不下了", "拿不下方块", 3, "#f00");
			digSpeed = thing.get("attr", "block", "digSpeed", hold.name);
			
		}else{ //方块或实体方块
			if (hold.name != thing.name || hold.get("attr", "stackable") != true) //非同种物体 或 不可叠加
				return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#f00");
			if (deskgood.hold.indexOf(null) == -1) //空出手来挖
				return print("东西太多，我没手挖了", "没手挖方块", 3, "#f00");
			free = deskgood.choice; //挖到叠加
			digSpeed = thing.get("attr", "block", "digSpeed", "手"); //用手挖掘
			if (hold.type == "Block") //方块 变为 实体方块
				hold = deskgood.hold[deskgood.choice] = hold.toEntityBlock();
		}
		
		if (!digSpeed)
			return print("当前工具无法挖掘该方块", "无法挖掘", 3, "#f00");
		
		this.digging = true; //正在挖掘
		
		console.log("startDig", thing, hold, "digSpeed:", digSpeed*time.getSpeed(), "cm³/s, ", 1e6/digSpeed/time.getSpeed(), "s/cm")
		
		//转化为实体方块
		let entityBlock;
		switch (thing.type){
			case "Block": //方块 转化为实体方块
				entityBlock = new EntityBlock(thing);
				const pos = thing.block.mesh.position.clone(); //单位: px=cm
				map.delete(thing);
				map.addID(entityBlock, pos.divideScalar(100)); //单位: m
				break;
			case "EntityBlock": //实体方块
				entityBlock = thing;
				break;
			case "Entity": //实体
				break;
		}
		
		//处理事件
		if ( eval(thing.get("attr", "block", "onStartDig")) === false ) return;
		
		//挖掘
		entityBlock.set("attr","entityBlock","size","y1", entityBlock.get("attr","entityBlock","size","y1")||100);
		let take = hold; //拿走的方块
		this.digId = time.setInterval(()=>{
			
			if (!take){
				take = entityBlock.cloneAttr();
				take.set("attr","entityBlock","size","y1", 0);
				deskgood.hold.addOne(take, free); //克隆一个放在手中
			}
			
			entityBlock.attr.entityBlock.size.y1 -= 1;
			take.attr.entityBlock.size.y1 += 1;
			
			console.log("Digging", entityBlock.attr.entityBlock.size.y1, take.attr.entityBlock.size.y1)
			entityBlock.updateSize(); //更新大小
			
			if (entityBlock.attr.entityBlock.size.y1 <= 0){ //挖掘结束
				console.log("endDig")
				time.clearInterval(this.digId);
				this.digging = false; //挖掘结束
				return deskgood.remove( entityBlock ); //删除方块
			}
			
			const {x,y,z} = entityBlock.block.mesh.position.clone() .divideScalar(100).round(); //单位: m
			map.updateRound(x, y, z); //更新周围方块
			
		}, 1000*1000/digSpeed*1000).id; //挖1cm厚
		
		console.log(this.digId, time.ids[this.digId])
	},
	
	
	/* 结束挖掘 */
	endDig(){
		console.log("try endDig")
		
		//获取物体和方块
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject; //物体对象
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "block", "onEndDig")) === false
		) return;
		
		console.log("endDig")
		this.digging = false; //挖掘结束
		time.clearInterval(this.digId);
	},
	
	
	
	placing: false, //正在放置
	/* 开始放置 */
	startPlace(){
		console.log("try startPlace")
		
		//手上是否有效方块
		const hold = deskgood.hold[deskgood.choice];
		if ( !(hold instanceof Block) &&
			!(hold instanceof Entity) //非方块非实体（空气）
		) return;
		
		//获取物体和方块
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
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
			default:
				throw ["faceIndex wrong:", obj.faceIndex];
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
		
		this.placing = true; //正在放置
		
		deskgood.place(hold, pos); //放置方块 单位:m
		deskgood.hold.delete(deskgood.choice); //删除手里的方块
		
		this.placing = false; //结束放置
	},
	
	
	/* 结束放置 */
	endPlace(){
		console.log("try endPlace")
		
		//获取物体和方块
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject, //物体对象
			pos = obj.object.position.clone() .divideScalar(100); //单位:m
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "block", "onEndPlace")) === false
		) return;
		
		//转换为真正选中位置
		switch (obj.faceIndex){
			case 0:
			case 1:
				pos.x++;
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
			default:
				throw ["faceIndex wrong:", obj.faceIndex];
		}
		
		this.placing = false; //结束放置
		
		console.log("endPlace")
	},
	
	
	
	
	/**
	* 鼠标操作
	*/
	/* 上滚轮 */
	mouseWheelScrollUp(){
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
	
	
	/* 下滚轮 */
	mouseWheelScrollDown(){
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
	
	
	/* 鼠标中键按下 */
	mouseWheelDown(){
		console.log("鼠标中键按下");
		time.tmpSpeed = 1;
	}
};
