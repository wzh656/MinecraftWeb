class ChunkMap{
	constructor (size, seed, preloadLength){
		//区块大小
		this.size = {
			x: Math.round(size[1].x - size[0].x)+1,
			y: Math.round(size[1].y - size[0].y)+1,
			z: Math.round(size[1].z - size[0].z)+1,
			0: {
				x: Math.round(size[0].x), //-8
				y: Math.round(size[0].y), //0
				z: Math.round(size[0].z) //-8
			},
			1: {
				x: Math.round(size[1].x), //8
				y: Math.round(size[1].y), //256
				z: Math.round(size[1].z) //8
			}
		};
		
		//所有方块
		this.map = [];
		//所有区块信息(status, edit, weather)
		this.chunks = [];
		//区块预加载范围
		this.preloadLength = preloadLength;
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
				d: {
					max: seed.dirt.max,
					min: seed.dirt.min,
					/*ave: seed.dirt.ave,
					de: seed.dirt.de,*/
					q: seed.dirt.q,
					e: {
						max: seed.dirt.error.max,
						min: seed.dirt.error.min,
						q: seed.dirt.error.q
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
				},
				wR: {
					max: seed.weatherRain.max,
					min: seed.weatherRain.min,
					q: seed.weatherRain.q,
					e: {
						max: seed.weatherRain.error.max,
						min: seed.weatherRain.error.min,
						q: seed.weatherRain.error.q
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
			
			this.seed.d.k = (this.seed.d.max - this.seed.d.min)/2;
			this.seed.d.b = (this.seed.d.max + this.seed.d.min)/2;
			this.seed.d.e.k = (this.seed.d.e.max - this.seed.d.e.min)/2;
			this.seed.d.e.b = (this.seed.d.e.max + this.seed.d.e.min)/2;
			
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
			
			this.seed.wR.k = (this.seed.wR.max - this.seed.wR.min)/2;
			this.seed.wR.b = (this.seed.wR.max + this.seed.wR.min)/2;
			this.seed.wR.e.k = (this.seed.wR.e.max - this.seed.wR.e.min)/2;
			this.seed.wR.e.b = (this.seed.wR.e.max + this.seed.wR.e.min)/2;
		}
	}
	
	
	
	/*
	* 转换操作
	*/
	//x,z坐标 转 区块坐标
	p2c(x, z){
		return [
			Math.round(x / this.size.x), 
			Math.round(z / this.size.z)
		];
	}
	
	//区块坐标 转 区块中心坐标
	c2o(cX, cZ){
		return [
			cX * this.size.x,
			cZ * this.size.z
		];
	}
	
	
	
	/*
	* 方块操作(add/delete)
	*/
	
	//获取方块（不可编辑）
	get(x, y, z, entity=false, num=Infinity, r=0.5){
		/* x,y,z,r 单位：m */
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		return this.map[x] && this.map[x][y] && this.map[x][y][z];
		
		/*if (this.map[x] && this.map[x][y]){
			return this.map[x][y][z];
		}else{
			return undefined;
		}*/
		
		/*try{
			return this.map[x][y][z];
		}catch(err){ //超过范围
			return undefined;
		}*/
	}
	//获取实体
	getEntity(x, y, z, num=Infinity, r=Math.sqrt(0.75)){
		const result = [],
			[cX, cZ] = this.p2c(x, z), //区块
			entities = this.chunks[cX] && this.chunks[cX][cZ] && this.chunks[cX][cZ].entity;
		
		if (result.length < num && entities ) //数量不够 且 有实体
			for (let i=entities.length-1; i>=0; i--){ // 实体/实体方块
				const e = entities[i],
					pos = e.type=="EntityBlock"? e.block.mesh.position: e.entity.mesh.position; //坐标
				/* pos 单位：px */
				if ( (pos.x/100 - x) **2+
					(pos.y/100 - y) **2+
					(pos.z/100 - z) **2 <= r*r
				) result.push(e); //在半径范围内
				if (result.length >= num) break; //达到数量
			}
		
		if (num === true) return result[0];
		return result;
	}
	//获取真正的方块及属性
	getShould(x, y, z){
		let block = this.get(x, y, z),
			added = true; //是否预加载
		
		if (block === undefined){ //未加载
			const [cX, cZ] = this.p2c(x, z), //区块
				edit = this.chunks[cX] && this.chunks[cX][cZ] && this.chunks[cX][cZ].edit;
			block = new Block( this.preGet(x, y, z, edit||[]) ); //应该的方块
			added = false;
		}
		return {block, added};
	}
	
	//设置方块
	set(x, y, z, value){
		/* x,y,z 单位：m */
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		if (!this.map[x])
			this.map[x] = [];
		if (!this.map[x][y])
			this.map[x][y] = [];
		this.map[x][y][z] = value;
	}
	
	
	//添加方块
	add(thing, {x,y,z}, type=true){
		/* x,y,z 单位：m */
		// let {type=true} = opt;
		// x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		// if (this.get(x, y, z) === undefined) return;
		if ( this.get(x,y,z) ){ //有方块
			if (type){ //强制替换
				for (const i of this.get(x,y,z).block.mesh.material)
					i.dispose();
				this.get(x,y,z).block.mesh.geometry.dispose(); //清除内存
				scene.remove( this.get(x,y,z).block.mesh );
				// this.map[x][y][z] = null;
				delete this.map[x][y][z];
				/*if (this.map[x][y].every(v => !v))
					delete this.map[x][y];
				if (this.map[x].every(v => !v))
					delete this.map[x];*/
			}else{ //不替换
				return;
			}
		}
		
		thing.block.mesh.position.x = x*100;
		thing.block.mesh.position.y = y*100;
		thing.block.mesh.position.z = z*100;
		
		switch (thing.type){
			case "Block":
				this.set(x, y, z, thing);
				break;
			case "Entity":
			case "EntityBlock":
				const [cX, cZ] = this.p2c(x, z); //区块
				this.chunks[cX][cZ].entity.push(thing);
				break;
		}
		scene.add( thing.block.mesh ); //网格模型添加到场景中
		thing.block.added = true;
	}
	
	//根据 模板和name 添加方块
	addID(thing, {x,y,z}, type=true){
		/*  单位：m */
		
		/* if (typeof type != "boolean"){
			[type, attr] = [undefined, type];
		} */
		// if (!attr.block) attr.block = {};
		if (thing.name == "空气"){ //添加空气
			x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
			const block = this.get(x, y, z);
			if ( block ) //有方块（强制移除）
				this.remove( block );
			
			// this.map[x][y][z] = null; //空气
			this.set(x, y, z, null);
			/* if (this.map[x][y].every(v => !v))
				delete this.map[x][y];
			if (this.map[x].every(v => !v))
				delete this.map[x]; */
			
			return;
		}
		
		switch (thing.type){
			case "Block": //普通方块
				this.add( thing.makeMesh(), {x,y,z}, type ); //以模板建立
			break;
			
			case "EntityBlock": //实体方块
				this.add( thing.makeGeometry().updateSize().makeMesh(), {x,y,z}, type ); //以模板建立
				break;
				
			case "Entity":
				this.add( thing, { x, y, z }, type ); //以模板建立
				break;
		}
	}
	
	//删除物体
	delete(thing){
		const {x,y,z} = thing.type=="entity"?
			thing.entity.mesh.position.clone().divideScalar(100).round()
			: thing.block.mesh.position.clone().divideScalar(100).round(); //规范化 单位:m
		
		switch (thing.type){
			case "Block": //方块
				scene.remove( thing.block.mesh );
				thing.deleteMaterial().deleteGeometry().deleteMesh();
				
				delete this.map[x][y][z];
				/* if (this.map[x][y].every(v => !v))
					delete this.map[x][y];
				if (this.map[x].every(v => !v))
					delete this.map[x]; */
				
				break;
			case "EntityBlock": //实体方块
			case "Entity": //实体
				const [cX, cZ] = this.p2c(x, z); //区块
				if ( !this.chunks[cX][cZ].entity.some((v, i, arr)=>{
					if (v != thing) return false; //未找到
					
					scene.remove( thing.block.mesh );
					thing.deleteMesh();
					arr.splice(i, 1);
					
					return true; //找到
				}) ) console.warn("can't find entity", thing, "in chunk", cX, cZ); //找不到
				break;
		}
	}
	
	
	
	/*
	* 更新操作(update)
	*/
	
	//更新方块
	update(x, y, z){
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		/* 单位: m */
		let { block: thisBlock, added: thisAdded } = this.getShould(x, y, z); //应该的方块
		if (thisBlock === null || thisBlock.name == "空气") //无方块 不用刷新
			return;
		const thisTransparent = thisBlock.get("attr", "transparent");
		
		const thisVisible = []; //本方块 可见值
		
		let needLoad = false; //是否需要加载
		if (thisBlock.attr.transparent === true){ //整体不可隐藏
			for (let i=0; i<6; i++)
				thisVisible[i] = true; //全部显示
			needLoad = true; //需要加载
			
		}else{ //整体/部分可隐藏
			if (typeof thisBlock.attr.transparent == "object") //部分不可隐藏
				for (const [i,v] of Object.entries(thisBlock.attr.transparent))
					if (v) needLoad = thisVisible[i] = true;
			
			// for (const [i, [dx,dy,dz, posDir,norPos, oppDir,norOpp, othDir1, othDir2]] of Object.entries(ChunkMap.updateRule)){ //遍历旁边的方块
			for (const [i, direction] of Object.entries(Block.directions)){ //遍历旁边的方块
				if (thisVisible[i]) continue; //不可隐藏
				
				let px=x, py=y, pz=z; //旁边方块位置
				switch (direction[0]){
					case "x":
						px += direction[1]*2 - 1;
						break;
					case "y":
						py += direction[1]*2 - 1;
						break;
					case "z":
						pz += direction[1]*2 - 1;
						break;
				}
				
				if ( py < this.size[0].y ){ //位于最底层 不显示
					thisVisible[i] = false;
					continue;
				}
				
				const { block: thatBlock } = this.getShould(px, py, pz); //旁边方块
				if ( thatBlock === null || thatBlock.name == "空气" ){ //无方块 显示
					needLoad = thisVisible[i] = true;
					continue;
				}
				let thatTransparent = thatBlock.get("attr", "transparent");
				
				needLoad = needLoad || thatTransparent;
				thisVisible[i] = thatTransparent; //方块透明 显示
			}
		}
		
		
		if (!thisAdded){ //未加载
			const [cX, cZ] = this.p2c(x, z); //区块
			if ( needLoad && this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ) ){ //不可隐藏 且 在加载区块内
				this.addID(thisBlock, {x,y,z});
				thisAdded = true;
			}
			if ( !thisAdded ) return; //无需加载
		}
		
		// if (thisBlock.block.added == true && !needLoad) debugger
		// if (thisBlock.block.added == false && needLoad) debugger
		
		const material = thisBlock.block.material;
		for (let i=material.length-1; i>=0; i--)
			material[i].visible = thisVisible[i];
		
		if (thisBlock.block.added == true && !needLoad){ //已加入 且 可隐藏
			scene.remove( thisBlock.block.mesh );
			thisBlock.block.added = false;
			// console.log("隐藏", this.map[x][y][z])
		}
		if (thisBlock.block.added == false && needLoad){ //未加入 且 不可隐藏
			scene.add( thisBlock.block.mesh );
			thisBlock.block.added = true;
			// console.log("显示", this.map[x][y][z])
		}
		
		/* if (thisBlock === undefined){ //未加载
			const cX = Math.round(x/this.size.x),
				cZ = Math.round(z/this.size.z), //所属区块(Chunk)
				edit = this.chunks[cX] && this.chunks[cX][cZ] && this.chunks[cX][cZ].edit,
				get = new Block( this.preGet(x, y, z, edit||[]) ),
				transparent = get.id && get.get("attr", "transparent");
			thisVisible = [
				!( this.get(x+1, y, z) && !this.get(x+1, y, z).get("attr", "transparent")) || transparent,
				!( this.get(x-1, y, z) && !this.get(x-1, y, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y+1, z) && !this.get(x, y+1, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y-1, z) && !this.get(x, y-1, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y, z+1) && !this.get(x, y, z+1).get("attr", "transparent")) || transparent,
				!( this.get(x, y, z-1) && !this.get(x, y, z-1).get("attr", "transparent")) || transparent
				// 没有方块 或 有方块非透明 则显示  或  自身透明 也显示
			];
			
			if (thisVisible.some(v => v) && this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ)){ //不可隐藏（有面true） 且 在加载区块内
				this.addID(new Block({
					name: get.name,
					attr: get.attr
				}), {x,y,z});
				thisBlock = this.get(x,y,z); //加载后的this方块
			}
			if (!thisBlock) //undefined（无需加载） 或 null（加载为空气）
				return;
		}else{ //已加载
			const transparent =  thisBlock.get("attr", "transparent");
			thisVisible = [
				!( this.get(x+1, y, z) && !this.get(x+1, y, z).get("attr", "transparent")) || transparent,
				!( this.get(x-1, y, z) && !this.get(x-1, y, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y+1, z) && !this.get(x, y+1, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y-1, z) && !this.get(x, y-1, z).get("attr", "transparent")) || transparent,
				!( this.get(x, y, z+1) && !this.get(x, y, z+1).get("attr", "transparent")) || transparent,
				!( this.get(x, y, z-1) && !this.get(x, y, z-1).get("attr", "transparent")) || transparent
				// 没有方块 或 有方块非透明 则显示  或  自身透明 也显示
			];
		} */
		
		/*if (thisBlock === undefined){ //未加载
			let [cX, cZ] = [x/this.size.x, z/this.size.z].map(Math.round); //所属区块(Chunk)
			if (thisVisible.some(v => v) && this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ)){ //不可隐藏（有面true） and 在加载区块内
				let edit = this.edit[cX] && this.edit[cX][cZ];
				let get = this.preGet(x, y, z, edit||[]);
				this.addID(new Block({
					name: get.name,
					attr: get.attr
				}), {x,y,z});
				thisBlock = this.get(x,y,z);
			}
			if (!thisBlock) //undefined（仍未加载） or null（加载为空气）
				return;
		}*/
		
		
		
		/* try{
			if (thisBlock === undefined && thisVisible.some(value => value)){ //未加载 且 不可隐藏（有面true）
				let edit = this.edit[Math.round(x/this.size.x)] && this.edit[Math.round(x/this.size.x)][Math.round(z/this.size.z)];
				let get = this.preGet(x, y, z, edit||[]);
				this.addID(new Block({
					name: get.name,
					attr: get.attr
				}), {x,y,z});
				console.log(this.get(x,y,z), thisBlock)
				thisBlock = this.get(x,y,z);
				if (thisBlock === null) //空气
					return;
			}
			console.log(this.get(x,y,z), thisBlock)
			let material = thisBlock.block.material;
			for (let i in material)
				material[i].visible = thisVisible[i];
			
			if (thisBlock.block.added == true && thisVisible.every(value => !value)){ //已加入 且 可隐藏（每面都false）
				scene.remove(thisBlock.block.mesh);
				thisBlock.block.added = false;
				// console.log("隐藏", this.map[x][y][z])
			}
			if (thisBlock.block.added == false && thisVisible.some(value => value)){ //未加入 且 不可隐藏（有面true）
				scene.add(thisBlock.block.mesh);
				thisBlockblock.added = true;
				// console.log("显示", this.map[x][y][z])
			}
		}catch(e){
			debugger
		} */
		
	}
	
	//更新方块及周围
	updateRound(x,y,z, self){
		/* 单位: m */
		if (self)
			this.update(x, y, z);
		this.update(x+1, y, z);
		this.update(x-1, y, z);
		this.update(x, y+1, z);
		this.update(x, y-1, z);
		this.update(x, y, z+1);
		this.update(x, y, z-1);
	}
	
	//更新列方块
	updateColumn(x, z){
		//console.log("updateColumn:",x,z,+time.getTime());
		for (let dy=this.size[0].y, y1 = this.size[1].y; dy<=y1; dy++)
			this.update(x, dy, z);
	}
	
	//更新区块内所有方块（同步）
	updateChunk(cX, cZ){
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( !this.getLoadedChunks().some(v => v[0]==cX && v[1]==cZ) ) //未加载完毕
			return console.warn("updateChunk", cX, cZ, "haven't load");
		
		for (let dy=this.size[0].y; dy<=this.size[1].y; dy++)
			for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
					this.update(ox+dx, dy, oz+dz);
	}
	//更新区块内所有方块（异步）
	updateChunkAsync(cX, cZ, opt={}){
		let {
				finishCallback,
				progressCallback,
				breakTime=66, // 最大执行时间/ms
				mostSpeed=2, // 最大速度/次
				breakPoint={}
			} = opt,
			{
				dx = this.size[0].x,
				dz = this.size[0].z
			} = breakPoint;
		
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( this.chunks[cX][cZ].status !== true ) //未加载完毕
			return console.warn("updateChunkAsync stop", cX, cZ, "status:", this.chunks[cX][cZ].status);
		
		let t0 = new Date(),
			num = 0;
		for (let i=dx; i<=this.size[1].x; i++){
			for (let j=dz; j<=this.size[1].z; j++){
				
				for (let dy=this.size[0].y; dy<=this.size[1].y; dy++)
					this.update(ox+i, dy, oz+j);
				
				if (new Date()-t0 > breakTime){ //超时
					if ( this.chunks[cX][cZ].status !== true ) //未加载完毕 终止更新
						return console.warn("updateChunkAsync stop", cX, cZ, "status:", this.chunks[cX][cZ].status);
					return setTimeout(()=>{
						this.updateChunkAsync(cX, cZ, {
							finishCallback,
							progressCallback,
							breakTime,
							breakPoint: {dx:i, dz:j+1}
						});
					}, 0);
				}
			}
			dz = this.size[0].z;
			
			if (progressCallback)
				progressCallback( (i-this.size[0].x) / (this.size[1].x-this.size[0].x) );
			
			if (++num >= mostSpeed){ //超数
				if ( this.chunks[cX][cZ].status !== true ) //未加载完毕 终止更新
					return console.warn("updateChunkAsync stop", cX, cZ, "status:", this.chunks[cX][cZ].status);
				return setTimeout(()=>{
					this.updateChunkAsync(cX, cZ, {
						finishCallback,
						progressCallback,
						breakTime,
						breakPoint: {dx:i+1}
					});
				}, 0);
			}
		}
		
		if (finishCallback) finishCallback();
	}
	//更新区块内所有方块（生成器异步）
	updateChunkGenerator(cX, cZ, opt={}){
		return new Promise((resolve, reject)=>{
			let {
				progressCallback,
				breakTime=66, // 最大执行时间/ms
				mostSpeed=2 // 最大速度/次
			} = opt;
			
			cX = Math.round(cX), cZ = Math.round(cZ); //规范化
			const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
			
			if ( this.chunks[cX][cZ].status !== true ) //未加载完毕
				return console.warn("updateChunkGenerator stop", cX, cZ, "status:", this.chunks[cX][cZ].status);
			
			const _this = this,
				gen = function* (){
					for (let i=_this.size[0].x; i<=_this.size[1].x; i++){
						for (let j=_this.size[0].z; j<=_this.size[1].z; j++){
							for (let k=_this.size[0].y; k<=_this.size[1].y; k++)
								_this.update(ox+i, k, oz+j);
							yield; //判断超时
						}
						console.log("updating",i)
						if (progressCallback)
							progressCallback( (i-_this.size[0].x) / (_this.size[1].x-_this.size[0].x) );
						yield true; //判断超数
					}
				}
			
			const gener = gen(),
				id = setInterval(function work(){
					let res = {},
						t0 = +new Date(),
						num = 0;
					while ( !res.done ){
						res = gener.next();
						if (new Date()-t0 >= breakTime) //超时
							return;
						if (res.value == true && ++num >= mostSpeed) //超数
							return;
						if ( _this.chunks[cX][cZ].status !== true ){ //未加载完毕 终止更新
							console.warn("updateChunkGenerator stop", cX, cZ, "status:", _this.chunks[cX][cZ].status);
							clearInterval(id); //运行结束
							return resolve();
						}
					}
					// if (finishCallback) finishCallback(); //更新完毕
					clearInterval(id); //运行结束
					resolve();
				}, 0);
			// return id;
		});
	}
	
	
	/*
	* 区块状态操作
	* status: {true:已加载, false:加载/卸载中, undefined:已卸载}
	*/
	
	//开始加载区块
	startLoadChunk(cX, cZ, edit){
		cX=Math.round(cX), cZ=Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		console.log("start load chunk", cX, cZ)
		
		if ( !this.chunks[cX] )
			this.chunks[cX] = [];
		if ( !this.chunks[cX][cZ] )
			this.chunks[cX][cZ] = {};
		
		this.chunks[cX][cZ].status = false; //加载中
		this.chunks[cX][cZ].entity = []; //实体
		this.chunks[cX][cZ].edit = edit; //需存储的修改
		this.chunks[cX][cZ].weather = new Weather( //天气
			[
				ox + this.size[0].x,
				oz + this.size[0].z
			],[
				ox + this.size[1].x,
				oz + this.size[1].z
			],
			sNoise.weatherRain( this.seed.noise, this.seed.wR, cX*this.size.x, cZ*this.size.z, time.getTime() )
		);
		// console.log("weather:", sNoise.weatherRain( this.seed.noise, this.seed.wR, cX*this.size.x, cZ*this.size.z, time.getTime()/1000/60 ))
		time.setInterval((now, speed)=>{
			if (!speed) return;
			if ( !this.chunks[cX][cZ].weather ) return;
			// console.log("weather:", sNoise.weatherRain( this.seed.noise, this.seed.wR, cX*this.size.x, cZ*this.size.z, time.getTime()/1000/3600 ))
			this.chunks[cX][cZ].weather.rain =
				sNoise.weatherRain( this.seed.noise, this.seed.wR, cX*this.size.x, cZ*this.size.z, time.getTime()/1000/3600 );
		}, 60*1000); //60s更新一次
	}
	//完成加载区块
	finishLoadChunk(cX, cZ){
		cX=Math.round(cX), cZ=Math.round(cZ); //规范化
		
		if ( !this.chunks[cX] )
			this.chunks[cX] = [];
		if ( !this.chunks[cX][cZ] )
			this.chunks[cX][cZ] = {};
		
		if (this.chunks[cX][cZ].weather)
			this.chunks[cX][cZ].weather.start_rain(); //开始下雨
		
		this.chunks[cX][cZ].status = true; //加载完毕
		console.log("finish load chunk", cX, cZ)
	}
	//开始卸载区块
	startUnloadChunk(cX, cZ){
		cX=Math.round(cX), cZ=Math.round(cZ); //规范化
		
		console.log("start unload chunk", cX, cZ)
		
		if ( !this.chunks[cX] )
			this.chunks[cX] = [];
		if ( !this.chunks[cX][cZ] )
			this.chunks[cX][cZ] = {};
		
		this.chunks[cX][cZ].status = false; //卸载中
	}
	//完成卸载区块
	finishUnloadChunk(cX, cZ){
		cX=Math.round(cX), cZ=Math.round(cZ); //规范化
		
		if ( !this.chunks[cX] )
			this.chunks[cX] = [];
		if ( !this.chunks[cX][cZ] )
			this.chunks[cX][cZ] = {};
		
		if (this.chunks[cX][cZ].weather)
			this.chunks[cX][cZ].weather.clear_rain();
		
		delete this.chunks[cX][cZ].weather;
		delete this.chunks[cX][cZ].entity;
		delete this.chunks[cX][cZ].status; //已卸载
		console.log("finish unload chunk", cX, cZ)
	}
	
	//获取已初始化的区块(status:true/false)
	getInitedChunks(){
		const arr = [];
		for (const i of Object.keys(this.chunks))
			for (const j of Object.keys(this.chunks[i]))
				if ( this.chunks[i][j].status !== undefined ) // true或false
					arr.push([i, j])
		return arr;
	}
	//获取已加载的区块(status:true)
	getLoadedChunks(){
		const arr = [];
		for (const i of Object.keys(this.chunks))
			for (const j of Object.keys(this.chunks[i]))
				if ( this.chunks[i][j].status === true )
					arr.push([i, j])
		return arr;
	}
	
	
	
	/*
	* 区块操作
	*/
	
	//获取方块信息
	preGet(x, y, z, edit){
		// x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		// console.warn("load", x, z)
		
		for (let i=edit.length-1; i>=0; i--){
			const value = edit[i];
			if (
				value.x == x &&
				value.y == y &&
				value.z == z
			){ //被编辑
				return {
					name: value.name,
					attr: value.attr? JSON.parse( "{"+value.attr+"}" ): {}
				};
			}
		} //未编辑
		
		let height = sNoise.height(this.seed.noise, this.seed.h, x, z);
		height = Math.max( this.size[0].y, Math.min(height, this.size[1].y) );
		/*if (height < this.size[0].y){
			height = this.size[0].y;
		}else if (height > this.size[1].y){
			height = this.size[1].y;
		}*/
		/* let sNoise = ( t.noise.more3D(0.6, x/t.h.q, z/t.h.q, 3)+
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
		
		// let grass = false;
		let type = sNoise.type(this.seed.noise, this.seed.t, x, z),
		// 90%+ 高原（草木不生，积雪覆盖）
		// 70%+ 高山（无树，有草）
		// 26+ 丘陵（树）
			//treeTop = null, //保留最高树干坐标
			earth = height - height * sNoise.dirt(this.seed.noise, this.seed.d, x, z),
			treeHeight = height + sNoise.treeHeight(this.seed.noise, this.seed.tH, x, z),
			leaves = [+Infinity, -Infinity]; //(min, max]
		
		for ( const [dx,dz] of [[1,0], [-1,0], [0,1],[0,-1]] ){
			const tH = sNoise.treeHeight(this.seed.noise, this.seed.tH, x+dx, z+dz);
			if ( tH &&
				!sNoise.type(this.seed.noise, this.seed.t, x+dx, z+dz) &&
				!sNoise.openStone(this.seed.noise, this.seed.oS, x, z)
			){ //有树 且 为森林 且 无石头
				let lH = tH * sNoise.leavesScale(this.seed.noise, this.seed.lS, x+dz, z+dz), //叶高
					h = sNoise.height(this.seed.noise, this.seed.h, x+dx, z+dz); //底面高度
				h = Math.max( this.size[0].y, Math.min(h, this.size[1].y) );
				leaves[1] = Math.max(leaves[1], h+tH);
				leaves[0] = Math.min(leaves[0], h+tH-lH);
				// console.log(`h:${h}, treeH:${tH}, leavesH:${lH}`, leaves)
			}
		}
		
		/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
		t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
		let name = "空气";
		switch (type){
			case 0: //森林
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				}else */if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
					treeHeight = height;
				}
				if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)) //石头上不长树
					treeHeight = height;
				
				if (y > treeHeight+1){
					if (y <= leaves[1] && y > leaves[0]){
						name = "疏树叶";
					}else{
						name = "空气";
					}
				}else if (y > treeHeight){
					if ( treeHeight != height ||
						(y <= leaves[1] && y > leaves[0])
					){ //有树或旁边有树
						name = "疏树叶";
					}else{
						name = "空气";
					}
				}else if (y > height){
					//if (!treeTop) treeTop = y;
					name = "细橡木";
				}else if (y == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						name = "石头";
					}else{
						name = "草方块";
					}
				}else if (y > earth){
					// if (grass){
						name = "泥土";
					/* }else{
						name = "草方块";
						// grass = true;
					} */
				}/*else if (y == 0){
					name = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						name = "草方块";
						grass = true;
					}else{ */
						name = "石头";
					// }
				}
				break;
				
			case 1: //草原
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				} */
				
				if (y > height){
					if (y <= leaves[1] && y > leaves[0]){
						name = "疏树叶";
					}else{
						name = "空气";
					}
				}/* else if (y > height){
					//if (!treeTop) treeTop = y;
					name = 7.1; //橡木
				} */else if (y == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						name = "石头";
					}else{
						name = "草方块";
					}
				}else if (y > earth){
					// if (grass){
						name = "泥土";
					/* }else{
						name = "草方块";
						// grass = true;
					} */
				}else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						name = "草方块";
						// grass = true;
					}else{ */
						name = "石头";
					// }
				}
				break;
				
			case 2: //沙漠
				
				if (y > height){
					if (y <= leaves[1] && y > leaves[0]){
						name = "疏树叶";
					}else{
						name = "空气";
					}
				}else if (y > earth){
					name = "沙子";
				}else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						name = "沙子";
						grass = true;
					}else{ */
						name = "石头";
					// }
				}
				break;
			
			default:
				name = "空气";
		}
		
		return {name};
	}
	
	//获取一列方块信息
	preGetColumn(x, z, edit){
		// [x, z] = [Math.round(x), Math.round(z)]; //规范化
		// console.warn("load", x, z)
		
		let column = [],
			height = sNoise.height(this.seed.noise, this.seed.h, x, z);
		height = Math.max( this.size[0].y, Math.min(height, this.size[1].y) );
		/*if (height < this.size[0].y){
			height = this.size[0].y;
		}else if (height > this.size[1].y){
			height = this.size[1].y;
		}*/
		/* let sNoise = ( t.noise.more3D(0.6, x/t.h.q, z/t.h.q, 3)+
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
		
		// let grass = false;
		let type = sNoise.type(this.seed.noise, this.seed.t, x, z),
				// 90%+ 高原（草木不生，积雪覆盖）
				// 70%+ 高山（无树，有草）
				// 26+ 丘陵（树）
			//treeTop = null, //保留最高树干坐标
			earth = height - height * sNoise.dirt(this.seed.noise, this.seed.d, x, z),
			treeHeight = height + sNoise.treeHeight(this.seed.noise, this.seed.tH, x, z),
			leaves = [+Infinity, -Infinity]; //(min, max]
		
		for ( const [dx,dz] of [[1,0], [-1,0], [0,1],[0,-1]] ){
			const tH = sNoise.treeHeight(this.seed.noise, this.seed.tH, x+dx, z+dz);
			if ( tH &&
				!sNoise.type(this.seed.noise, this.seed.t, x+dx, z+dz) &&
				!sNoise.openStone(this.seed.noise, this.seed.oS, x+dx, z+dz)
			){ //有树 且 为森林 且 无石头
				let lH = tH * sNoise.leavesScale(this.seed.noise, this.seed.lS, x+dz, z+dz), //叶高
					h = sNoise.height(this.seed.noise, this.seed.h, x+dx, z+dz); //底面高度
				h = Math.max( this.size[0].y, Math.min(h, this.size[1].y) );
				leaves[1] = Math.max(leaves[1], h+tH);
				leaves[0] = Math.min(leaves[0], h+tH-lH);
				// console.log(`h:${h}, treeH:${tH}, leavesH:${lH}`, leaves)
			}
		}
		
		for (let dy=this.size[1].y; dy>=this.size[0].y; dy--){ //注意：从上到下
			
			if (edit.some((value)=>{
				if (
					value.x == x &&
					value.y == dy &&
					value.z == z
				){ //被编辑
					column[dy] = {
						name: value.name,
						attr: value.attr? JSON.parse( "{"+value.attr+"}" ): {}
					};
					return true; //让下面continue
				}
			})) continue; //被编辑 跳过
			//未编辑
			
			/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
			t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
			let name = "空气";
			switch (type){
				case 0: //森林
					
					/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					}else */if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
						treeHeight = height;
					}
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)) //石头上不长树
						treeHeight = height;
					
					if (dy > treeHeight+1){
						if (dy <= leaves[1] && dy > leaves[0]){
							name = "疏树叶";
						}else{
							name = "空气";
						}
					}else if (dy > treeHeight){
						if ( treeHeight != height ||
							(dy <= leaves[1] && dy > leaves[0])
						){ //有树或旁边有树
							name = "疏树叶";
						}else{
							name = "空气";
						}
					}else if (dy > height){
						//if (!treeTop) treeTop = y;
						name = "细橡木";
					}else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
						if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							name = "石头";
						}else{
							name = "草方块";
						}
					}else if (dy > earth){
						// if (grass){
							name = "泥土";
						/* }else{
							name = "草方块";
							// grass = true;
						} */
					}else{
						/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							name = "草方块";
							grass = true;
						}else{ */
							name = "石头";
						// }
					}
					break;
					
				case 1: //草原
					
					/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					} */
					
					if (dy > height){
						if (dy <= leaves[1] && dy > leaves[0]){
							name = "疏树叶";
						}else{
							name = "空气";
						}
					}/* else if (dy > height){
						//if (!treeTop) treeTop = dy;
						name = "细橡木";
					} */else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
						if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							name = "石头";
						}else{
							name = "草方块";
						}
					}else if (dy > earth){
						// if (grass){
							name = "泥土";
						/* }else{
							name = "草方块";
							// grass = true;
						} */
					}else{
						/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							name = "草方块";
							// grass = true;
						}else{ */
							name = "石头";
						// }
					}
					break;
					
				case 2: //沙漠
					
					if (dy > height){
						if (dy <= leaves[1] && dy > leaves[0]){
							name = "疏树叶";
						}else{
							name = "空气";
						}
					}else if (dy > earth){
						name = "沙子";
						//grass = true;
					}else{
						/*if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							name = "沙子";
							grass = true;
						}else{*/
							name = "石头";
						//}
					}
					break;
				
				default:
					name = "空气";
			}
			
			column[dy] = { name };
		}
		
		return column;
	}
	/*preGetColumn_worker(x, z, edit, finishCallback){
		let worker = new Worker("./preGetColumn_worker.js");
		worker.postMessage({x, z, edit, t:this.seed});
		worker.onmessage = function (event) {
			console.log("Received message from", "preGetColumn_worker.js", event.data);
			finishCallback(event.data);
		}
	}*/
	
	//获取区块信息
	preGetChunk(cX, cZ, edit){
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		const result = [];
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			result[dx] = [];
			for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
				result[dx][dz] = this.preGetColumn(ox+dx, oz+dz, edit);
				/* for (const y in result[dx][dz])
					result[dx][dz][y] = new Block(result[dx][dz][y]); */
			}
		}
		return result;
	}
	
	
	//加载列
	loadColumn(x, z, columns){
		x = Math.round(x), z = Math.round(z); //规范化
		const [cX, cZ] = this.p2c(x, z), //区块坐标
			[ox, oz] = this.c2o(cX, cZ), //区块中心坐标
			dx = x-ox,
			dz = z-oz;
		
		for (let y=this.size[0].y; y<=this.size[1].y; y++){
			
			//本方块
			const thisBlock = columns[dx][dz][y];
			if (thisBlock.name == "空气"){ //空气不加载
				this.addID(/* new Block({
					name: "空气"
				}) */{
					name: "空气"
				}, {x,y,z});
				continue;
			}
			
			let thisTransparent = (thisBlock.attr && thisBlock.attr.transparent) ||
				(Thing.TEMPLATES[thisBlock.name].attr.transparent);
			
			const thisVisible = []; //本方块 可见值
			let needLoad = false; //是否需要加载
			if (thisTransparent === true){ //整体不可隐藏
				for (let i=0; i<6; i++)
					thisVisible[i] = true; //全部显示
				needLoad = true;
				
			}else{ //整体/部分可隐藏
				if (typeof thisTransparent == "object") //部分不可隐藏
					for (const [i,v] of Object.entries(thisTransparent))
						if (v) needLoad = thisVisible[i] = true;
				
				for (const [i, direction] of Object.entries(Block.directions)){ //遍历旁边的方块
				// for (const [i, [dx,dy,dz, posDir,norPos, oppDir,norOpp, othDir1, othDir2]] of Object.entries(ChunkMap.updateRule)){ //遍历旁边的方块
					if (thisVisible[i]) continue; //不可隐藏
					
					let px=dx, py=y, pz=dz; //旁边方块位置
					switch (direction[0]){
						case "x":
							px += direction[1]*2 - 1;
							break;
						case "y":
							py += direction[1]*2 - 1;
							break;
						case "z":
							pz += direction[1]*2 - 1;
							break;
					}
					
					if ( py < this.size[0].y ){ //位于最底层 不显示
						thisVisible[i] = false;
						continue;
					}
					
					//盘边方块
					const thatBlock = (px < this.size[0].x || px > this.size[1].x ||
							py < this.size[0].y || py > this.size[1].y ||
							pz < this.size[0].z || pz > this.size[1].z)?
								this.getShould(ox+px, y, oz+pz).block //超出范围 取应该的方块
							: (columns[px] && columns[px][pz] && columns[px][pz][py]);
					if ( thatBlock === null || thatBlock.name == "空气" ){ //无方块 显示
						needLoad = thisVisible[i] = true;
						continue;
					}
					
					const visible = (thatBlock.attr && thatBlock.attr.transparent) || //旁边方块透明
						(Thing.TEMPLATES[thatBlock.name].attr.transparent); //继承属性
					needLoad = needLoad || visible;
					thisVisible[i] = visible; //方块透明 显示
				}
			}
			
			/* const thisVisible = [],
					thisSize = block.attr && block.attr.block && block.attr.block.size || {}, //本方块大小
					thisTransparent = (block.attr && block.attr.block && block.attr.block.transparent!==undefined)? //有属性
						block.attr.block.transparent:
						Block.TEMPLATES[ block.name ].attr.block.transparent; //是否可以隐藏
				Object.map(direction, (v,i)=> thisSize[i] = thisSize[i]===undefined? v: thisSize[i]); //默认值
				
				let needLoad = false;
				if (thisTransparent === true){ //整体不可隐藏
					for (let i=0; i<6; i++)
						thisVisible[i] = true;
					needLoad = true;
				}else{
					for (const [i, [ddx,ddy,ddz, posDir,oppDir, othDir1, othDir2]] of Object.entries(rule)){
						const px=dx+ddx, py=y+ddy, pz=dz+ddz,
							thatBlock = columns[px] && columns[px][pz] && columns[px][pz][py]; //旁边方块
						
						const thatSize = thatBlock?
							thatBlock.attr && thatBlock.attr.block && thatBlock.attr.block.size || {}:
							{}; //旁边方块大小
						Object.map(direction, (v,i)=> thatSize[i] = thatSize[i]===undefined? v: thatSize[i]); //默认值
						
						if ( thisSize && thatSize && ( //有属性
							thisSize[posDir] != direction[posDir] || //本方块 正方向变小
							thatSize[oppDir] != direction[oppDir] || //旁方块 反方向变小
							thisSize[othDir1+"0"] < thatSize[othDir1+"0"] ||
							thisSize[othDir1+"1"] > thatSize[othDir1+"1"] ||
							thisSize[othDir2+"0"] < thatSize[othDir2+"0"] ||
							thisSize[othDir2+"1"] > thatSize[othDir2+"1"] //超出旁边方块
						) ){ // 显示
							needLoad = true;
							thisVisible.push(true);
						}else if ( py < this.size[0].y ){ //位于最底层 则不显示
							thisVisible.push(false);
						}/* else if (
							px < this.size[0].x || px > this.size[1].x ||
							py < this.size[0].y || py > this.size[1].y ||
							pz < this.size[0].z || pz > this.size[1].z
						){ //位于边缘 则不显示
							thisVisible.push(false);
						} *//*else if ( !thatBlock || thatBlock.name=="空气" ){ //无方块 显示
							needLoad = true;
							thisVisible.push(true);
						}else if ( thatBlock.attr && thatBlock.attr.block ){ //有属性
							const visible = thatBlock.attr.block.transparent;
							needLoad = needLoad || visible;
							thisVisible.push( visible ); //方块透明 显示
						}else{ //继承模板
							const visible = Block.TEMPLATES[ columns[px][pz][py].name ].attr.block.transparent;
							needLoad = needLoad || visible;
							thisVisible.push( visible ); //方块透明 显示
						}
					}
				} */
				
			if ( needLoad ){ //有面需显示
				// if (y == 0) console.log(thisVisible)
				
				const block = Thing.TEMPLATES[thisBlock.name].cloneAttr(thisBlock.attr || {});
				
				this.addID(block, {x,y,z});
				
				const material = block.block.material;
				
				if ( !thisTransparent ) //允许透明
					for (let i=material.length-1; i>=0; i--)
						material[i].visible = thisVisible[i];
				
				
				// x,z,y
				/*const transparent =  block.get("attr", "transparent"),
					thisVisible = [
						!( columns[dx+1] && columns[dx+1][y] && columns[dx+1][y][dz] && columns[dx+1][y][dz].id && !((columns[dx+1][y][dz].attr&&columns[dx+1][y][dz].attr.block.transparent)||Block.TEMPLATES[columns[dx+1][y][dz].id].attr.block.transparent)) || transparent,
						!( columns[dx-1] && columns[dx-1][y] && columns[dx-1][y][dz] && columns[dx-1][y][dz].id && !((columns[dx-1][y][dz].attr&&columns[dx-1][y][dz].attr.block.transparent)||Block.TEMPLATES[columns[dx-1][y][dz].id].attr.block.transparent)) || transparent,
						!( columns[dx] && columns[dx][y+1] && columns[dx][y+1][dz] && columns[dx][y+1][dz].id && !((columns[dx][y+1][dz].attr&&columns[dx][y+1][dz].attr.block.transparent)||Block.TEMPLATES[columns[dx][y+1][dz].id].attr.block.transparent)) || transparent,
						!( columns[dx] && columns[dx][y-1] &&  columns[dx][y-1][dz] && columns[dx][y-1][dz].id && !((columns[dx][y-1][dz].attr&&columns[dx][y-1][dz].attr.block.transparent)||Block.TEMPLATES[columns[dx][y-1][dz].id].attr.block.transparent)) || transparent,
						!( columns[dx] && columns[dx][y] && columns[dx][y][dz+1] && columns[dx][y][dz+1].id && !((columns[dx][y][dz+1].attr&&columns[dx][y][dz+1].attr.block.transparent)||Block.TEMPLATES[columns[dx][y][dz+1].id].attr.block.transparent)) || transparent,
						!( columns[dx] && columns[dx][y] && columns[dx][y][dz-1] && columns[dx][y][dz-1].id && !((columns[dx][y][dz-1].attr&&columns[dx][y][dz-1].attr.block.transparent)||Block.TEMPLATES[columns[dx][y][dz-1].id].attr.block.transparent)) || transparent
						// 没有方块 或 有方块非透明 则显示  或  自身透明 也显示
					],*/
				
			}
		}
	}
	
	//加载区块（同步）
	loadChunk(cX, cZ){
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ) ) //已初始化
			return console.warn("loadChunk", cX, cZ, "already inited");
		
		DB.readChunk(cX, cZ).then((edit)=>{
			console.log("edit(DB):", cX, cZ, edit);
			this.startLoadChunk(cX, cZ, edit); //初始化区块
			
			const columns = this.preGetChunk(cX, cZ, edit);
			for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
						this.loadColumn(ox+dx, oz+dz, columns);
			
			this.finishLoadChunk(cX, cZ); //区块加载完毕
		});
		/* const edit = [];
		db.readStep(DB.TABLE.WORLD, {
			index: "type",
			range: ["only", DB.TYPE.Block], //方块
			stepCallback: (res)=>{
				if (
					res.x >= ox+this.size[0].x && res.x <= ox+this.size[1].x &&
					res.z >= oz+this.size[0].z && res.z <= oz+this.size[1].z
				) edit.push(res);
			},
			successCallback: ()=>{
				console.log("edit(DB):", cX, cZ, edit);
				this.startLoadChunk(cX, cZ, edit); //初始化区块
				
				const columns = this.preGetChunk(cX, cZ, edit);
				for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
						for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
							this.loadColumn(ox+dx, oz+dz, columns);
				
				this.finishLoadChunk(cX, cZ); //区块加载完毕
			},
		}); */
		/* const edit = DB.readChunk(cX, cZ).then((edit)=>{
			this.startLoadChunk(cX, cZ); //初始化区块
			
			console.log("edit(DB):", edit);
			//保存edit
			this.chunks[cX][cZ].edit = edit;
			
			const columns = this.preGetChunk(cX, cZ, edit);
			
			for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
						this.loadColumn(ox+dx, oz+dz, columns);
			
			this.finishLoadChunk(cX, cZ); //区块加载完毕
			
		}); */
	}
	//加载区块（异步）
	loadChunkAsync(cX, cZ, opt={}){
		let {
				finishCallback,
				progressCallback,
				breakTime=66, // 最大执行时间/ms
				mostSpeed=2, // 最大速度/次
				dir="", //方向
				breakPoint={}
			} = opt,
			{
				dx = dir=="x-"? this.size[1].x: this.size[0].x,
				dz = dir=="z-"? this.size[1].z: this.size[0].z
			} = breakPoint;
		
		cX=Math.round(cX), cZ=Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ) && !Object.keys(breakPoint).length ) //已初始化 且 非断点
			return console.warn("loadChunkAsync", cX, cZ, "already inited");
		
		//回调
		const func = (columns)=>{
			
			switch ( dir.substr(0,2) ){
				case "x-":
					{
						let t0 = +new Date(),
							num = 0;
						
						/*let dx;
						if (breakPoint){
							dx = breakPoint.dx==undefined? this.size[1].x: breakPoint.dx;
							delete breakPoint.dx;
						}else{
							dx = this.size[1].x;
						}*/
						for (let i=dx; i>=this.size[0].x; i--){
							
							/*let dz;
							if (breakPoint){
								dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
								delete breakPoint.dz;
							}else{
								dz = this.size[0].z;
							}*/
							for (let j=dz; j<=this.size[1].z; j++){
								this.loadColumn(ox+i, oz+j, columns);
								if (new Date()-t0 > breakTime) //超时
									return setTimeout(()=>
										this.loadChunkAsync(cX, cZ, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx:i, dz:j+1, columns},
										}), 0);
							}
							dz = this.size[0].z;
							
							/*setTimeout(()=>{ //更新
								this.updateColumn(ox+dx, oz+this.size[0].z-1);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.updateColumn(ox+dx+1, dz);
							}, 0);*/
							if (progressCallback)
								progressCallback( (i-this.size[1].x)/(this.size[0].x-this.size[1].x) );
							
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>
									this.loadChunkAsync(cX, cZ, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dx:i-1, columns}
									}), 0);
						}
						/*setTimeout(()=>{ //更新
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
								this.updateColumn(ox+this.size[0].x, oz+dz);
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
							}
						},0);*/
						
						
						this.finishLoadChunk(cX, cZ); //区块加载完毕
						
						if (finishCallback) finishCallback();
						
						/* let dx = this.size[1].x;
						let loadChunk_id = setInterval(()=>{
							if (dx < this.size[0].x){
								setTimeout(()=>{
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
										this.updateColumn(ox+dx+1, oz+dz);
										this.updateColumn(ox+dx, oz+dz);
									}
								},0);
								clearInterval(loadChunk_id);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							
							
							dx--;
						},0); */
						break;
					}
				
				case "z+":
					{
						let t0 = +new Date(),
							num = 0;
						
						/*let dz;
						if (breakPoint){
							dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
							delete breakPoint.dz;
						}else{
							dz = this.size[0].z;
						}*/
						for (let j=dz; j<=this.size[1].z; j++){
							
							/*let dx;
							if (breakPoint){
								dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
								delete breakPoint.dx;
							}else{
								dx = this.size[0].x;
							}*/
							for (let i=dx; i<=this.size[1].x; i++){
								this.loadColumn(ox+i, oz+j, columns);
								
								if (new Date()-t0 > breakTime) //超时
									return setTimeout(()=>
										this.loadChunkAsync(cX, cZ, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx:i+1, dz:j, columns},
										}), 0);
							}
							dx = this.size[0].x;
							
							/*setTimeout(()=>{ //更新
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz-1);
							}, 0);*/
							if (progressCallback)
								progressCallback( (j-this.size[0].z)/(this.size[0].z-this.size[1].z) );
							
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>
									this.loadChunkAsync(cX, cZ, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dz:j+1, columns}
									}), 0);
						}
						/*setTimeout(()=>{ //更新
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
								this.updateColumn(ox+dx, oz+this.size[1].z);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
							}
						
						},0);*/
						
						this.finishLoadChunk(cX, cZ); //区块加载完毕
						
						if (finishCallback) finishCallback();
						
						/* let dz = this.size[0].z;
						let loadChunk_id = setInterval(()=>{
							if (dz > this.size[1].z){
								setTimeout(()=>{
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
										this.updateColumn(ox+dx, oz+dz-1);
										this.updateColumn(ox+dx, oz+dz);
									}
								},0);
								clearInterval(loadChunk_id);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
								this.loadColumn(ox+dx, oz+dz, columns);
							
							setTimeout(()=>{
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz-1);
							}, 0);
							
							dz++;
						},0); */
						break;
					}
				
				case "z-":
					{
						let t0 = +new Date(),
							num = 0;
						
						/*let dz;
						if (breakPoint){
							dz = breakPoint.dz==undefined? this.size[1].z: breakPoint.dz;
							delete breakPoint.dz;
						}else{
							dz = this.size[1].z;
						}*/
						for (let j=dz; j>=this.size[0].z; j--){
							
							/*let dx;
							if (breakPoint){
								dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
								delete breakPoint.dx;
							}else{
								dx = this.size[0].x;
							}*/
							for (let i=dx; i<=this.size[1].x; i++){
								this.loadColumn(ox+i, oz+j, columns);
								
								if (new Date()-t0 > breakTime) //超时
									return setTimeout(()=>
										this.loadChunkAsync(cX, cZ, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx:i+1, dz:j, columns},
										}), 0);
							}
							dx = this.size[0].x;
							
							/*setTimeout(()=>{ //更新
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz-1);
							}, 0);*/
							if (progressCallback)
								progressCallback( (j-this.size[1].dz)/(this.size[0].z-this.size[1].z) );
							
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>
									this.loadChunkAsync(cX, cZ, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dz:j-1, columns}
									}), 0);
						}
						/*setTimeout(()=>{ //更新
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
								this.updateColumn(ox+dx, oz+this.size[1].z);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
							}
						
						},0);*/
						
						this.finishLoadChunk(cX, cZ); //区块加载完毕
						
						if (finishCallback) finishCallback();
						
						/* let dz = this.size[1].z;
						let loadChunk_id = setInterval(()=>{
							if (dz < this.size[0].z){
								setTimeout(()=>{
									for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
										this.updateColumn(ox+dx, oz+dz+1);
										this.updateColumn(ox+dx, oz+dz);
									}
								},0);
								clearInterval(loadChunk_id);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
								this.loadColumn(ox+dx, oz+dz, columns);
							
							setTimeout(()=>{
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz+1);
							}, 0);
							
							dz--;
						},0); */
						break;
					}
				
				default: // "x+" or else
					{
						let t0 = +new Date(),
							num = 0;
						
						/*let dx;
						if (breakPoint){
							dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
							delete breakPoint.dx;
						}else{
							dx = this.size[0].x;
						}*/
						for (let i=dx; i<=this.size[1].x; i++){
							
							/*let dz;
							if (breakPoint){
								dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
								delete breakPoint.dz;
							}else{
								dz = this.size[0].z;
							}*/
							for (let j=dz; j<=this.size[1].z; j++){
								this.loadColumn(ox+i, oz+j, columns);
								if (new Date()-t0 > breakTime) //超时
									return setTimeout(()=>
										this.loadChunkAsync(cX, cZ, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx:i, dz:j+1, columns},
										}), 0);
							}
							dz = this.size[0].z;
							
							/*setTimeout(()=>{ //更新
								this.updateColumn(ox+dx, oz+this.size[0].z-1);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.updateColumn(ox+dx+1, dz);
							}, 0);*/
							if (progressCallback)
								progressCallback( (i-this.size[0].x)/(this.size[1].x-this.size[0].x) );
							
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>
									this.loadChunkAsync(cX, cZ, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dx:i+1, columns}
									}), 0);
						}
						/*setTimeout(()=>{ //更新
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
								this.updateColumn(ox+this.size[0].x, oz+dz);
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
							}
						
						},0);*/
						
						this.finishLoadChunk(cX, cZ); //区块加载完毕
						
						if (finishCallback) finishCallback();
						
						/* let dx = this.size[0].x;
						let loadChunk_id = setInterval(()=>{
							if (dx > this.size[1].x){
								setTimeout(()=>{
									for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
										this.updateColumn(ox+dx-1, oz+dz);
										this.updateColumn(ox+dx, oz+dz);
									}
								},0);
								clearInterval(loadChunk_id);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
								this.loadColumn(ox+dx, oz+dz, columns);
							
							setTimeout(()=>{
								this.updateColumn(ox+dx, oz+this.size[0].z-1);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.updateColumn(ox+dx-1, dz);
							}, 0);
							
							dx++;
						},0); */
						break;
					}
				
			}
		};
		if (breakPoint.columns){
			func( breakPoint.columns );
		}else if (this.chunks[cX] && this.chunks[cX][CZ] && this.chunks[cX][CZ].edit){
			const edit = this.chunks[cX][CZ].edit;
			func( this.preGetChunk(cX, cZ, edit) );
		}else{
			DB.readChunk(cX, cZ).then((edit)=>{
				console.log("edit(DB):", cX, cZ, edit);
				this.startLoadChunk(cX, cZ, edit); //初始化区块
				func( this.preGetChunk(cX, cZ, edit) );
			});
			/* const edit = [];
			db.readStep(DB.TABLE.WORLD, {
				index: "type",
				range: ["only", DB.TYPE.Block], //方块
				stepCallback: (res)=>{
					if (
						res.x >= ox+this.size[0].x && res.x <= ox+this.size[1].x &&
						res.z >= oz+this.size[0].z && res.z <= oz+this.size[1].z
					) edit.push(res);
				},
				successCallback: ()=>{
					console.log("edit(DB):", cX, cZ, edit);
					this.startLoadChunk(cX, cZ, edit); //初始化区块
					func( this.preGetChunk(cX, cZ, edit) );
				},
			}); */
			/*sql.selectData(tableName, ["x", "y", "z", "id", "attr"],
				`type=0 AND`+
				` (x BETWEEN ${ ox+this.size[0].x } AND ${ ox+this.size[1].x }) AND`+
				` (z BETWEEN ${ oz+this.size[0].z } AND ${ oz+this.size[1].z })`,
				(edit)=>{
					console.log("edit(sql):", edit);
					func(new Array(...edit));
				}
			);*/
		}
	}
	//加载区块（生成器异步）
	loadChunkGenerator(cX, cZ, opt={}){
		return new Promise((resolve, reject)=>{
			let {
				// finishCallback,
				progressCallback,
				breakTime=66, // 最大执行时间/ms
				mostSpeed=2, // 最大速度/次
				dir="" //方向
			} = opt;
			
			cX=Math.round(cX), cZ=Math.round(cZ); //规范化
			const ox = cX*this.size.x,
				oz = cZ*this.size.z; //区块中心坐标
			
			// console.log("loadChunkGenerator", [cX, cZ], this.getInitedChunks())
			if ( this.getInitedChunks().some(v => v[0]==cX && v[1]==cZ) ) //已初始化
				return console.warn("loadChunkGenerator", cX, cZ, "already inited");
			
			const gen = function* (columns, _this){
				switch ( dir.substr(0,2) ){
					case "x-":
						for (let i=_this.size[1].x; i>=_this.size[0].x; i--){
							for (let j=_this.size[0].z; j<=_this.size[1].z; j++){
								_this.loadColumn(ox+i, oz+j, columns);
								yield; //判断超时
							}
							// console.log("load", cX, cZ, i)
							if (progressCallback)
								progressCallback( (i-_this.size[1].x)/(_this.size[0].x-_this.size[1].x) );
							yield true; //判断超数
						}
						
						_this.finishLoadChunk(cX, cZ); //区块加载完毕
						break;
					
					case "z+":
						for (let j=_this.size[0].z; j<=_this.size[1].z; j++){
							for (let i=_this.size[0].x; i<=_this.size[1].x; i++){
								_this.loadColumn(ox+i, oz+j, columns);
								yield; //判断超时
							}
							// console.log("load", cX, cZ, j)
							if (progressCallback)
								progressCallback( (j-_this.size[0].z)/(_this.size[0].z-_this.size[1].z) );
							yield true; //判断超数
						}
						
						_this.finishLoadChunk(cX, cZ); //区块加载完毕
						break;
					
					case "z-":
						for (let j=_this.size[1].z; j>=_this.size[0].z; j--){
							for (let i=_this.size[0].x; i<=_this.size[1].x; i++){
								_this.loadColumn(ox+i, oz+j, columns);
								yield; //判断超时
							}
							// console.log("load", cX, cZ, j)
							if (progressCallback)
								progressCallback( (j-_this.size[1].dz)/(_this.size[0].z-_this.size[1].z) );
							yield true; //判断超数
						}
						
						_this.finishLoadChunk(cX, cZ); //区块加载完毕
						break;
					
					default:
						for (let i=_this.size[0].x; i<=_this.size[1].x; i++){
							for (let j=_this.size[0].z; j<=_this.size[1].z; j++){
								_this.loadColumn(ox+i, oz+j, columns);
								yield; //判断超时
							}
							// console.log("load", cX, cZ, i)
							if (progressCallback)
								progressCallback( (i-_this.size[0].x)/(_this.size[1].x-_this.size[0].x) );
							yield true; //判断超数
						}
						
						_this.finishLoadChunk(cX, cZ); //区块加载完毕
						break;
				}
			}
			
			DB.readChunk(cX, cZ).then((edit)=>{
				this.startLoadChunk(cX, cZ, edit); //初始化区块
				const gener = gen( this.preGetChunk(cX, cZ, edit), this ),
					id = setInterval(function work(){
						let res = {},
							t0 = +new Date(),
							num = 0;
						while ( !res.done ){
							res = gener.next();
							if (new Date()-t0 >= breakTime) //超时
								return;
							if (res.value == true && ++num >= mostSpeed) //超数
								return;
						}
						// if (finishCallback) finishCallback(); //加载完毕
						clearInterval(id); //运行结束
						resolve(); //加载完毕
					}, 0);
			});
			/* const edit = [];
			console.time(">>>>>>		>>>>>>loadChunk "+cX+","+cZ)
			db.readStep(DB.TABLE.WORLD, {
				index: "type",
				range: ["only", 1], //方块
				stepCallback: (res)=>{
					if (
						res.x >= ox+this.size[0].x && res.x <= ox+this.size[1].x &&
						res.z >= oz+this.size[0].z && res.z <= oz+this.size[1].z
					) edit.push(res);
				},
				successCallback: ()=>{
					console.timeEnd(">>>>>>		>>>>>>loadChunk "+cX+","+cZ)
					console.log("edit(DB):", cX, cZ, edit);
					this.startLoadChunk(cX, cZ, edit); //开始加载区块
					
					const gener = gen( this.preGetChunk(cX, cZ, edit), this ),
						id = setInterval(function work(){
							let res = {},
								t0 = +new Date(),
								num = 0;
							while ( !res.done ){
								res = gener.next();
								if (new Date()-t0 >= breakTime) //超时
									return;
								if (res.value == true && ++num >= mostSpeed) //超数
									return;
							}
							// if (finishCallback) finishCallback(); //加载完毕
							clearInterval(id); //运行结束
							resolve(); //加载完毕
						}, 0);
					return id;
				},
			}); */
		});
	}
	
	//卸载区块（同步）
	unloadChunk(cX, cZ){
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( !this.getLoadedChunks().some(v => v[0]==cX && v[1]==cZ) ) //已卸载
			return console.warn("unloadChunk", cX, cZ, "already unload");
		
		this.startUnloadChunk(cX, cZ); //开始卸载区块
		
		//删除实体
		for (const e of this.chunks[cX][cZ].entity){
			scene.remove(e.block.mesh);
			e.deleteMaterial().deleteGeometry().deleteMesh();
		}
		//删除方块
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++)
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					const block = this.get(ox+dx, dy, oz+dz);
					if ( block ) this.delete(block);
				}
		
		this.finishUnloadChunk(cX, cZ); //完成卸载区块
	}
	//卸载区块（异步）
	unloadChunkAsync(cX, cZ, opt={}){
		let {
			finishCallback,
			progressCallback,
			breakTime=66, // 最大执行时间/ms
			mostSpeed=2, // 最大次数/次
			breakPoint={}
		} = opt,
		{
			dx=this.size[0].x,
			dy=this.size[0].y,
			dz=this.size[0].z
		} = breakPoint;
		
		cX = Math.round(cX), cZ = Math.round(cZ); //规范化
		const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
		
		if ( !this.getLoadedChunks().some(v => v[0]==cX && v[1]==cZ) && !Object.keys(breakPoint).length ) //已卸载
			return console.warn("unloadChunkAsync", cX, cZ, "already unload");
		
		if (Object.keys(breakPoint).length < 3)
			this.startUnloadChunk(cX, cZ); //开始卸载区块
		
		let t0 = +new Date(),
			num = 0;
		//删除实体
		for (const e of this.chunks[cX][cZ].entity){
			scene.remove(e.block.mesh);
			e.deleteMaterial().deleteGeometry().deleteMesh();
		}
		//删除方块
		for (let i=dx; i<=this.size[1].x; i++){
			for (let j=dy; j<=this.size[1].y; j++){
				for (let k=dz; k<=this.size[1].z; k++){
					
					const block = this.get(ox+i, j, oz+k);
					if ( block ) this.delete(block);
					
				}
				dz = this.size[0].z;
				
				if (new Date()-t0 > breakTime) //超时
					return setTimeout(()=>
						this.unloadChunkAsync(cX, cZ, {
							finishCallback,
							progressCallback,
							breakTime,
							mostSpeed,
							breakPoint: {dx:i, dy:j, dz:k+1}
						}), 0
					);
			}
			dy = this.size[0].y;
			
			if (progressCallback)
				progressCallback( (dx-this.size[0].x)/(this.size[1].x-this.size[0].x) )
			if (++num >= mostSpeed) //超数
				return setTimeout(()=>
					this.unloadChunkAsync(cX, cZ, {
						finishCallback,
						progressCallback,
						breakTime,
						mostSpeed,
						breakPoint: {dx:i+1}
					}), 0
				);
		}
		
		this.finishUnloadChunk(cX, cZ); //完成卸载区块
		
		if (finishCallback) finishCallback();
		
			/* let dx = this.size[0].x;
			let unloadChunk_id = setInterval(()=>{
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
					clearInterval(unloadChunk_id);
					if (finishCallback)
						finishCallback();
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
			},0); */
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
	}
	//卸载区块（生成器异步）
	unloadChunkGenerator(cX, cZ, opt={}){
		return new Promise((resolve, reject)=>{
			let {
				// finishCallback,
				progressCallback,
				breakTime=66, // 最大执行时间/ms
				mostSpeed=2 // 最大次数/次
			} = opt;
			
			cX = Math.round(cX), cZ = Math.round(cZ); //规范化
			const [ox, oz] = this.c2o(cX, cZ); //区块中心坐标
			
			// console.log("unloadChunkGenerator", [cX, cZ], this.getLoadedChunks())
			if ( !this.getLoadedChunks().some(v => v[0]==cX && v[1]==cZ) ) //已卸载
				return console.warn("unloadChunkGenerator", cX, cZ, "already unload");
			
			this.startUnloadChunk(cX, cZ); //开始卸载区块
			
			const gen = function* (_this){
				//删除实体
				for (const e of _this.chunks[cX][cZ].entity){
					scene.remove(e.block.mesh);
					e.deleteMaterial().deleteGeometry().deleteMesh();
				}
				//删除方块
				for (let i=_this.size[0].x; i<=_this.size[1].x; i++){
					for (let j=_this.size[0].y; j<=_this.size[1].y; j++){
						for (let k=_this.size[0].z; k<=_this.size[1].z; k++){
							
							const block = _this.get(ox+i, j, oz+k);
							if ( block ) _this.delete(block);
							
						}
						yield; //判断超时
					}
					// console.log("unload", cX, cZ, i)
					if (progressCallback)
						progressCallback( (i-_this.size[0].x)/(_this.size[1].x-_this.size[0].x) )
					yield true; //判断超数
				}
				
				
				_this.finishUnloadChunk(cX, cZ); //完成卸载区块
			}
			
			const gener = gen( this ),
				id = setInterval(function work(){
					let res = {},
						t0 = +new Date(),
						num = 0;
					while ( !res.done ){
						res = gener.next();
						if (new Date()-t0 >= breakTime) //超时
							return;
						if (res.value == true && ++num >= mostSpeed) //超数
							return;
					}
					// if (finishCallback) finishCallback(); //卸载完毕
					clearInterval(id); //运行结束
					resolve(); //卸载完毕
				}, 0);
			// return id;
		});
	}
	
	//预加载区块
	preloadChunk(opt={}){
		return new Promise((resolve, reject)=>{
			let {
				length=this.preloadLength, //加载范围（视野）
				progressCallback,
				updateCallback,
				//finishCallback
			} = opt;
			const chunks = [];
			for (let x=-length; x<=length; x+=this.size.x){
				for (let z=-length; z<=length; z+=this.size.z){
					const push = [
							Math.round( (deskgood.pos.x+x)/100/this.size.x ),
							Math.round( (deskgood.pos.z+z)/100/this.size.z )
						],
							dx = push[0]*this.size.x*100 - deskgood.pos.x,
							dz = push[1]*this.size.z*100 - deskgood.pos.z; //区块中心到玩家的距离
					push[2] = (
						Math.abs(dx) >= Math.abs(dz) ?(
							dx >= 0? "x+": "x-"
						): (
							dz >= 0? "z+": "z-"
						)
					);
						/*(
							(x>=0 && z>=0)? (
								Math.abs(x)>=Math.abs(z)?
									"x+"
								:
									"z+"
							):(x>=0 && z<0)? (
								Math.abs(x)>=Math.abs(z)?
									"x+"
								:
									"z-"
							):(x<0 && z>=0)? (
								Math.abs(x)>=Math.abs(z)?
									"x-"
								:
									"z+"
							): (
								Math.abs(x)>=Math.abs(z)?
									"x-"
								:
									"z-"
							)
						)
					];*/
					if ( !chunks.some(v => v[0]==push[0] && v[1]==push[1]) ) //没有相同的
						chunks.push(push);
				}
			}
			
			let loading=0, total=0; //当前正在加载 和 需加载总数
			
			if ( !chunks.length ){
				resolve();
				return console.warn("chunk_preload chunks:", chunks);
			}
			
			for (let i=chunks.length-1; i>=0; i--){
				const [cX, cZ] = chunks[i];
				if ( this.getInitedChunks().every(function(value, index, arr){
					return value[0] != cX || value[1] != cZ;
				}) ){ //每个都不一样（不存在 & 不在加载中）
					// this.initChunk(cX, cZ);
					loading++;
					
					//用噪声填充区块
					this.loadChunkGenerator(cX, cZ, {
						breakTime: 16,
						dir: chunks[i][2],
						progressCallback: (v)=>{
							loading -= 1/this.size.x;
							if (progressCallback)
								progressCallback((total-loading) / total); //反馈进度
						}
					}).then(()=>{
						if (loading < 1e-6){ //完成所有
							resolve();
						}else if (progressCallback){
							progressCallback((total-loading) / total); //反馈进度
						}
					});
				}
			}
			
			for (const i of this.getLoadedChunks())
				if (
					// (i[0] != 0 || i[1] != 0)&& //不是出生区块
					chunks.every((value, index, arr)=>{
						return i[0] != value[0] || i[1] != value[1];
					}) //不与任何chunk相等
				){
					loading++;
					const [cX, cZ] = i;
					//卸载区块
					this.unloadChunkGenerator(cX, cZ, {
						breakTime: 16,
						progressCallback: (v)=>{
							loading -= 1/(this.size.x);
							if (progressCallback)
								progressCallback((total-loading) / total); //反馈进度
						}
					}).then(()=>{
						if (loading < 1e-6){ //完成所有
							resolve();
						}else if (progressCallback){
							progressCallback((total-loading) / total); //反馈进度
						}
					});
				}
			
			total = loading;
		});
	}
	
}
