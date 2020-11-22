class ChunkMap{
	constructor (size, seed, perloadLength){
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
		this.initedChunk = [];
		//活动区块（加载完毕）
		this.activeChunk = [];
		//区块编辑情况
		this.edit = [];
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
		}
	}
	
	
	//获取方块（不可编辑）
	get(x, y, z){  // 没有方块:null,不在范围:undefined,加载中:false
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		if (this.map[x] && this.map[x][y]){
			return this.map[x][y][z];
		}else{
			return undefined;
		}
		
		/*try{
			return this.map[x][y][z];
		}catch(err){ //超过范围
			return undefined;
		}*/
	}
	set(x, y, z, value){
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		if (!this.map[x])
			this.map[x] = [];
		if (!this.map[x][y])
			this.map[x][y] = [];
		this.map[x][y][z] = value;
	}
	
	//添加方块
	add(thing, pos, type=true){
		// let {type=true} = opt;
		[pos.x, pos.y, pos.z] = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)]; //规范化
		
		// if (this.get(pos.x, pos.y, pos.z) === undefined) return;
		if ( this.get(pos.x, pos.y, pos.z) ){ //有方块
			if (type){ //替换
				for (let i of this.map[pos.x][pos.y][pos.z].block.mesh.material)
					i.dispose();
				this.map[pos.x][pos.y][pos.z].block.mesh.geometry.dispose(); //清除内存
				scene.remove(this.map[pos.x][pos.y][pos.z].block.mesh);
				// this.map[pos.x][pos.y][pos.z] = null;
				delete this.map[pos.x][pos.y][pos.z];
				/*if (this.map[pos.x][pos.y].every(v => !v))
					delete this.map[pos.x][pos.y];
				if (this.map[pos.x].every(v => !v))
					delete this.map[pos.x];*/
			}else{ //不替换
				return;
			}
		}
		
		thing.block.mesh.position.x = pos.x*100;
		thing.block.mesh.position.y = pos.y*100;
		thing.block.mesh.position.z = pos.z*100;
		
		this.set(pos.x, pos.y, pos.z, thing);
		scene.add(thing.block.mesh); //网格模型添加到场景中
		thing.block.addTo = true;
	}
	
	//根据 模板和ID 添加方块
	addID(id, pos, template, opt={}){
		let {type=true, attr={}} = opt;
		/* if (typeof type != "boolean"){
			[type, attr] = [undefined, type];
		} */
		// if (!attr.block) attr.block = {};
		if (id == 0){
			[pos.x, pos.y, pos.z] = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)]; //规范化
			if (this.get(pos.x, pos.y, pos.z)){ //有方块
				for (let i of this.map[pos.x][pos.y][pos.z].block.mesh.material)
					i.dispose();
				this.map[pos.x][pos.y][pos.z].block.mesh.geometry.dispose(); //清除内存
				scene.remove(this.map[pos.x][pos.y][pos.z].block.mesh);
			}
			// this.map[pos.x][pos.y][pos.z] = null; //空气
			this.set(pos.x, pos.y, pos.z, null);
			/* if (this.map[pos.x][pos.y].every(v => !v))
				delete this.map[pos.x][pos.y];
			if (this.map[pos.x].every(v => !v))
				delete this.map[pos.x]; */
			
			return;
		}
		
		let thing = new Block({
			id,
			attr
		})
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
			type
		); //以模板建立
	}
	
	//删除方块
	delete(x, y, z){
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		if (!this.get(x,y,z)) // 没有方块(null)/不在范围(undefined)/加载中(false)
			return;
		
		for (let i of this.map[x][y][z].block.mesh.material)
			i.dispose();
		this.map[x][y][z].block.mesh.geometry.dispose(); //清除内存
		scene.remove(this.map[x][y][z].block.mesh);
		delete this.map[x][y][z];
		if (this.map[x][y].every(v => !v))
			delete this.map[x][y];
		if (this.map[x].every(v => !v))
			delete this.map[x];
	}
	
	
	//更新方块
	update(x, y, z, b){
		x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		
		let thisBlock = this.get(x,y,z);
		if (thisBlock === null) //空气    //没有方块(null)/不在范围(undefined) //加载中(false)
			return;
		let visibleValue;
		if (thisBlock === undefined){ //未加载
			let [xZ, zZ] = [Math.round(x/map.size.x), Math.round(z/map.size.z)], //所属区块(Chunk)
				edit = this.edit[xZ] && this.edit[xZ][zZ],
				get = new Block( this.perGet(x, y, z, edit||[]) ),
				noTransparent = get.id && get.get("attr", "block", "noTransparent");
			visibleValue = [
				!( this.get(x+1, y, z) && !this.get(x+1, y, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x-1, y, z) && !this.get(x-1, y, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y+1, z) && !this.get(x, y+1, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y-1, z) && !this.get(x, y-1, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y, z+1) && !this.get(x, y, z+1).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y, z-1) && !this.get(x, y, z-1).get("attr", "block", "transparent")) || noTransparent
				// 没有方块 或 有方块非透明 则显示  或  自身透明 也显示
			];
			if (b) console.warn(thisBlock,visibleValue)
			if (visibleValue.some(v => v) && this.initedChunk.some(v => v[0]==xZ && v[1]==zZ)){ //不可隐藏（有面true） and 在加载区块内
				this.addID(get.id, {
					x,
					y,
					z,
				}, TEMPLATES, {
					attr: get.attr
				});
				thisBlock = this.get(x,y,z);
			}
			if (!thisBlock) //undefined（无需加载） or null（加载为空气）
				return;
		}else{
			let noTransparent =  thisBlock.get("attr", "block", "noTransparent");
			visibleValue = [
				!( this.get(x+1, y, z) && !this.get(x+1, y, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x-1, y, z) && !this.get(x-1, y, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y+1, z) && !this.get(x, y+1, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y-1, z) && !this.get(x, y-1, z).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y, z+1) && !this.get(x, y, z+1).get("attr", "block", "transparent")) || noTransparent,
				!( this.get(x, y, z-1) && !this.get(x, y, z-1).get("attr", "block", "transparent")) || noTransparent
				// 没有方块 或 有方块非透明 则显示  或  自身透明 也显示
			];
			if (b) console.warn(thisBlock,visibleValue)
		}
		
		/*if (thisBlock === undefined){ //未加载
			let [xZ, zZ] = [x/map.size.x, z/map.size.z].map(Math.round); //所属区块(Chunk)
			if (visibleValue.some(v => v) && this.initedChunk.some(v => v[0]==xZ && v[1]==zZ)){ //不可隐藏（有面true） and 在加载区块内
				let edit = this.edit[xZ] && this.edit[xZ][zZ];
				let get = this.perGet(x, y, z, edit||[]);
				this.addID(get.id, {
					x,
					y,
					z,
				}, TEMPLATES, {
					attr: get.attr
				});
				thisBlock = this.get(x,y,z);
			}
			if (!thisBlock) //undefined（仍未加载） or null（加载为空气）
				return;
		}*/
		let material = thisBlock.block.material;
		for (let i in material)
			material[i].visible = visibleValue[i];
		
		if (thisBlock.block.addTo == true && visibleValue.every(value => !value)){ //已加入 and 可隐藏（每面都false）
			scene.remove(thisBlock.block.mesh);
			thisBlock.block.addTo = false;
			// console.log("隐藏", this.map[x][y][z])
		}
		if (thisBlock.block.addTo == false && visibleValue.some(value => value)){ //未加入 and 不可隐藏（有面true）
			scene.add(thisBlock.block.mesh);
			thisBlock.block.addTo = true;
			// console.log("显示", this.map[x][y][z])
		}
		
		/* try{
			if (thisBlock === undefined && visibleValue.some(value => value)){ //未加载 且 不可隐藏（有面true）
				let edit = this.edit[Math.round(x/map.size.x)] && this.edit[Math.round(x/map.size.x)][Math.round(z/map.size.z)];
				let get = this.perGet(x, y, z, edit||[]);
				this.addID(get.id, {
					x,
					y,
					z,
				}, TEMPLATES, {
					attr: get.attr
				});
				console.log(this.get(x,y,z), thisBlock)
				thisBlock = this.get(x,y,z);
				if (thisBlock === null) //空气
					return;
			}
			console.log(this.get(x,y,z), thisBlock)
			let material = thisBlock.block.material;
			for (let i in material)
				material[i].visible = visibleValue[i];
			
			if (thisBlock.block.addTo == true && visibleValue.every(value => !value)){ //已加入 且 可隐藏（每面都false）
				scene.remove(thisBlock.block.mesh);
				thisBlock.block.addTo = false;
				// console.log("隐藏", this.map[x][y][z])
			}
			if (thisBlock.block.addTo == false && visibleValue.some(value => value)){ //未加入 且 不可隐藏（有面true）
				scene.add(thisBlock.block.mesh);
				thisBlockblock.addTo = true;
				// console.log("显示", this.map[x][y][z])
			}
		}catch(e){
			debugger
		} */
		
	}
	
	//更新方块及周围
	updateRound(x,y,z){
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
		let yMax = this.size[1].y;
		for (let dy=this.size[0].y; dy<=yMax; dy++)
			this.update(x, dy, z);
	}
	
	//更新区块内所有方块（同步）
	updateChunk(x, z){
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					this.update(ox+dx, dy, oz+dz);
				}
			}
		}
	}
	//更新区块内所有方块（异步）
	updateChunkAsync(x, z, opt={}){
		let {
			finishCallback,
			progressCallback,
			breakTime, // 最大执行时间/ms
			mostSpeed, // 最大速度/次
			breakPoint
		} = opt;
		// console.log("update", x, z, finishCallback, progressCallback)
		
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		if (finishCallback || progressCallback || breakTime || mostSpeed){ // 有回调（必须setInterval）or限速
			breakTime = breakTime || 66;
			mostSpeed = mostSpeed || 2;
			let t0 = new Date(),
				num = 0;
			
			let dx;
			if (breakPoint){
				dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
				delete breakPoint.dx;
			}else{
				dx = this.size[0].x;
			}
			for (; dx<=this.size[1].x; dx++){
				
				let dz;
				if (breakPoint){
					dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
					delete breakPoint.dz;
				}else{
					dz = this.size[0].z;
				}
				for (; dz<=this.size[1].z; dz++){
					
					if (new Date()-t0 > breakTime) //超时
						return setTimeout(()=>{
							this.updateChunkAsync(x, z, {
								finishCallback,
								progressCallback,
								breakTime,
								breakPoint: {dx, dz}
							});
						},0);
					for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
						this.update(ox+dx, dy, oz+dz);
					}
					
				}
				if (progressCallback)
					progressCallback((dx-this.size[0].x)/(this.size[1].x-this.size[0].x));
				if (++num >= mostSpeed) //超数
					return setTimeout(()=>{
						this.updateChunkAsync(x, z, {
							finishCallback,
							progressCallback,
							breakTime,
							breakPoint: {dx:dx+1, dz:0}
						});
					},0);
			}
			if (finishCallback) finishCallback();
			/* let dx = this.size[0].x;
			let updateChunk_id = setInterval(()=>{
				if (dx > this.size[1].x){
					clearInterval(updateChunk_id);
					finishCallback();
					return;
				}
				
				//正常代码
				for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
						this.update(ox+dx, dy, oz+dz);
					}
				}
				
				dx++;
				
				if (progressCallback)
					progressCallback((dx-this.size[0].x)/(this.size[1].x-this.size[0].x));
			},0); */
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
	}
	
	
	/* //初始化区块
	initChunk(x, z){
		[x, z] = [Math.round(pos.x), Math.round(pos.z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		if (this.initedChunk.every(function(value, index, arr){
			return value[0] != x || value[1] != z;
		})) //每个都不一样（不存在）
			this.initedChunk.push([x,z]);
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			this.map[ox+dx] = this.map[ox+dx] || [];
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++){
				this.map[ox+dx][dy] = this.map[ox+dx][dy] || [];
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
					this.map[ox+dx][dy][oz+dz] = false/* null *//*;
				}
			}
		}
	} */
	
	perGet(x, y, z, edit){
		// x=Math.round(x), y=Math.round(y), z=Math.round(z); //规范化
		// console.warn("load", x, z)
		
		let height = sNoise.height(this.seed.noise, this.seed.h, x, z);
		if (height < this.size[0].y){
			height = this.size[0].y;
		}else if (height > this.size[1].y){
			height = this.size[1].y;
		}
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
		let type = sNoise.type(this.seed.noise, this.seed.t, x, z);
		// 90%+ 高原（草木不生，积雪覆盖）
		// 70%+ 高山（无树，有草）
		// 26+ 丘陵（树）
		let treeTop = null; //保留最高树干坐标
		let earth = height - height * sNoise.dirt(this.seed.noise, this.seed.d, x, z);
		let treeHeight = height + sNoise.treeHeight(this.seed.noise, this.seed.tH, x, z);
		
		for (let i=edit.length-1; i>=0; i--){
			let value = edit[i];
			if (
				value.x == x &&
				value.y == y &&
				value.z == z
			){ //被编辑
				return {
					id: value.id,
					attr: value.attr
				};
			}
		}
		//未编辑
		
		/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
		t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
		let id = 0;
		switch (type){
			case 0: //森林
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				}else */if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
					treeHeight = height;
				}
				if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)) //石头上不长树
					treeHeight = height;
				
				if (y > treeHeight){
					id = 0; // 空气/真空 (null)
				}else if (y > height){
					if (!treeTop) treeTop = y;
					id = 8.1; //橡木
				}else if (y == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						id = 5; //草方块
					}else{
						id = 2; //草方块
					}
				}else if (y > earth){
					// if (grass){
						id = 3; //泥土
					/* }else{
						id = 2; //草方块
						// grass = true;
					} */
				}/*else if (y == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						id = 2; //草方块
						grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
				
			case 1: //草原
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				} */
				
				if (y > height){
					id = 0; // 空气/真空 (null)
				}/* else if (y > height){
					if (!treeTop) treeTop = y;
					id = 8.1; //橡木
				} */else if (y == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						id = 5; //草方块
					}else{
						id = 2; //草方块
					}
				}else if (y > earth){
					// if (grass){
						id = 3; //泥土
					/* }else{
						id = 2; //草方块
						// grass = true;
					} */
				}/*else if (y == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						id = 2; //草方块
						// grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
				
			case 2: //沙漠
				
				if (y > height){
					id = 0; // 空气/真空 (null)
				}else if (y > earth){
					id = 6; //沙子
				}/*else if (y == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
						id = 6; //沙子
						grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
			
			default:
				id = 0;
		}
		
		return {id};
	}
	
	perGetColumn(x, z, edit){
		// [x, z] = [Math.round(x), Math.round(z)]; //规范化
		// console.warn("load", x, z)
		
		let column = [];
		let height = sNoise.height(this.seed.noise, this.seed.h, x, z);
		if (height < this.size[0].y){
			height = this.size[0].y;
		}else if (height > this.size[1].y){
			height = this.size[1].y;
		}
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
		let type = sNoise.type(this.seed.noise, this.seed.t, x, z);
		// 90%+ 高原（草木不生，积雪覆盖）
		// 70%+ 高山（无树，有草）
		// 26+ 丘陵（树）
		let treeTop = null; //保留最高树干坐标
		let earth = height - height * sNoise.dirt(this.seed.noise, this.seed.d, x, z);
		let treeHeight = height + sNoise.treeHeight(this.seed.noise, this.seed.tH, x, z);
		for (let dy=this.size[1].y; dy>=this.size[0].y; dy--){ //注意：从上到下
			
			let edited = false;
			for (let i = edit.length-1; i>=0; i--){
				let value = edit[i];
				if (
					value.x == x &&
					value.y == dy &&
					value.z == z
				){ //被编辑
					column.push({
						id: value.id,
						attr: value.attr
					});
					edited = true;
				}
			}
			if (edited) continue;
			//未编辑
			
			/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
			t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
			let id = 0;
			switch (type){
				case 0: //森林
					
					/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					}else */if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
						treeHeight = height;
					}
					if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)) //石头上不长树
						treeHeight = height;
					
					if (dy > treeHeight){
						id = 0; // 空气/真空 (null)
					}else if (dy > height){
						if (!treeTop) treeTop = dy;
						id = 8.1; //橡木
					}else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
						if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 5; //草方块
						}else{
							id = 2; //草方块
						}
					}else if (dy > earth){
						// if (grass){
							id = 3; //泥土
						/* }else{
							id = 2; //草方块
							// grass = true;
						} */
					}/*else if (dy == 0){
						id = 2; //基岩
					}*/else{
						/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 2; //草方块
							grass = true;
						}else{ */
							id = 5; //石头
						// }
					}
					break;
					
				case 1: //草原
					
					/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
						grass = true;
					} */
					
					if (dy > height){
						id = 0; // 空气/真空 (null)
					}/* else if (dy > height){
						if (!treeTop) treeTop = dy;
						id = 8.1; //橡木
					} */else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
						if (sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 5; //草方块
						}else{
							id = 2; //草方块
						}
					}else if (dy > earth){
						// if (grass){
							id = 3; //泥土
						/* }else{
							id = 2; //草方块
							// grass = true;
						} */
					}/*else if (dy == 0){
						id = 2; //基岩
					}*/else{
						/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 2; //草方块
							// grass = true;
						}else{ */
							id = 5; //石头
						// }
					}
					break;
					
				case 2: //沙漠
					
					if (dy > height){
						id = 0; // 空气/真空 (null)
					}else if (dy > earth){
						id = 6; //沙子
					}/*else if (dy == 0){
						id = 2; //基岩
					}*/else{
						/* if (!grass && !sNoise.openStone(this.seed.noise, this.seed.oS, x, z)){
							id = 6; //沙子
							grass = true;
						}else{ */
							id = 5; //石头
						// }
					}
					break;
				
				default:
					id = 0;
			}
			
			column.push({ id });
		}
		
		return column.reverse();
		/* if (treeTop){ //非强制添加树叶(9)
			setTimeout(()=>{
				this.addID(9, {
					x: x,
					y: treeTop+1,
					z: z
				}, template, {
					type: false
				});
				let leavesHeight = sNoise.leavesScale(this.seed.noise, this.seed.lS, x, z) *(treeHeight - height);
				for (let i=0; i<=leavesHeight; i++){
					this.addID(9, {
						x: x+1,
						y: treeTop-i,
						z: z
					}, template, {
						type: false
					});
					this.addID(9, {
						x: x-1,
						y: treeTop-i,
						z: z
					}, template, {
						type: false
					});
					this.addID(9, {
						x: x,
						y: treeTop-i,
						z: z+1
					}, template, {
						type: false
					});
					this.addID(9, {
						x: x,
						y: treeTop-i,
						z: z-1
					}, template, {
						type: false
					});
				}
			}, 1000);
			
		} */
	}
	/*perGetColumn_worker(x, z, edit, finishCallback){
		let worker = new Worker("./perGetColumn_worker.js");
		worker.postMessage({x, z, edit, t:this.seed});
		worker.onmessage = function (event) {
			console.log("Received message from", "perGetColumn_worker.js", event.data);
			finishCallback(event.data);
		}
	}*/
	
	perGetChunk(x, z, edit){
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		let result = [];
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
			result[dx] = [];
			for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
				result[dx][dz] = this.perGetColumn(ox+dx, oz+dz, edit);
				for (let y in result[dx][dz])
					result[dx][dz][y] = new Block(result[dx][dz][y]);
			}
		}
		return result;
	}
	/*perGetChunk_worker(x, z, edit, opt){
		let {
			finishCallback,
			progressCallback
		} = opt;
		
		let worker = new Worker("./perGetChunk_worker.js");
		worker.postMessage({x, z, edit, t:this.seed});
		worker.onmessage = function (event) {
			console.log("Received message from", "perGetChunk_worker.js", event.data);
			switch (event.data.type){
				case "progressCallback":
					progressCallback(event.data.value);
					break;
				case "finishCallback":
					finishCallback(event.data.value);
					worker.terminate(); //关闭线程
					break;
			}
		}
	}*/
	
	//加载列
	loadColumn(x, z, columns, edit){
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = Math.round(x/map.size.x)*map.size.x,
			oz = Math.round(z/map.size.z)*map.size.z;
		let [dx, dz] = [x-ox, z-oz];
		
		for (let y=this.size[0].y; y<=this.size[1].y; y++){
			if (columns[dx][dz][y].id){ //有方块
				if (!(
					y != this.size[0].y && //不在最底层
					y != this.size[1].y && //不在最顶层
					columns[dx][dz][y+1].id &&
					columns[dx][dz][y-1].id &&
					columns[dx+1] && columns[dx+1][dz] && columns[dx+1][dz][y].id &&
					columns[dx-1] && columns[dx-1][dz] && columns[dx-1][dz][y].id &&
					columns[dx][dz+1] && columns[dx][dz+1][y].id &&
					columns[dx][dz-1] && columns[dx][dz-1][y].id
				)){ //都没有方块
					this.add(
						columns[dx][dz][y]
							.makeMaterial()
							.deleteTexture()
							.makeMesh(),
						{x, y, z}
					);
				}
			}else{ //空气
				this.addID(0, {
					x,
					y,
					z
				}, TEMPLATES);
			}
		}
	}
	
	//加载区块（同步）
	loadChunk(x, z){
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
			
		sql.selectData("file", ["x", "y", "z", "id", "attr"],
			`type=0 AND`+
			` (x BETWEEN ${ ox+this.size[0].x } AND ${ ox+this.size[1].x }) AND`+
			` (z BETWEEN ${ oz+this.size[0].z } AND ${ oz+this.size[1].z })`,
			(edit)=>{
				console.log("edit(sql):", edit);
				
				//保存edit
				if (!this.edit[x])
					this.edit[x] = [];
				this.edit[x][z] = edit;
				
				let columns = this.perGetChunk(x, z, edit);
				
				if (this.activeChunk.every(function(value, index, arr){
					return value[0] != x || value[1] != z;
				})) //每个都不一样（不存在）
					this.activeChunk.push([x,z]);
				
				for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
					for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
						for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
							this.loadColumn(ox+dx, oz+dz, columns, edit);
			}
		);
	}
	//加载区块（异步）
	loadChunkAsync(x, z, opt={}){
		let {
			finishCallback,
			progressCallback,
			breakTime=66, // 最大执行时间/ms
			mostSpeed=2, // 最大速度/次
			dir="", //方向
			breakPoint,
			columns
		} = opt;
		
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z, //区块中心坐标
			t = this.seed; //临时变量
		
		if (this.initedChunk.every(function(value, index, arr){ //添加
			return value[0] != x || value[1] != z;
		})) //每个都不一样（不存在）
			this.initedChunk.push([x,z]);
		
		let func = (edit)=>{
			//保存edit
			if (!this.edit[x])
				this.edit[x] = [];
			this.edit[x][z] = edit;
			// console.log("save edit", x, z, edit)
			
			if (!columns)
				columns = this.perGetChunk(x, z, edit)
			
			switch (dir.substr(0,2)){
				case "x-":
					{
						let t0 = +new Date(),
							num = 0;
						
						let dx;
						if (breakPoint){
							dx = breakPoint.dx==undefined? this.size[1].x: breakPoint.dx;
							delete breakPoint.dx;
						}else{
							dx = this.size[1].x;
						}
						for (; dx>=this.size[0].x; dx--){
							
							let dz;
							if (breakPoint){
								dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
								delete breakPoint.dz;
							}else{
								dz = this.size[0].z;
							}
							for (; dz<=this.size[1].z; dz++){
								if (new Date-t0 > breakTime) //超时
									return setTimeout(()=>{
										this.loadChunkAsync(x, z, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx, dz, edit},
											columns
										});
									},0);
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							}
							
							setTimeout(()=>{ //更新
								this.updateColumn(ox+dx, oz+this.size[0].z-1);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.updateColumn(ox+dx+1, dz);
							}, 0);
							if (progressCallback)
								progressCallback( (dx-this.size[1].x)/(this.size[0].x-this.size[1].x) );
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>{
									this.loadChunkAsync(x, z, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dx:dx-1, edit}
									});
								},0);
						}
						setTimeout(()=>{ //更新
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
								this.updateColumn(ox+this.size[0].x, oz+dz);
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
							}
						},0);
						
						if (this.activeChunk.every(function(value, index, arr){ //添加
							return value[0] != x || value[1] != z;
						})) //每个都不一样（不存在）
							this.activeChunk.push([x,z]);
						
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
								
								if (this.activeChunk.every(function(value, index, arr){
									return value[0] != x || value[1] != z;
								})) //每个都不一样（不存在）
									this.activeChunk.push([x,z]);
								
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
						
						let dz;
						if (breakPoint){
							dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
							delete breakPoint.dz;
						}else{
							dz = this.size[0].z;
						}
						for (; dz<=this.size[1].z; dz++){
							
							let dx;
							if (breakPoint){
								dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
								delete breakPoint.dx;
							}else{
								dx = this.size[0].x;
							}
							for (; dx<=this.size[1].z; dx++){
								if (new Date-t0 > breakTime) //超时
									return setTimeout(()=>{
										this.loadChunkAsync(x, z, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx, dz, edit},
											columns
										});
									},0);
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							}
							
							setTimeout(()=>{ //更新
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz-1);
							}, 0);
							if (progressCallback)
								progressCallback( (dz-this.size[0].z)/(this.size[0].z-this.size[1].z) );
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>{
									this.loadChunkAsync(x, z, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dz:dz+1, edit}
									});
								},0);
						}
						setTimeout(()=>{ //更新
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
								this.updateColumn(ox+dx, oz+this.size[1].z);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
							}
						},0);
						
						if (this.activeChunk.every(function(value, index, arr){ //添加
							return value[0] != x || value[1] != z;
						})) //每个都不一样（不存在）
							this.activeChunk.push([x,z]);
						
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
								
								if (this.activeChunk.every(function(value, index, arr){
									return value[0] != x || value[1] != z;
								})) //每个都不一样（不存在）
									this.activeChunk.push([x,z]);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							
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
						
						let dz;
						if (breakPoint){
							dz = breakPoint.dz==undefined? this.size[1].z: breakPoint.dz;
							delete breakPoint.dz;
						}else{
							dz = this.size[1].z;
						}
						for (; dz>=this.size[0].z; dz--){
							
							let dx;
							if (breakPoint){
								dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
								delete breakPoint.dx;
							}else{
								dx = this.size[0].x;
							}
							for (; dx<=this.size[1].z; dx++){
								if (new Date-t0 > breakTime) //超时
									return setTimeout(()=>{
										return this.loadChunkAsync(x, z, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx, dz, edit},
											columns
										});
									},0);
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							}
							
							setTimeout(()=>{ //更新
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
								this.updateColumn(ox+this.size[1].x+1, oz+dz);
								for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
									this.updateColumn(dx, oz+dz-1);
							}, 0);
							if (progressCallback)
								progressCallback( (dz-this.size[1].dz)/(this.size[0].z-this.size[1].z) );
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>{
									this.loadChunkAsync(x, z, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dz:dz-1, edit}
									});
								},0);
						}
						setTimeout(()=>{ //更新
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
								this.updateColumn(ox+dx, oz+this.size[1].z);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
							}
						},0);
						
						if (this.activeChunk.every(function(value, index, arr){ //添加
							return value[0] != x || value[1] != z;
						})) //每个都不一样（不存在）
							this.activeChunk.push([x,z]);
						
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
								
								if (this.activeChunk.every(function(value, index, arr){
									return value[0] != x || value[1] != z;
								})) //每个都不一样（不存在）
									this.activeChunk.push([x,z]);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							
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
						
						let dx;
						if (breakPoint){
							dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
							delete breakPoint.dx;
						}else{
							dx = this.size[0].x;
						}
						for (; dx<=this.size[1].x; dx++){
							
							let dz;
							if (breakPoint){
								dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
								delete breakPoint.dz;
							}else{
								dz = this.size[0].z;
							}
							for (; dz<=this.size[1].z; dz++){
								if (new Date-t0 > breakTime) //超时
									return setTimeout(()=>{
										this.loadChunkAsync(x, z, {
											finishCallback,
											progressCallback,
											breakTime,
											mostSpeed,
											dir,
											breakPoint: {dx, dz, edit},
											columns
										});
									},0);
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							}
							
							setTimeout(()=>{ //更新
								this.updateColumn(ox+dx, oz+this.size[0].z-1);
								this.updateColumn(ox+dx, oz+this.size[1].z+1);
								for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
									this.updateColumn(ox+dx+1, dz);
							}, 0);
							if (progressCallback)
								progressCallback( (dx-this.size[0].x)/(this.size[1].x-this.size[0].x) );
							if (++num >= mostSpeed) //超数
								return setTimeout(()=>{
									this.loadChunkAsync(x, z, {
										finishCallback,
										progressCallback,
										breakTime,
										mostSpeed,
										dir,
										breakPoint: {dx:dx+1, edit}
									});
								},0);
						}
						setTimeout(()=>{ //更新
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
								this.updateColumn(ox+this.size[0].x, oz+dz);
								this.updateColumn(ox+this.size[0].x-1, oz+dz);
							}
						},0);
						
						if (this.activeChunk.every(function(value, index, arr){ //添加
							return value[0] != x || value[1] != z;
						})) //每个都不一样（不存在）
							this.activeChunk.push([x,z]);
						
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
								
								if (this.activeChunk.every(function(value, index, arr){
									return value[0] != x || value[1] != z;
								})) //每个都不一样（不存在）
									this.activeChunk.push([x,z]);
								
								if (finishCallback)
									finishCallback();
								return;
							}
							
							//正常代码
							for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
								this.loadColumn(ox+dx, oz+dz, columns, edit);
							
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
		if (breakPoint && breakPoint.edit){
			func(breakPoint.edit);
		}else{
			sql.selectData("file", ["x", "y", "z", "id", "attr"],
				`type=0 AND`+
				` (x BETWEEN ${ ox+this.size[0].x } AND ${ ox+this.size[1].x }) AND`+
				` (z BETWEEN ${ oz+this.size[0].z } AND ${ oz+this.size[1].z })`,
				(edit)=>{
					console.log("edit(sql):", edit);
					func(new Array(...edit));
				}
			);
		}
	}
	
	//卸载区块（同步）
	unloadChunk(x, z){
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let i in this.activeChunk)
			if (this.activeChunk[i][0] == x && this.activeChunk[i][1] == z)
				this.activeChunk.splice(i,1); //从i开始删除一个元素
		for (let i in this.initedChunk)
			if (this.initedChunk[i][0] == x && this.initedChunk[i][1] == z)
				this.initedChunk.splice(i,1); //从i开始删除一个元素
		
		for (let dx=this.size[0].x; dx<=this.size[1].x; dx++)
			for (let dy=this.size[0].y; dy<=this.size[1].y; dy++)
				for (let dz=this.size[0].z; dz<=this.size[1].z; dz++)
					if (this.get(ox+dx, dy, oz+dz)){
						console.log("delete")
						for (let i of this.map[ox+dx][dy][oz+dz].block.mesh.material)
							i.dispose();
						this.map[ox+dx][dy][oz+dz].block.mesh.geometry.dispose(); //清除内存
						scene.remove(this.map[ox+dx][dy][oz+dz].block.mesh);
						delete this.map[ox+dx][dy][oz+dz];
					}
	}
	//卸载区块（异步）
	unloadChunkAsync(x, z, opt={}){
		let {
			finishCallback,
			progressCallback,
			breakTime=66, // 最大执行时间/ms
			mostSpeed=2, // 最大次数/次
			breakPoint
		} = opt;
		
		[x, z] = [Math.round(x), Math.round(z)]; //规范化
		let ox = x*this.size.x,
			oz = z*this.size.z; //区块中心坐标
		
		for (let i in this.activeChunk)
			if (this.activeChunk[i][0] == x && this.activeChunk[i][1] == z)
				this.activeChunk.splice(i,1); //从i开始删除一个元素
		for (let i in this.initedChunk)
			if (this.initedChunk[i][0] == x && this.initedChunk[i][1] == z)
				this.initedChunk.splice(i,1); //从i开始删除一个元素
		
		//if (finishCallback){ //有回调（必须setInterval）
		
		let t0 = +new Date(),
			num = 0;
		
		let dx;
		if (breakPoint){
			dx = breakPoint.dx==undefined? this.size[0].x: breakPoint.dx;
			delete breakPoint.dx;
		}else{
			dx = this.size[0].x;
		}
		for (; dx<=this.size[1].x; dx++){
			
			let dy;
			if (breakPoint){
				dy = breakPoint.dy==undefined? this.size[0].y: breakPoint.dy;
				delete breakPoint.dy;
			}else{
				dy = this.size[0].y;
			}
			for (; dy<=this.size[1].y; dy++){
				
				let dz;
				if (breakPoint){
					dz = breakPoint.dz==undefined? this.size[0].z: breakPoint.dz;
					delete breakPoint.dz;
				}else{
					dz = this.size[0].z;
				}
				for (; dz<=this.size[1].z; dz++){
					if (new Date-t0 > breakTime) //超时
						return setTimeout(()=>{
							this.unloadChunkAsync(x, z, {
								finishCallback,
								progressCallback,
								breakTime,
								mostSpeed,
								breakPoint: {dx, dy, dz}
							});
						},0);
					
					if (this.get(ox+dx, dy, oz+dz)){ //非空气 & 非未加载
						for (let i of this.map[ox+dx][dy][oz+dz].block.mesh.material)
							i.dispose();
						this.map[ox+dx][dy][oz+dz].block.mesh.geometry.dispose(); //清除内存
						scene.remove(this.map[ox+dx][dy][oz+dz].block.mesh);
						delete this.map[ox+dx][dy][oz+dz];
					}
				}
			}
			
			if (progressCallback)
				progressCallback( (dx-this.size[0].x)/(this.size[1].x-this.size[0].x) )
			if (++num >= mostSpeed) //超数
				return setTimeout(()=>{
					this.unloadChunkAsync(x, z, {
						finishCallback,
						progressCallback,
						breakTime,
						mostSpeed,
						breakPoint: {dx:dx+1}
					});
				},0);
		}
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
	
	//预加载区块
	perloadChunk(opt={}){
		let {
			length=map.perloadLength, //加载范围（视野）
			progressCallback,
			finishCallback
		} = opt;
		let block = [];
		for (let x=-length; x<=length; x+=map.size.x){
			for (let z=-length; z<=length; z+=map.size.z){
				let push = [
					Math.round((deskgood.pos.x+x)/100/map.size.x),
					Math.round((deskgood.pos.z+z)/100/map.size.z),
					(
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
				];
			}
		}
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
		
		let loading=0, total=0; //当前正在加载 和 需加载总数
		
		for (let i in block){
			if (this.initedChunk.every(function(value, index, arr){
				return value[0] != block[i][0] || value[1] != block[i][1];
			})){ //每个都不一样（不存在 & 不在加载中）
				// this.initChunk(block[i][0], block[i][1]);
				loading++;
				this.loadChunkAsync(block[i][0], block[i][1], {
					dir: block[i][2],
					progressCallback: (v)=>{
						loading -= 1/(map.size.x);
						if (progressCallback)
							progressCallback((total-loading) / total); //反馈进度
					},
					finishCallback: ()=>{
						if (loading < 1e-6 && finishCallback){ //完成所有
							finishCallback();
						}else if (progressCallback){
							progressCallback((total-loading) / total); //反馈进度
						}
						this.updateChunkAsync(block[i][0], block[i][1], {
							breakTime: 36
						}); //更新区块
					}
				}); //用噪声填充区块
			}
		}
		
		for (let i of this.activeChunk)
			if (
				// (i[0] != 0 || i[1] != 0)&& //不是出生区块
				block.every((value, index, arr)=>{
					return i[0] != value[0] || i[1] != value[1];
				}) //不与任何block相等
			){
				loading++;
				this.unloadChunkAsync(...i, {
					breakTime: 36,
					progressCallback: (v)=>{
						loading -= 1/(map.size.x);
						if (progressCallback)
							progressCallback((total-loading) / total); //反馈进度
					},
					finishCallback: ()=>{
						if (loading < 1e-6 && finishCallback){ //完成所有
							finishCallback();
						}else if (progressCallback){
							progressCallback((total-loading) / total); //反馈进度
						}
					}
				}); //卸载区块
			}
		
		total = loading;
	}
	
}