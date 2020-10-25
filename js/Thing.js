class Thing{
	constructor (opt, template=true){
		//物品ID
		this.id = Number(opt.id);
		//this.id = Thing.prototype.idLength++; //同时自增
		
		//Object.defineProperties();
		this.template = !!template;
		
		//名称
		if (opt.name)
			this.name = String(opt.name);
		
		//方块
		if (opt.block){
			this.block = {};
			//face
			if (opt.block.face){ //贴图 位置
				this.block.face = [];
				for (let i=0; i<opt.block.face.length; i++)
					this.block.face[i] = opt.block.face[i];
			}
			if (opt.block.parent) this.block.parent = opt.block.parent;
			
			//texture
			if (opt.block.texture){ //贴图 数据
				this.block.texture = [];
				for (let i=0; i<opt.block.texture.length; i++)
					if (opt.block.texture[i])
						this.block.texture[i] = opt.block.texture[i];
			}
			
			this.block.addTo = false; //加入scene
			//material
			if (opt.block.material){ //材质
				this.block.material = opt.block.material;
			}
			//geometry
			if (opt.block.geometry){ //几何体
				this.block.geometry = opt.block.geometry;
			}
			//mesh
			if (opt.block.mesh){ //网格模型
				this.block.mesh = opt.block.mesh;
			}
		}
		
		//属性
		this.attr = {};
		if (opt.attr){
			if (opt.attr.hardness) this.attr.hardness = opt.attr.hardness; //硬度
			if (opt.attr.durability) this.attr.durability = opt.attr.durability; //耐久
			if (opt.attr.digSpeed) this.attr.digSpeed = opt.attr.digSpeed; //挖掘速度 m³/s
			if (opt.attr.durabilityLoss) this.attr.durabilityLoss = opt.attr.durabilityLoss; //耐久损耗 /m³
			if (opt.attr.hungerLoss) this.attr.hungerLoss = opt.attr.hungerLoss; //饥饿损耗 /m³
			if (opt.attr.lifeLoss) this.attr.lifeLoss = opt.attr.lifeLoss; //生命损耗 /m³
			
			this.attr.block = {};
			if (opt.attr.block){
				if (opt.attr.block.transparent) this.attr.block.transparent = opt.attr.block.transparent; //透明方块（其他方块必须显示）
				if (opt.attr.block.noTransparent) this.attr.block.noTransparent = opt.attr.block.noTransparent; //必须显示本方块
				if (opt.attr.block.through) this.attr.block.through = opt.attr.block.through; //允许穿过
				
				if (opt.attr.block.onLeftMouseDown) this.attr.block.onLeftMouseDown = opt.attr.block.onLeftMouseDown;
				if (opt.attr.block.onLeftMouseUp) this.attr.block.onLeftMouseUp = opt.attr.block.onLeftMouseUp;
				if (opt.attr.block.onRightMouseDown) this.attr.block.onRightMouseDown = opt.attr.block.onRightMouseDown;
				if (opt.attr.block.onRightMouseUp) this.attr.block.onRightMouseUp = opt.attr.block.onRightMouseUp;
				
				if (opt.attr.block.onShortTouch) this.attr.block.onShortTouch = opt.attr.block.onShortTouch;
				if (opt.attr.block.onLongTouch) this.attr.block.onLongTouch = opt.attr.block.onLongTouch;
				if (opt.attr.block.onTouchStart) this.attr.block.onTouchStart = opt.attr.block.onTouchStart;
				if (opt.attr.block.onTouchMove) this.attr.block.onTouchMove = opt.attr.block.onTouchMove;
				if (opt.attr.block.onTouchEnd) this.attr.block.onTouchEnd = opt.attr.block.onTouchEnd;
				if (opt.attr.block.onTouchCancal) this.attr.block.onTouchCancal = opt.attr.block.onTouchCancal;
				
				if (opt.attr.block.onChangeTo) this.attr.block.onChangeTo = opt.attr.block.onChangeTo;
				if (opt.attr.block.onChangeLeave) this.attr.block.onChangeLeave = opt.attr.block.onChangeLeave;
				if (opt.attr.block.onPutToHead) this.attr.block.onPutToHead = opt.attr.block.onPutToHead;
				if (opt.attr.block.onPutToBody) this.attr.block.onPutToBody = opt.attr.block.onPutToBody;
				if (opt.attr.block.onPutToLeg) this.attr.block.onPutToLeg = opt.attr.block.onPutToHead;
				if (opt.attr.block.onPutToFoot) this.attr.block.onPutToFoot = opt.attr.block.onPutToFoot;
			}
		}
	}
	get(...attr){
		let this_part = this,
			template_part = TEMPLATES[this.id];
		//let type = !!this.template;
		for (let i of attr){
			// try{
			if (this_part && this_part[i]){ //不为undefined 且 可获取下一个属性
				this_part = this_part[i];
			}else{
				this_part = undefined;
			}
			// }catch(err){}
			template_part = template_part[i];
			//if (this_part === undefined) type=true;
		}
		return this_part===undefined? template_part: this_part;
	};
	set(...attr){
		let this_part = this;
		let value = attr.pop();
		for (let i of attr.slice(0,-1)){
			if (this_part[i] === undefined)
				this_part[i] = {};
			this_part = this_part[i];
		}
		this_part[attr.pop()] = value;
		return this;
	};
	have(...attr){
		let part = this;
		for (let i of attr){
			part = part[i];
			if (part === undefined) return false;
		}
		return true;
	};
	//face
	setFace(value, index){
		if (index != undefined){ //有索引（单个）
			this.set("block", "face", index, value);
		}else{ //无索引（所有）
			for (let i=0; i<value.length; i++)
				this.set("block", "face", i, value[i]);
		}
		return this;
	};
	deleteFace(index){
		if (index != undefined){ //有索引
			this.set("block", "face", index, null); //半保留
		}else{ //无索引
			this.set("block", "face", []); //半保留
		}
		return this;
	};
	editParent(value){
		this.set("block", "parent", value);
		return this;
	};
	//texture
	setTexture(texture, index){
		/*if (!this.block.texture){ //不存在texture
			this.block.texture = [];
		}*/
		if (index != undefined){ //有索引
			this.set("block", "texture", index, texture);
		}else{ //无索引
			for (let i=0; i<texture.length; i++)
				this.set("block", "texture", i, texture[i]);
		}
		return this;
	};
	deleteTexture(index){
		if (index != undefined){ //有索引
			if (this.have("block", "texture", index))
				this.block.texture[index].dispose(); //清除内存
			this.set("block", "texture", index, null); //半保留
		}else{ //无索引
			if (this.have("block", "texture"))
				for (let i of this.get("block", "texture"))
					i.dispose(); //清除内存
			this.set("block", "texture", []); //半保留
		}
		return this;
	};
	//material
	makeMaterial(){
		let textures = this.get("block", "texture"),
			transparent = this.get("attr", "block", "transparent") || false;
		this.set("block", "material", [
			new THREE.MeshLambertMaterial({ map:textures[0], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[1], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[2], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[3], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[4], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[5], transparent })
		]); //材质对象 MeshLambertMaterial
		return this;
	};
	deleteMaterial(){
		if (this.have("block", "material"))
			for (let i of this.get("block", "material"))
				i.dispose(); //清除内存
		this.set("block", "material", null); //半保留
		return this;
	};
	//geometry
	makeGeometry(x, y, z){
		this.set("block", "geometry", new THREE.BoxGeometry(x, y, z));
		return this;
	};
	deleteGeometry(){
		if (this.have("block", "geometry"))
			this.block.geometry.dispose();
		this.set("block", "geometry", null); //半保留
		return this;
	};
	//mesh
	makeMesh(geometry=this.get("block", "geometry")){
		if (geometry){
			this.set("block", "mesh", new THREE.Mesh(geometry, this.block.material)); //网格模型对象Mesh
		}else{ //使用默认
			this.set("block", "mesh", new THREE.Mesh(Thing.geometry, this.block.material)); //网格模型对象Mesh
		}
		this.get("block", "mesh").castShadow = true;
		this.get("block", "mesh").receiveShadow = true;
		this.get("block", "mesh").userData.through = this.get("attr", "block", "through");
		return this;
	};
	deleteMesh(index){
		if (this.have("block", "mesh", "material"))
			for (let i of this.get("block", "mesh", "material"))
				i.dispose();
		if (this.have("block", "mesh", "geometry"))
			this.get("block", "mesh", "geometry").dispose(); //清除内存
		this.set("block", "mesh", null); //半保留
		return this;
	};
}
Thing.geometry = new THREE.BoxGeometry(100, 100, 100);


class Block extends Thing{
	constructor(opt, template=true){
		super(opt, template);
		
		this.block = {};
		if (opt.block){
			//face
			if (opt.block.face){ //贴图 位置
				this.block.face = [];
				for (let i=0; i<opt.block.face.length; i++)
					this.block.face[i] = opt.block.face[i];
			}
			if (opt.block.parent) this.block.parent = opt.block.parent;
					
			//texture
			if (opt.block.texture){ //贴图 数据
				this.block.texture = [];
				for (let i=0; i<opt.block.texture.length; i++)
					if (opt.block.texture[i])
						this.block.texture[i] = opt.block.texture[i];
			}
			
			this.block.addTo = false; //加入scene
			//material
			if (opt.block.material){ //材质
				this.block.material = opt.block.material;
			}
			//geometry
			if (opt.block.geometry){ //几何体
				this.block.geometry = opt.block.geometry;
			}
			//mesh
			if (opt.block.mesh){ //网格模型
				this.block.mesh = opt.block.mesh;
			}
		}
		
		this.attr.block = {};
		if (opt.attr.block){
			if (opt.attr.block.transparent) this.attr.block.transparent = opt.attr.block.transparent; //透明方块（其他方块必须显示）
			if (opt.attr.block.noTransparent) this.attr.block.noTransparent = opt.attr.block.noTransparent; //必须显示本方块
			if (opt.attr.block.through) this.attr.block.through = opt.attr.block.through; //运行穿过
			
			if (opt.attr.block.onLeftMouseDown) this.attr.block.onLeftMouseDown = opt.attr.block.onLeftMouseDown;
			if (opt.attr.block.onLeftMouseUp) this.attr.block.onLeftMouseUp = opt.attr.block.onLeftMouseUp;
			if (opt.attr.block.onRightMouseDown) this.attr.block.onRightMouseDown = opt.attr.block.onRightMouseDown;
			if (opt.attr.block.onRightMouseUp) this.attr.block.onRightMouseUp = opt.attr.block.onRightMouseUp;
			
			if (opt.attr.block.onShortTouch) this.attr.block.onShortTouch = opt.attr.block.onShortTouch;
			if (opt.attr.block.onLongTouch) this.attr.block.onLongTouch = opt.attr.block.onLongTouch;
			if (opt.attr.block.onTouchStart) this.attr.block.onTouchStart = opt.attr.block.onTouchStart;
			if (opt.attr.block.onTouchMove) this.attr.block.onTouchMove = opt.attr.block.onTouchMove;
			if (opt.attr.block.onTouchEnd) this.attr.block.onTouchEnd = opt.attr.block.onTouchEnd;
			if (opt.attr.block.onTouchCancal) this.attr.block.onTouchCancal = opt.attr.block.onTouchCancal;
			
			if (opt.attr.block.onChangeTo) this.attr.block.onChangeTo = opt.attr.block.onChangeTo;
			if (opt.attr.block.onChangeLeave) this.attr.block.onChangeLeave = opt.attr.block.onChangeLeave;
			if (opt.attr.block.onPutToHead) this.attr.block.onPutToHead = opt.attr.block.onPutToHead;
			if (opt.attr.block.onPutToBody) this.attr.block.onPutToBody = opt.attr.block.onPutToBody;
			if (opt.attr.block.onPutToLeg) this.attr.block.onPutToLeg = opt.attr.block.onPutToHead;
			if (opt.attr.block.onPutToFoot) this.attr.block.onPutToFoot = opt.attr.block.onPutToFoot;
		}
	}
}


class ThingGroup extends Array{
	constructor(element, opt, ...array) {
		super(...array);
		this.e = element;
		if (opt.fixedLength){
			this.fixedLength = +opt.fixedLength;
			for (let i=this.fixedLength; i>=0; i--)
				if (!this[i]) this[i] = null;
		}
		if (opt.maxLength) this.maxLength = +opt.maxLength;
		if (opt.updateCallback) this.updateCallback = opt.updateCallback;
		
		setTimeout( ()=>this.update(), 0 )
	}
	
	add(...items){
		for (let i of items)
			if (this.length+1 <= this.maxLength){
				this.push(...items);
			}else{
				console.warn("ThingGroup added more than maxLength:", this.maxLength);
				break;
			}
		return this.update();
	}
	
	delete(num=1){
		for (let i=num; i>=0; i--)
			if (this.fixedLength)
				this[this.length-1] = null;
			else
				this.pop();
		
		return this.update();
	}
	
	update(){
		let children = [];
		for (let i=0; i<(this.fixedLength||this.length); i++)
			children.push(
				$("<img/>").attr("src", (
					this[i]?
						(this[i].get("block", "parent")||`./img/blocks/${this[i].id}/`) + this[i].get("block", "face")[0]
					:
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4//8/AwAI/AL+eMSysAAAAABJRU5ErkJggg==" //透明图片
				))[0]
			);
		$(this.e).empty().append(...children);
		if (typeof this.updateCallback == "function") this.updateCallback(children);
		return this;
	}
}