/*
* Thing基础类
*/
class Thing{
	constructor (opt/* , template=true */){
		//物品ID
		this.id = Number(opt.id);
		//this.id = Thing.prototype.idLength++; //同时自增
		
		//Object.defineProperties();
		// this.template = !!template;
		
		//名称
		if (opt.name)
			this.name = String(opt.name);
		
		//属性
		this.attr = {};
		if (opt.attr){
			if (opt.attr.onChangeTo) this.attr.onChangeTo = opt.attr.onChangeTo; //choice切换到
			if (opt.attr.onChangeLeave) this.attr.onChangeLeave = opt.attr.onChangeLeave; //choice切换离开
			if (opt.attr.onPutToHead) this.attr.onPutToHead = opt.attr.onPutToHead; //放到头上
			if (opt.attr.onPutToBody) this.attr.onPutToBody = opt.attr.onPutToBody; //放到身上
			if (opt.attr.onPutToLeg) this.attr.onPutToLeg = opt.attr.onPutToLeg; //放到腿上
			if (opt.attr.onPutToFoot) this.attr.onPutToFoot = opt.attr.onPutToFoot; //放到脚上
			if (opt.attr.onHold) this.attr.onHold = opt.attr.onHold; //放到手上
			
			/*if (opt.attr.hardness) this.attr.hardness = opt.attr.hardness; //硬度
			if (opt.attr.durability) this.attr.durability = opt.attr.durability; //耐久
			if (opt.attr.digSpeed) this.attr.digSpeed = opt.attr.digSpeed; //挖掘速度 m³/s
			if (opt.attr.durabilityLoss) this.attr.durabilityLoss = opt.attr.durabilityLoss; //耐久损耗 /m³
			if (opt.attr.hungerLoss) this.attr.hungerLoss = opt.attr.hungerLoss; //饥饿损耗 /m³
			if (opt.attr.lifeLoss) this.attr.lifeLoss = opt.attr.lifeLoss; //生命损耗 /m³*/
		}
	}
	
	//获取属性
	get(...attr){
		let this_part = this,
			template_part = TEMPLATES[this.id];
		//let type = !!this.template;
		for (let i of attr){
			if (this_part && this_part[i]){ //不为undefined 且 可获取下一个属性
				this_part = this_part[i];
			}else{
				this_part = undefined;
			}
			template_part = template_part[i];
			//if (this_part === undefined) type=true;
		}
		return this_part===undefined? template_part: this_part;
	};
	//设置属性
	set(...attr){
		let this_part = this,
			value = attr.pop(); // 最后一位为要赋的值
		for (let i of attr.slice(0,-1)){ // 保留对象
			if (this_part[i] === undefined) // 未定义属性
				this_part[i] = {}; // 创建对象
			this_part = this_part[i];
		}
		this_part[attr.pop()] = value;
		return this;
	};
	//判断是否拥有属性
	have(...attr){
		let part = this;
		for (let i of attr){
			part = part[i];
			if (part === undefined) return false;
		}
		return true;
	};
}


/*
* Block方块类 继承Thing类
*/
class Block extends Thing{
	constructor(opt/* , template=true */){
		super(opt/* , template */);
		
		this.block = {};
		if (opt.block){
			//face
			if (opt.block.face){ //贴图 位置
				this.block.face = [];
				for (let i=0; i<opt.block.face.length; i++){
					this.block.face[i] = []; //面
					for (let j=0; j<2; j++) //横纵uv
						this.block.face[i][j] = opt.block.face[i][j];
				}
			}
			//texture
			if (opt.block.texture){ //贴图 数据
				this.block.texture = [];
				for (let i=0; i<opt.block.texture.length; i++)
					if (opt.block.texture[i])
						this.block.texture[i] = opt.block.texture[i];
			}
			//material
			if (opt.block.material) this.block.material = opt.block.material; //材质
			//geometry
			if (opt.block.geometry) this.block.geometry = opt.block.geometry; //几何体
			//mesh
			if (opt.block.mesh) this.block.mesh = opt.block.mesh; //网格模型
			this.block.addTo = false; //未加入scene
		}
		
		//属性
		this.attr.block = {};
		if (opt.attr && opt.attr.block){
			if (opt.attr.block.transparent) this.attr.block.transparent = opt.attr.block.transparent; //透明方块（其他方块必须显示）
			if (opt.attr.block.noTransparent) this.attr.block.noTransparent = opt.attr.block.noTransparent; //必须显示本方块
			if (opt.attr.block.through) this.attr.block.through = opt.attr.block.through; //允许穿过
			
			if (opt.attr.block.onLeftMouseDown) this.attr.block.onLeftMouseDown = opt.attr.block.onLeftMouseDown; //鼠标左键按下
			if (opt.attr.block.onLeftMouseUp) this.attr.block.onLeftMouseUp = opt.attr.block.onLeftMouseUp; //鼠标左键抬起
			if (opt.attr.block.onRightMouseDown) this.attr.block.onRightMouseDown = opt.attr.block.onRightMouseDown; //鼠标右键按下
			if (opt.attr.block.onRightMouseUp) this.attr.block.onRightMouseUp = opt.attr.block.onRightMouseUp; //鼠标右键抬起
			
			if (opt.attr.block.onShortTouch) this.attr.block.onShortTouch = opt.attr.block.onShortTouch; //短按
			if (opt.attr.block.onLongTouch) this.attr.block.onLongTouch = opt.attr.block.onLongTouch; //长按
			if (opt.attr.block.onTouchStart) this.attr.block.onTouchStart = opt.attr.block.onTouchStart;
			if (opt.attr.block.onTouchMove) this.attr.block.onTouchMove = opt.attr.block.onTouchMove;
			if (opt.attr.block.onTouchEnd) this.attr.block.onTouchEnd = opt.attr.block.onTouchEnd;
			if (opt.attr.block.onTouchCancal) this.attr.block.onTouchCancal = opt.attr.block.onTouchCancal;
			
			if (opt.attr.block.onPlace) this.attr.block.onPlace = opt.attr.block.onPlace; //被放置
			if (opt.attr.block.onRemove) this.attr.block.onRemove = opt.attr.block.onRemove; //被删除
		}
	}
	
	// face
	setFace(value, index){
		if (index === undefined){ //无索引（所有）
			for (let i=0; i<value.length; i++)
				this.set("block", "face", i, value[i]);
		}else{ //有索引（单个）
			this.set("block", "face", index, value);
		}
		return this;
	};
	deleteFace(index){
		if (index === undefined){ //无索引（所有）
			this.set("block", "face", []); //半保留
		}else{ //有索引（单个）
			this.set("block", "face", index, null); //半保留
		}
		return this;
	};
	editParent(value){
		this.set("block", "parent", value);
		return this;
	};
	
	// texture
	setTexture(texture, index){
		/*if (!this.block.texture){ //不存在texture
			this.block.texture = [];
		}*/
		if (index === undefined){ //无索引（单个）
			for (let i=0; i<texture.length; i++)
				this.set("block", "texture", i, texture[i]);
		}else{ //有索引（所有）
			this.set("block", "texture", index, texture);
		}
		return this;
	};
	deleteTexture(index){
		if (index === undefined){ //无索引（所有）
			if ( this.have("block", "texture") )
				for (let i of Object.values(this.get("block", "texture")))
					i.dispose(); //清除内存
			this.set("block", "texture", []); //半保留
		}else{ //有索引（单个）
			if ( this.have("block", "texture", index) )
				this.block.texture[index].dispose(); //清除内存
			this.set("block", "texture", index, null); //半保留
		}
		return this;
	};
	
	// material
	makeMaterial(/* material */){
		/* if (material)
			return this.set("block", "material", material.map( v => v.clone() )); */
		
		const textures = this.get("block", "texture"),
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
		if ( this.have("block", "material") )
			for (const i of this.get("block", "material"))
				i.dispose(); //清除内存
		this.set("block", "material", null); //半保留
		return this;
	};
	
	// geometry
	makeGeometry(x, y, z){
		this.set("block", "geometry", new THREE.BoxBufferGeometry(x, y, z));
		return this;
	};
	deleteGeometry(){
		if ( this.have("block", "geometry") )
			this.block.geometry.dispose();
		this.set("block", "geometry", null); //半保留
		return this;
	};
	
	// mesh
	makeMesh( geometry=this.get("block", "geometry") ){
		if ( !this.have("block", "material") ){ //没有材质
			const template = this.get("block", "material");
			this.block.material = [];
			for (let i=0; i<template.length; i++)
				this.block.material[i] = template[i].clone();
		}
		if (geometry){
			this.set("block", "mesh", new THREE.Mesh(geometry, this.block.material)); //网格模型对象Mesh
		}else{ //使用默认
			this.set("block", "mesh", new THREE.Mesh(Block.geometry, this.block.material)); //网格模型对象Mesh
		}
		this.get("block", "mesh").castShadow = true;
		this.get("block", "mesh").receiveShadow = true;
		this.get("block", "mesh").userData.through = this.get("attr", "block", "through");
		return this;
	};
	deleteMesh(index){
		if (this.have("block", "mesh", "material"))
			for (const i of this.get("block", "mesh", "material"))
				i.dispose();
		if (this.have("block", "mesh", "geometry"))
			this.get("block", "mesh", "geometry").dispose(); //清除内存
		this.set("block", "mesh", null); //半保留
		return this;
	};
}
Block.geometry = new THREE.BoxBufferGeometry(100, 100, 100); //通用几何体


/*
* Tool工具类 继承Thing类
*/
class Tool extends Thing{
	constructor(opt){
		super(opt);
		
		this.tool = {};
		if (opt.tool){
			if (opt.tool.face) this.tool.face = opt.tool.face; //显示贴图
		}
		
		//工具属性
		this.attr.tool = {};
		if (opt.attr && opt.attr.tool){
			if (opt.attr.tool.diggingSpeed){ //每一种方块的挖掘速度
				this.attr.tool.diggingSpeed = {};
				for (cosnt [id,speed] of Object.entries(opt.attr.tool.diggingSpeed))
					this.attr.tool.diggingSpeed[id] = speed;
			}
			if (opt.attr.tool.durability) this.attr.tool.durability = opt.attr.tool.durability; //耐久度/m³
		}
	}
}

/*
* ThingGroup物品栏类 继承数组
*/
class ThingGroup extends Array{
	constructor(element, opt, ...array) {
		super(...array);
		
		this.e = element;
		if (opt.fixedLength){ //固定长度
			this.fixedLength = +opt.fixedLength;
			if (!opt.maxLength) //无最大长度
				for (let i=0; i<this.fixedLength; i++)
					if (!this[i]) this[i] = null;
		}
		if (opt.maxLength) this.maxLength = +opt.maxLength; //最大长度
		if (opt.updateCallback) this.updateCallback = opt.updateCallback; //更新完回调
		
		setTimeout( ()=>this.update(), 0 ); //自动更新
	}
	
	//添加
	add(...items){
		let [where] = items.splice(-1);
		for (let i in items)
			this.addOne(item[i], where[i], false);
		return this.update();
	}
	//添加一个
	addOne(item, where, needUpdate=true){
		if (this.fixedLength && !this.maxLength){ //有固定长度，无最大长度
			if (this[where]){ //已满
				for (let i=0; i<this.length; i++)
					if (!this[i]){
						this[i] = item;
						return needUpdate? this.update(): this;
					}
			}else{ //未满
				this[where] = item;
				return needUpdate? this.update(): this;
			}
			console.warn(`ThingGroup is full to add:`, item, where);
			return needUpdate? this.update(): this;
		}else{
			if (this.length+1 > this.maxLength){
				console.warn(`ThingGroup is full(maxLength:${this.maxLength}) to add:`, item, where);
				return needUpdate? this.update(): this;
			}
			if (where === undefined){ //无where
				this.push(item);
			}else{ //有where
				this.splice(where, 0, item);
			}
			return needUpdate? this.update(): this;
		}
	}
	
	//删除
	delete(num=1, where){
		if (this.fixedLength && !this.maxLength){ //有固定长度，无最大长度
			for (let i=where; i<this.length; i++){
				if (--num < 0)
					return this.update();
				this[i] = null;
			}
		}else{
			if (where === undefined){ //无位置
				for (let i=0; i<num; i++)
					this.pop();
			}else{
				this.splice(where, num);
			}
		}
		return this.update();
	}
	
	//更新
	async update(){
		let children = [],
			max = 0;
		if (this.fixedLength && !this.maxLength){
			max = this.fixedLength;
		}else{
			max = this.length;
		}
		for (let i=0; i<max; i++){
			let src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4//8/AwAI/AL+eMSysAAAAABJRU5ErkJggg=="; //透明图片
			if (this[i]){
				let face = this[i].get("block","face")[0];
				try{
				src = Img.scale( face[2]? //自定义
						Img.clip( await Img.get(face[2]), face[0]*16, face[1]*16, 16, 16 )
					:
						TEXTURES[ face[0] ][ face[1] ]
					, 32, 32
				).toDataURL("image/png");
				}catch(err){debugger}
			}
			children.push(
				$("<li></li>")
					.append(
						$("<img/>").attr("src", src)
					)[0]
			);
		}
		if (this.fixedLength && this.maxLength)
			for (let i=0; i<this.fixedLength; i++) //添加空白
				children.push(
					$("<li></li>")
					.append(
						$("<img/>")
							.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4//8/AwAI/AL+eMSysAAAAABJRU5ErkJggg==") //透明图片
					)[0]
				);
		if (typeof this.updateCallback == "function") this.updateCallback(children);
		$(this.e).empty().append(...children);
		return this;
	}
}