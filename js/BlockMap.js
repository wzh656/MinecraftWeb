function BlockMap(size, seed, perloadLength){
	//一区块大小
	this.size = {};
	this.size.x = Math.round(size[1].x - size[0].x)+1;
	this.size.y = Math.round(size[1].y - size[0].y)+1;
	this.size.z = Math.round(size[1].z - size[0].z)+1;
	this.size[0] = {};
	this.size[1] = {};
	this.size[0].x = Math.round(size[0].x); //-8
	this.size[0].y = Math.round(size[0].y); //0
	this.size[0].z = Math.round(size[0].z); //-8
	this.size[1].x = Math.round(size[1].x); //8
	this.size[1].y = Math.round(size[1].y); //32
	this.size[1].z = Math.round(size[1].z); //8
	
	//所有方块
	this.map = [];
	//已初始化的区块
	this.initedZone = [];
	//活动区块（加载完毕）
	this.activeZone = [];
	//区块预加载范围
	this.perloadLength = perloadLength;
	//种子设置
	if (seed){
		this.seed = {
			seed: seed.seed,
			h: {
				max: seed.height.max,
				min: seed.height.min,
				//ave: seed.height.ave,
				/*de: seed.height.de,*/
				q: seed.height.q,
				e: {
					max: seed.height.error.max,
					min: seed.height.error.min,
					q: seed.height.error.q
				}
			},
			s: {
				max: seed.scale.max,
				min: seed.scale.min,
				/*ave: seed.scale.ave,
				de: seed.scale.de,*/
				q: seed.scale.q,
				e: {
					max: seed.scale.error.max,
					min: seed.scale.error.min,
					q: seed.scale.error.q
				}
			},
			t: {
				max: 2,
				min: 0,
				forest: seed.type.forest,
				grassland: seed.type.grassland,
				desert: seed.type.desert,
				q: seed.type.q
			},
			tH: {
				plt:{
					min: seed.treeHeight.plant.min,
					max: seed.treeHeight.plant.max
				},
				max: seed.treeHeight.max,
				min: seed.treeHeight.min,
				q: seed.treeHeight.q,
				e: {
					max: seed.treeHeight.error.max,
					min: seed.treeHeight.error.min,
					q: seed.treeHeight.error.q
				}
			},
			oS: {
				max: seed.openStone.max,
				min: seed.openStone.min,
				q: seed.openStone.q
			},
			lS: {
				max: seed.leavesScale.max,
				min: seed.leavesScale.min,
				q: seed.leavesScale.q,
				e: {
					max: seed.leavesScale.error.max,
					min: seed.leavesScale.error.min,
					q: seed.leavesScale.error.q
				}
			}
		};
		this.seed.noise = new SimplexNoise(this.seed.seed);
		/* this.seed.h.k = (this.seed.h.max - this.seed.h.min)/2;
		this.seed.h.b = (this.seed.h.max + this.seed.h.min)/2;
		this.seed.s.k = (this.seed.s.max - this.seed.s.min)/2;
		this.seed.s.b = (this.seed.s.max + this.seed.s.min)/2; */
		this.seed.h.k = this.seed.h.max - this.seed.h.min;
		this.seed.h.b = this.seed.h.min;
		this.seed.h.e.k = (this.seed.h.e.max - this.seed.h.e.min)/2;
		this.seed.h.e.b = (this.seed.h.e.max + this.seed.h.e.min)/2;
		
		this.seed.s.k = (this.seed.s.max - this.seed.s.min)/2;
		this.seed.s.b = (this.seed.s.max + this.seed.s.min)/2;
		this.seed.s.e.k = (this.seed.s.e.max - this.seed.s.e.min)/2;
		this.seed.s.e.b = (this.seed.s.e.max + this.seed.s.e.min)/2;
		
		this.seed.tH.k = (this.seed.tH.max - this.seed.tH.min)/2;
		this.seed.tH.b = (this.seed.tH.max + this.seed.tH.min)/2;
		this.seed.tH.e.k = (this.seed.tH.e.max - this.seed.tH.e.min)/2;
		this.seed.tH.e.b = (this.seed.tH.e.max + this.seed.tH.e.min)/2;
		
		this.seed.oS.k = (this.seed.oS.max - this.seed.oS.min)/2;
		this.seed.oS.b = (this.seed.oS.max + this.seed.oS.min)/2;
		
		this.seed.lS.k = (this.seed.lS.max - this.seed.lS.min)/2;
		this.seed.lS.b = (this.seed.lS.max + this.seed.lS.min)/2;
		this.seed.lS.e.k = (this.seed.lS.e.max - this.seed.lS.e.min)/2;
		this.seed.lS.e.b = (this.seed.lS.e.max + this.seed.lS.e.min)/2;
	}
	
	
	
	//获取方块（不可编辑）
	this.get = (x, y, z)=>{  // 没有方块:null,不在范围:undefined,加载中:false
		[x, y, z] = [x, y, z].map(Math.round); //规范化
		
		try{
			/*if (this.map[x][y][z] === undefined){
				return undefined;
			}else if (this.map[x][y][z] === null){
				return null;
			}else if (this.map[x][y][z] === false){
				return false;
			}else{*/
				return this.map[x][y][z];
			//}
		}catch(err){ //超过范围
			return undefined;
		}
	};
	
	//添加方块
	this.add = (thing, pos, type=true, attr)=>{
		[pos.x, pos.y, pos.z] = [pos.x, pos.y, pos.z].map(Math.round); //规范化
		
		if (this.get(pos.x, pos.y, pos.z) === undefined) return;
		if ( this.get(pos.x, pos.y, pos.z) ){ //有方块
			if (type){ //替换
				for (let i of this.map[pos.x][pos.y][pos.z].block.mesh.material)
					i.dispose();
				this.map[pos.x][pos.y][pos.z].block.mesh.geometry.dispose(); //清除内存
				scene.remove(this.map[pos.x][pos.y][pos.z].block.mesh);
				this.map[pos.x][pos.y][pos.z] = null;
			}else{ //不替换
				return;
			}
		}
		
		thing.block.mesh.position.x = pos.x*100;
		thing.block.mesh.position.y = pos.y*100;
		thing.block.mesh.position.z = pos.z*100;
		
		this.map[pos.x][pos.y][pos.z] = thing;
		scene.add(thing.block.mesh); //网格模型添加到场景中
		thing.block.addTo = true;
	};
	//根据 模板和ID 添加方块
	this.addID = (id, pos, template, type=true, attr={})=>{
		if (typeof type != "boolean"){
			[type, attr] = [undefined, type];
		}
		// if (!attr.block) attr.block = {};
		if (id == 0){
			[pos.x, pos.y, pos.z] = [pos.x, pos.y, pos.z].map(Math.round); //规范化
			if ( this.get(pos.x, pos.y, pos.z) ){ //有方块
				for (let i of this.map[pos.x][pos.y][pos.z].block.mesh.material)
					i.dispose();
				this.map[pos.x][pos.y][pos.z].block.mesh.geometry.dispose(); //清除内存
				scene.remove(this.map[pos.x][pos.y][pos.z].block.mesh);
			}
			this.map[pos.x][pos.y][pos.z] = null; //空气
			return;
		}
		
		let thing = new Thing({id}, template[id])
			.makeMaterial()
			.deleteTexture()
			.makeMesh();
		this.add(
			thing,
			{
				x:pos.x,
				y:pos.y,
				z:pos.z,
			},
			type,
			attr
		); //以模板建立
	};
	
	//删除方块
	this.delete = (x, y, z)=>{
		[x, y, z] = [x, y, z].map(Math.round); //规范化
		
		if (!this.get(x,y,z)) // 没有方块(null)/不在范围(undefined)/加载中(false)
			return;
		
		for (let i of this.map[x][y][z].block.mesh.material)
			i.dispose();
		this.map[x][y][z].block.mesh.geometry.dispose(); //清除内存
		scene.remove(this.map[x][y][z].block.mesh);
		this.map[x][y][z] = null;
	};
	
	
	//更新方块
	this.update = (x, y, z)=>{
		[x, y, z] = [x, y, z].map(Math.round); //规范化
		
		if (!this.get(x,y,z)) // 没有方块(null)/不在范围(undefined)/加载中(false)
			return;
		
		this.map[x][y][z].block.material[0].visible = !( this.get(x+1, y, z) && !this.get(x+1, y, z).attr.block.transparent);
		this.map[x][y][z].block.material[1].visible = !( this.get(x-1, y, z) && !this.get(x-1, y, z).attr.block.transparent);
		this.map[x][y][z].block.material[2].visible = !( this.get(x, y+1, z) && !this.get(x, y+1, z).attr.block.transparent);
		this.map[x][y][z].block.material[3].visible = !( this.get(x, y-1, z) && !this.get(x, y-1, z).attr.block.transparent);
		this.map[x][y][z].block.material[4].visible = !( this.get(x, y, z+1) && !this.get(x, y, z+1).attr.block.transparent);
		this.map[x][y][z].block.material[5].visible = !( this.get(x, y, z-1) && !this.get(x, y, z-1).attr.block.transparent);
		if (this.map[x][y][z].block.addTo == true && this.map[x][y][z].block.material.every(value => !value.visible)){ //已加入 且 可隐藏
			scene.remove(this.map[x][y][z].block.mesh);
			this.map[x][y][z].block.addTo = false;
			// console.log("隐藏", this.map[x][y][z])
		}
		if (this.map[x][y][z].block.addTo == false && !this.map[x][y][z].block.material.every(value => !value.visible)){ //未加入 且 不可隐藏
			scene.add(this.map[x][y][z].block.mesh);
			this.map[x][y][z].block.addTo = true;
			// console.log("显示", this.map[x][y][z])
		}
		if (this.map[x][y][z].attr.block.noTransparent) //不可透明
			for (let i of this.map[x][y][z].block.material)
				i.visible = true;
	};
	
	//更新方块及周围
	this.updateRound = (x,y,z)=>{
		this.update(x, y, z);
		this.update(x+1, y, z);
		this.update(x-1, y, z);
		this.update(x, y+1, z);
		this.update(x, y-1, z);
		this.update(x, y, z+1);
		this.update(x, y, z-1);
	};
	
	//更新列方块
	this.updateColumn = (x, z)=>{
		//console.log("updateColumn:",x,z,+get_date());
		for (let dy=this.size[0].y; dy<=this.size[1].y; dy++)
			this.update(x, dy, z);
	};
	
	//更新区块内所有方块（同步）
	this.updateZone = (x, z)=>{
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					this.update(ox+dx, dy, oz+dz);
				}
			}
		}
	};
	//更新区块内所有方块（异步）
	this.updateZoneAsync = (x, z, callback)=>{
		console.log("update", x, z, callback)
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		if (callback){ //有回调（必须setInterval）
			let dx = this.size[0].x;
			let updateZone_id = setInterval(()=>{
				if (dx > this.size[1].x){
					clearInterval(updateZone_id);
					callback();
					return;
				}
				
				//正常代码
				for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
						this.update(ox+dx, dy, oz+dz);
					}
				}
				
				dx++;
			},0);
		}else{ //无回调（不分顺序）
			for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
				setTimeout(()=>{
					
					//正常代码
					for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
						for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
							this.update(ox+dx, dy, oz+dz);
						}
					}
					
				},0);
			}
		}
		
		/* for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					this.update(ox+dx, dy, oz+dz);
				}
			}
		} */
	};
	
	
	//初始化区块
	this.initZone = (x, z)=>{
		[x, z] = [x, z].map(Math.round); //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		if (this.initedZone.every(function(value, index, arr){
			return value[0] != x || value[1] != z;
		})) //每个都不一样（不存在）
			this.initedZone.push([x,z]);
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			this.map[ox+dx] = this.map[ox+dx] || [];
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				this.map[ox+dx][dy] = this.map[ox+dx][dy] || [];
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					this.map[ox+dx][dy][oz+dz] = false/* null */;
				}
			}
		}
	};
	
	//加载列
	this.loadColumn = (x, z, edit)=>{
		[x, z] = [x, z].map(Math.round); //规范化
		let height = seed_height(this.seed.noise, this.seed.h, x, z);
		if (height < this.size[0].y){
			height = this.size[0].y;
		}else if (height > this.size[1].y){
			height = this.size[1].y;
		}
		/* let noise = ( t.noise.more3D(0.6, x/t.h.q, z/t.h.q, 3)+
		t.noise.more3D(-3.1415926, x/t.h.q, z/t.h.q, 3)+
		t.noise.more3D(54.782, x/t.h.q, z/t.h.q, 3) )/3;
		noise = 1-Math.sin( (1-noise)*90/180*Math.PI );
		let height = noise *t.h.k +t.h.b+
		t.noise.more3D(-1428.57, x/t.h.e.q, z/t.h.e.q, 3) *t.h.e.k +t.h.e.b; */
		
		/*let noise = Math.abs(t.noise.more3D(0.6, x/t.h.q/2, z/t.h.q/2, 5));
		let height = noise*noise*noise*(noise*(noise*6-15)+10) //*t.h.k +t.h.b;
		height = Math.pow(t.h.k, height) + t.h.b;*/
		// debugger
		// let a = 1/(1+Math.pow(Math.E, 3)), // 1/(1+e^3)
		// 	b = 1/(1+Math.pow(Math.E, -3)), // 1/(1+e^(-3))
		// 	noise = (1+Math.pow(Math.E, -3*noise)-a)/(b-a); // (1+e^(-3x)-a)/(b-a)
		// let height = (t.h.max -t.h.min)/(t.h.ave -1) *Math.pow(t.h.ave, noise) *(t.h.min *t.h.ave -t.h.max)/(t.h.ave -1);
		// let height = Math.pow(1000, 0.5+0.5*noise, 3), 10);
		// let height = t.noise.noise3D(0.6, x/t.h.q, z/t.h.q) *t.h.de + t.h.ave;
		
		let grass = false;
		let type = seed_type(this.seed.noise, this.seed.t, x, z);
		// 90%+ 高原（草木不生，积雪覆盖）
		// 70%+ 高山（无树，有草）
		// 26+ 丘陵（树）
		let treeTop = null;
		let earth = height - height * seed_scale(this.seed.noise, this.seed.s, x, z);
		let treeHeight = height + seed_treeHeight(this.seed.noise, this.seed.tH, x, z);
		for (let dy=this.size[1].y; dy>=this.size[0].y; dy--){ //注意：从上到下
			
			/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
			t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
			let id = 0;
			switch (type){
				case 0: //森林
					
					if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					}else if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
						treeHeight = height;
					}
					
					if (dy > treeHeight){
						id = 0; // 空气/真空 (null)
					}else if (dy > height){
						if (!treeTop) treeTop = dy;
						id = 9.1; //橡木
					}else if (dy > earth){
						if (grass){
							id = 4; //泥土
						}else{
							id = 3; //草方块
							grass = true;
						}
					}else if (dy == 0){
						id = 2; //基岩
					}else{
						if (!grass && !seed_openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 3; //草方块
							grass = true;
						}else{
							id = 6; //石头
						}
					}
					break;
					
				case 1: //草原
					
					if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					}
					
					if (dy > treeHeight){
						id = 0; // 空气/真空 (null)
					}else if (dy > height){
						if (!treeTop) treeTop = dy;
						id = 9.1; //橡木
					}else if (dy > earth){
						if (grass){
							id = 4; //泥土
						}else{
							id = 3; //草方块
							grass = true;
						}
					}else if (dy == 0){
						id = 2; //基岩
					}else{
						if (!grass && !seed_openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 3; //草方块
							grass = true;
						}else{
							id = 6; //石头
						}
					}
					break;
					
				case 2: //沙漠
					
					if (dy > height){
						id = 0; // 空气/真空 (null)
					}else if (dy > earth){
						id = 7; //沙子
					}else if (dy == 0){
						id = 2; //基岩
					}else{
						if (!grass && !seed_openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 7; //沙子
							grass = true;
						}else{
							id = 6; //石头
						}
					}
					break;
				
				default:
					id = 0;
			}
			
			if (!new Array(...edit).some((value, index, arr) => {
				let ret = value.x == x &&
					value.y == dy &&
					value.z == z;
				if (ret){ //被编辑
					this.addID(value.id, {
						x: x,
						y: dy,
						z: z
					}, template, JSON.parse("{"+value.attr+"}") );
				}
				return ret;
			})){ //未编辑
				this.addID(id, {
					x: x,
					y: dy,
					z: z
				}, template);
			}
			
		}
		
		if (treeTop){ //非强制添加树叶(10)
			setTimeout(()=>{
				this.addID(10, {
					x: x,
					y: treeTop+1,
					z: z
				}, template, false);
				let leavesHeight = seed_leavesScale(this.seed.noise, this.seed.lS, x, z) *(treeHeight - height);
				for (let i=0; i<=leavesHeight; i++){
					this.addID(10, {
						x: x+1,
						y: treeTop-i,
						z: z
					}, template, false);
					this.addID(10, {
						x: x-1,
						y: treeTop-i,
						z: z
					}, template, false);
					this.addID(10, {
						x: x,
						y: treeTop-i,
						z: z+1
					}, template, false);
					this.addID(10, {
						x: x,
						y: treeTop-i,
						z: z-1
					}, template, false);
				}
			},0);
			
		}
	}
	//加载区块（同步）
	this.loadZone = (x, z)=>{
		[x, z] = [x, z].map(Math.round); //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
			
		if (this.activeZone.every(function(value, index, arr){
			return value[0] != x || value[1] != z;
		})) //每个都不一样（不存在）
			this.activeZone.push([x,z]);
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
					this.loadColumn(ox+dx, oz+dz, edit);
			}
		}
	}
	//加载区块（异步）
	this.loadZoneAsync = (x, z, callback, dir="")=>{
		if (typeof callback != "function")
			[dir, callback] = [callback, dir];
		
		[x, z] = [x, z].map(Math.round); //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z, //区块中心坐标
			t = this.seed; //临时变量
		
		sql.selectData("file", ["x", "y", "z", "id", "attr"],
			`type=0 AND`+
			` (x BETWEEN ${ ox+this.size[0].x } AND ${ ox+this.size[1].x }) AND`+
			` (z BETWEEN ${ oz+this.size[0].z } AND ${ oz+this.size[1].z })`,
			(edit) => {
				
				console.log("edit(sql):", edit);
				
				switch (dir.substr(0,2)){
					case "x-":
						{
						//if (callback){ //有回调（必须setInterval）
							let dx = this.size[1].x;
							let loadZone_id = setInterval(()=>{
								if (dx < this.size[0].x){
									setTimeout(()=>{
										for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
											this.updateColumn(ox+dx+1, oz+dz);
											this.updateColumn(ox+dx, oz+dz);
										}
									},0);
									clearInterval(loadZone_id);
									
									if (this.activeZone.every(function(value, index, arr){
										return value[0] != x || value[1] != z;
									})) //每个都不一样（不存在）
										this.activeZone.push([x,z]);
									
									if (callback)
										callback();
									return;
								}
								
								//正常代码
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.loadColumn(ox+dx, oz+dz, edit);
								
								setTimeout(()=>{
									this.updateColumn(ox+dx, oz+this.size[0].z-1);
									this.updateColumn(ox+dx, oz+this.size[1].z+1);
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
										this.updateColumn(ox+dx+1, dz);
								}, 0);
								
								dx--;
							},0);
						/* }else{ //无回调（不分顺序）
							if (this.activeZone.every(function(value, index, arr){
								return value[0] != x || value[1] != z;
							})) //每个都不一样（不存在）
								this.activeZone.push([x,z]);
							
							for (let dx=this.size[1].x; dx>=this.size[0].x; dx--){
								setTimeout(()=>{
									console.log(dx)
									//正常代码
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
										this.loadColumn(ox+dx, oz+dz, edit);
									
									this.updateColumn(ox+dx, oz+this.size[0].z-1);
									this.updateColumn(ox+dx, oz+this.size[1].z+1);
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
										this.updateColumn(ox+dx+1, dz);
									if (dx == this.size[0].x)
										for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
											this.updateColumn(ox+dx+1, dz);
											this.updateColumn(ox+dx, dz);
										}
									
								},0);
							}
						} */
						break;
						}
					
					case "z+":
						{
						//if (callback){ //有回调（必须setInterval）
							let dz = this.size[0].z;
							let loadZone_id = setInterval(()=>{
								if (dz > this.size[1].z){
									setTimeout(()=>{
										for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
											this.updateColumn(ox+dx, oz+dz-1);
											this.updateColumn(ox+dx, oz+dz);
										}
									},0);
									clearInterval(loadZone_id);
									
									if (this.activeZone.every(function(value, index, arr){
										return value[0] != x || value[1] != z;
									})) //每个都不一样（不存在）
										this.activeZone.push([x,z]);
									
									if (callback)
										callback();
									return;
								}
								
								//正常代码
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.loadColumn(ox+dx, oz+dz, edit);
								
								setTimeout(()=>{
									this.updateColumn(ox+this.size[0].x-1, oz+dz);
									this.updateColumn(ox+this.size[1].x+1, oz+dz);
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
										this.updateColumn(dx, oz+dz-1);
								}, 0);
								
								dz++;
							},0);
						/* }else{ //无回调（不分顺序）
							if (this.activeZone.every(function(value, index, arr){
								return value[0] != x || value[1] != z;
							})) //每个都不一样（不存在）
								this.activeZone.push([x,z]);
							
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
								setTimeout(()=>{
									//正常代码
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
										this.loadColumn(ox+dx, oz+dz, edit);
									}
								},0);
							}
						} */
						break;
						}
					
					case "z-":
						{
						//if (callback){ //有回调（必须setInterval）
							let dz = this.size[1].z;
							let loadZone_id = setInterval(()=>{
								if (dz < this.size[0].z){
									setTimeout(()=>{
										for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
											this.updateColumn(ox+dx, oz+dz+1);
											this.updateColumn(ox+dx, oz+dz);
										}
									},0);
									clearInterval(loadZone_id);
									
									if (this.activeZone.every(function(value, index, arr){
										return value[0] != x || value[1] != z;
									})) //每个都不一样（不存在）
										this.activeZone.push([x,z]);
									
									if (callback)
										callback();
									return;
								}
								
								//正常代码
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.loadColumn(ox+dx, oz+dz, edit);
								
								setTimeout(()=>{
									this.updateColumn(ox+this.size[0].x-1, oz+dz);
									this.updateColumn(ox+this.size[1].x+1, oz+dz);
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
										this.updateColumn(dx, oz+dz+1);
								}, 0);
								
								dz--;
							},0);
						/* }else{ //无回调（不分顺序）
							if (this.activeZone.every(function(value, index, arr){
								return value[0] != x || value[1] != z;
							})) //每个都不一样（不存在）
								this.activeZone.push([x,z]);
							
							for (let dz=this.size[1].z; dz>=this.size[0].z; dz--){
								setTimeout(()=>{
									//正常代码
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
										this.loadColumn(ox+dx, oz+dz, edit);
									}
								},0);
							}
						} */
						break;
						}
					
					default: // "x+" or else
						{
						//if (callback){ //有回调（必须setInterval）
							let dx = this.size[0].x;
							let loadZone_id = setInterval(()=>{
								if (dx > this.size[1].x){
									setTimeout(()=>{
										for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
											this.updateColumn(ox+dx-1, oz+dz);
											this.updateColumn(ox+dx, oz+dz);
										}
									},0);
									clearInterval(loadZone_id);
									
									if (this.activeZone.every(function(value, index, arr){
										return value[0] != x || value[1] != z;
									})) //每个都不一样（不存在）
										this.activeZone.push([x,z]);
									
									if (callback)
										callback();
									return;
								}
								
								//正常代码
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.loadColumn(ox+dx, oz+dz, edit);
								
								setTimeout(()=>{
									this.updateColumn(ox+dx, oz+this.size[0].z-1);
									this.updateColumn(ox+dx, oz+this.size[1].z+1);
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
										this.updateColumn(ox+dx-1, dz);
								}, 0);
								
								dx++;
							},0);
						/* }else{ //无回调（不分顺序）
							if (this.activeZone.every(function(value, index, arr){
								return value[0] != x || value[1] != z;
							})) //每个都不一样（不存在）
								this.activeZone.push([x,z]);
							
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
								setTimeout(()=>{
									//正常代码
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
										this.loadColumn(ox+dx, oz+dz, edit);
									}
								},0);
							}
						} */
						break;
						}
					
				}
				
			}
		)
	};
	
	//卸载区块（同步）
	this.unloadZone = (x, z)=>{
		[x, z] = [x, z].map(Math.round); //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let i in this.activeZone)
			if (this.activeZone[i][0] == x && this.activeZone[i][1] == z)
				this.activeZone.splice(i,1); //从i开始删除一个元素
		for (let i in this.initedZone)
			if (this.initedZone[i][0] == x && this.initedZone[i][1] == z)
				this.initedZone.splice(i,1); //从i开始删除一个元素
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					if (this.map[ox+dx][dy][oz+dz] != null){
						for (let i of this.map[ox+dx][dy][oz+dz].block.mesh.material)
							i.dispose();
						this.map[ox+dx][dy][oz+dz].block.mesh.geometry.dispose(); //清除内存
						scene.remove(this.map[ox+dx][dy][oz+dz].block.mesh);
					}
					delete this.map[ox+dx][dy][oz+dz];
				}
			}
		}
	};
	//卸载区块（异步）
	this.unloadZoneAsync = (x, z, callback)=>{
		[x, z] = [x, z].map(Math.round); //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let i in this.activeZone)
			if (this.activeZone[i][0] == x && this.activeZone[i][1] == z)
				this.activeZone.splice(i,1); //从i开始删除一个元素
		for (let i in this.initedZone)
			if (this.initedZone[i][0] == x && this.initedZone[i][1] == z)
				this.initedZone.splice(i,1); //从i开始删除一个元素
		
		//if (callback){ //有回调（必须setInterval）
			let dx = this.size[0].x;
			let unloadZone_id = setInterval(()=>{
				if (dx > this.size[1].x){
					setTimeout(()=>{
						for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
							this.updateColumn(ox+dx, oz+this.size[0].z-1);
							this.updateColumn(ox+dx, oz+this.size[1].z+1);
						}
						for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
							this.updateColumn(ox+this.size[0].x-1, oz+dz);
							this.updateColumn(ox+this.size[1].x+1, oz+dz);
						}
					}, 0);
					clearInterval(unloadZone_id);
					if (callback)
						callback();
					return;
				}
				
				//正常代码
				for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
						if (this.map[ox+dx][dy][oz+dz]){ //非空气 & 非未加载
							for (let i of this.map[ox+dx][dy][oz+dz].block.mesh.material)
								i.dispose();
							this.map[ox+dx][dy][oz+dz].block.mesh.geometry.dispose(); //清除内存
							scene.remove(this.map[ox+dx][dy][oz+dz].block.mesh);
						}
						delete this.map[ox+dx][dy][oz+dz];
					}
				}
				
				dx++;
			},0);
		/* }else{ //无回调（不分顺序）
			for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
				setTimeout(()=>{
					
					//正常代码
					for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
						for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
							if (this.map[ox+dx][dy][oz+dz]){ //非空气 & 非未加载
								for (let i of this.map[ox+dx][dy][oz+dz].block.mesh.material)
									i.dispose();
								this.map[ox+dx][dy][oz+dz].block.mesh.geometry.dispose(); //清除内存
								scene.remove(this.map[ox+dx][dy][oz+dz].block.mesh);
							}
							delete this.map[ox+dx][dy][oz+dz];
						}
					}
					
				},0);
			}
		} */
	};
	
	//预加载区块
	this.perloadZone = (length = this.perloadLength)=>{
		let block = [];
		for (let x of [-1,1,0]){
			for (let z of [-1,1,0]){
				let push = [
					Math.round((deskgood.pos.x + x*length)/100/map.size.x),
					Math.round((deskgood.pos.z + z*length)/100/map.size.z),
					(
						x>0 & z>0?
							(Math.random()<0.5?
								"x+1":"z+1"):
						x>0 & z<0?
							(Math.random()<0.5?
								"x+1":"z+1"):
						x<0 & z>0?
							(Math.random()<0.5?
								"x-1":"z+1"):
						x<0 & z<0?
							(Math.random()<0.5?
								"x-1":"z-1"):
						x > 0? "x+2":
						x < 0? "x-2":
						z > 0? "z+2":
						z < 0? "z-2":
						Math.random()<0.5?
							(Math.random()<0.5?
								"x+0":"x-0")
							:
							(Math.random()<0.5?
								"z+0":"z-0")
					)
				];
				let find = false;
				for (let i in block){
					if (block[i][0] == push[0] && block[i][1] == push[1]){ //相同
						if (Number(block[i][2].slice(-1)) <= Number(push[2].slice(-1))) //block小
							block[i] = push;
						find = true;
						break;
					}
				}
				if (!find)
					block.push(push);
			}
		}
		
		for (let i in block){
			if (this.initedZone.every(function(value, index, arr){
				return value[0] != block[i][0] || value[1] != block[i][1];
			})){ //每个都不一样（不存在 & 不在加载中）
				this.initZone(block[i][0], block[i][1]);
				this.loadZoneAsync(...block[i], ()=>{
					this.updateZoneAsync(block[i][0], block[i][1]); //更新区块
				}); //用噪声填充区块
			}
		}
		
		for (let i of this.activeZone)
			if (
				(i[0] != 0 || i[1] != 0)&&
				block.every((value, index, arr)=>{
					return i[0] != value[0] || i[1] != value[1];
				}) //不与任何block相等
			)
				this.unloadZoneAsync(...i); //卸载区块
	};
	
	/* //保存为数组字符串
	this.save = ()=>{
		let arr = [];
		for (let x=this.size[0].x; x<=this.size[1].x; x++){
			for (let y=this.size[0].y; y<=this.size[1].y; y++){
				for (let z=this.size[0].z; z<=this.size[1].z; z++){
					arr.push(this.map[x][y][z]);
				}
			}
		}
		return JSON.stringify(arr);
		//localStorage.setItem("我的世界.存档.方块", JSON.stringify(arr));
	};
	//加载保存的数组字符串
	this.useSave = (arr)=>{
		//let arr = JSON.parse(localStorage.getItem("我的世界.存档.方块"));
		let index = 0;
		for (let x=this.size[0].x; x<=this.size[1].x; x++){
			for (let y=this.size[0].y; y<=this.size[1].y; y++){
				for (let z=this.size[0].z; z<=this.size[1].z; z++){
					this.map[x][y][z] = arr[index++];
				}
			}
		}
	}; */
}