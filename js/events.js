const Events = {
	/**
	* 通用操作
	*/
	digId: null,
	/* 开始挖掘 */
	startDig(){
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject, //物体对象
			hold = deskgood.hold[deskgood.choice]; //挖掘工具
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "block", "onStartDig")) === false
		) return;
		
		//是否超出手长
		if ( obj.object.position .distanceToSquared( deskgood.pos )
			>= deskgood.handLength * deskgood.handLength
		) return; //距离**2 >= 手长**2 单位:px=cm
		
		//手上空闲
		const free = !deskgood.hold[deskgood.choice]? deskgood.choice: deskgood.hold.indexOf(null);
		if (free == -1){
			console.warn("deskgood's hands is full!")
			return print("拿不下方块", "两只手拿4m³方块已经够多了，反正我是拿不下了", 3);
		}
		
		const digSpeed = thing.get("attr", "block", "digSpeed", hold? hold.name: "手"); //挖掘速度cm(cm³/s)
		if (!digSpeed)
			return print("无法挖掘", "当前工具无法挖掘该方块", 3, "#f00");
		
		console.log("startDig","digSpeed:", digSpeed, "cm³/s, ", 1000*1000/digSpeed, "s/cm")
		
		this.digId = time.setInterval(()=>{
			if (thing.attr.entityBlock.size.y1 <= 0){
				deskgood.hold.addOne(thing.clone(), free); //克隆一个放在手中
				deskgood.remove( thing ); //删除方块
				time.clearInterval(this.digId);
			}
			thing.attr.entityBlock.size.y1 -= 1;
			console.log("Digging", thing.attr.entityBlock.size.y1)
			map.updateSize(thing);
		}, 1000*1000/digSpeed*1000); //挖1cm厚
	},
	
	
	/* 结束挖掘 */
	endDig(){
		const obj = ray2D().filter(obj => obj.object instanceof THREE.Mesh)[0]; //Mesh物体
		if (!obj) return;
		
		const thing = obj.object.userData.thingObject; //物体对象
		
		//处理事件
		if ( thing &&
			eval(thing.get("attr", "block", "onEndDig")) === false
		) return;
		
		time.clearInterval(this.digId);
		console.log("endDig")
	},
	
	
	
	/* 开始放置 */
	startPlace(){
		//手上是否有效方块
		const hold = deskgood.hold[deskgood.choice];
		if ( !(hold instanceof Block) &&
			!(hold instanceof Entity) //非方块非实体（空气）
		) return;
		
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
		)  return print("往头上放方块", "想窒息吗？还往头上放方块！"); //放到头上
		
		//是否在腿上 且 不可穿过
		if ( pos.distanceToSquared( deskgood.pos.clone() .divideScalar(100).add(new THREE.Vector3(0,-1,0) ) )
			< 0.5*0.5 && //距离**2 < 0.5**2 单位:m
			hold.get("attr", "block", "through") !== true
		)  return print("往腿上放方块", "想卡死吗？还往腿上放方块！"); //放到头上
		
		deskgood.place(hold, pos); //放置方块 单位:m
		
		deskgood.hold.delete(deskgood.choice); //删除手里的方块
	},
	
	
	/* 结束放置 */
	endPlace(){
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
	},
	
	
	
	
	/**
	* 鼠标操作
	*/
	/* 上滚轮 */
	mouseWheelScrollUp(){
		if ( keydown.key.has(16) ){ //shift
			console.log("上滚轮+shift");
			time.setSpeed(time.speed*1.5); //时间流逝加速
			console.log("time speed:", `${time.speed}s/s\n=${time.speed/60}min/s\n=${time.speed/3600}h/s\n=${time.speed/3600/24}day/s\n=${time.speed/3600/24/365.25}year/s`)
			
		}else{
			console.log("上滚轮");
			let before = deskgood.choice; //之前的选择
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
			console.log("下滚轮+shift");
			time.setSpeed(time.speed/1.5); //时间流逝减慢
			console.log("time speed:", `${time.speed}s/s\n=${time.speed/60}min/s\n=${time.speed/3600}h/s\n=${time.speed/3600/24}day/s\n=${time.speed/3600/24/365.25}year/s`)
			
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
	}
};