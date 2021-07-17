/*
* Thing基础类
*/
class Thing{
	constructor (opt/* , template=true */){
		/* //物品ID
		this.id = ""+opt.id; */
		//this.id = Thing.prototype.idLength++; //同时自增
		
		//Object.defineProperties();
		// this.template = !!template;
		
		//名称
		if (opt.name)
			this.name = ""+opt.name;
		
		//视图
		if (opt.view){
			this.view = [];
			for (let i=0; i<opt.view.length; i++) //横纵u v [src]
				this.view[i] = opt.view[i];
		}
		
		//属性
		this.attr = {};
		if (opt.attr){
			if (opt.attr.stackable) this.attr.stackable = opt.attr.stackable; //可叠加（布尔/数量）
			
			if (opt.attr.onChangeTo) this.attr.onChangeTo = opt.attr.onChangeTo; //choice切换到
			if (opt.attr.onChangeLeave) this.attr.onChangeLeave = opt.attr.onChangeLeave; //choice切换离开
			if (opt.attr.onPutToHead) this.attr.onPutToHead = opt.attr.onPutToHead; //放到头上
			if (opt.attr.onPutToBody) this.attr.onPutToBody = opt.attr.onPutToBody; //放到身上
			if (opt.attr.onPutToLeg) this.attr.onPutToLeg = opt.attr.onPutToLeg; //放到腿上
			if (opt.attr.onPutToFoot) this.attr.onPutToFoot = opt.attr.onPutToFoot; //放到脚上
			if (opt.attr.onHold) this.attr.onHold = opt.attr.onHold; //放到手上
			
			/*if (opt.attr.hardness) this.attr.hardness = opt.attr.hardness; //硬度
			if (opt.attr.durability) this.attr.durability = opt.attr.durability; //耐久
			if (opt.attr.idealDigSpeed) this.attr.idealDigSpeed = opt.attr.idealDigSpeed; //理想挖掘速度 m³/s
			if (opt.attr.durabilityLoss) this.attr.durabilityLoss = opt.attr.durabilityLoss; //耐久损耗 /m³
			if (opt.attr.hungerLoss) this.attr.hungerLoss = opt.attr.hungerLoss; //饥饿损耗 /m³
			if (opt.attr.lifeLoss) this.attr.lifeLoss = opt.attr.lifeLoss; //生命损耗 /m³*/
		}
	}
	
	
	//获取属性
	get(...attr){
		let this_part = this,
			template_part = this.constructor.TEMPLATES[ this.name ];
		//let type = !!this.template;
		for (const i of attr){
			if (this_part && this_part[i]){ //this_part不为undefined 且 可获取下一个属性
				this_part = this_part[i];
			}else{
				this_part = undefined;
			}
			if (template_part && template_part[i]){ //template_part不为undefined 且 可获取下一个属性
				template_part = template_part[i];
			}else{
				template_part = undefined;
			}
			//if (this_part === undefined) type=true;
		}
		return this_part===undefined? template_part: this_part;
	}
	
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
	}
	
	//判断是否拥有属性
	have(...attr){
		let part = this;
		for (let i of attr){
			part = part[i];
			if (part === undefined) return false;
		}
		return true;
	}
	
	//克隆
	clone(){
		return new this.constructor(this);
	}
	
	//只保留属性 或 重设属性 克隆
	cloneAttr(attr){
		return new this.constructor({
			name: this.name,
			attr: attr || this.attr
		});
	}
}
Thing.prototype.type = "Thing"; //名称
Thing.TEMPLATES = []; //模板


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
					for (let j=0; j<opt.block.face[i].length; j++) //横纵u v [src]
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
			this.block.added = false; //未加入scene
		}
		
		//属性
		if (opt.attr){
			
			if (opt.attr.hardness) this.attr.hardness = opt.attr.hardness; //硬度
			if (opt.attr.idealDigSpeed){ //理想挖掘速度(cm³/s)
				if (typeof opt.attr.idealDigSpeed == "number"){
					this.attr.idealDigSpeed = opt.attr.idealDigSpeed;
				}else{
					this.attr.idealDigSpeed = {};
					for (const [name, value] of Object.entries(opt.attr.idealDigSpeed))
						this.attr.idealDigSpeed[name] = +value;
				}
			}
			if (opt.attr.placeSpeed){ //放置速度(cm³/s)
				if (typeof opt.attr.placeSpeed == "number"){
					this.attr.placeSpeed = opt.attr.placeSpeed;
				}else{
					this.attr.placeSpeed = {};
					for (const [name, value] of Object.entries(opt.attr.placeSpeed))
						this.attr.placeSpeed[name] = +value;
				}
			}
			
			if (opt.attr.transparent) this.attr.transparent = opt.attr.transparent; //透明方块（其他方块必须显示，自己不可隐藏）
			if (opt.attr.through) this.attr.through = opt.attr.through; //允许穿过
			if (opt.attr.digGet) this.attr.digGet = opt.attr.digGet; //挖掘获得
			
			if (opt.attr.onStartDig) this.attr.onStartDig = opt.attr.onStartDig; //开始挖掘
			if (opt.attr.onEndDig) this.attr.onEndDig = opt.attr.onEndDig; //结束挖掘
			if (opt.attr.onStartPlace) this.attr.onStartPlace = opt.attr.onStartPlace; //开始放置
			if (opt.attr.onEndPlace) this.attr.onEndPlace = opt.attr.onEndPlace; //结束放置
			
			if (opt.attr.onPlace) this.attr.onPlace = opt.attr.onPlace; //被放置
			if (opt.attr.onRemove) this.attr.onRemove = opt.attr.onRemove; //被删除
			
			if (opt.attr.onLeftMouseDown) this.attr.onLeftMouseDown = opt.attr.onLeftMouseDown; //鼠标左键按下
			if (opt.attr.onLeftMouseUp) this.attr.onLeftMouseUp = opt.attr.onLeftMouseUp; //鼠标左键抬起
			if (opt.attr.onMiddleMouseDown) this.attr.onMiddleMouseDown = opt.attr.onMiddleMouseDown; //鼠标中键按下
			if (opt.attr.onMiddleMouseUp) this.attr.onMiddleMouseUp = opt.attr.onMiddleMouseUp; //鼠标中键抬起
			if (opt.attr.onRightMouseDown) this.attr.onRightMouseDown = opt.attr.onRightMouseDown; //鼠标右键按下
			if (opt.attr.onRightMouseUp) this.attr.onRightMouseUp = opt.attr.onRightMouseUp; //鼠标右键抬起
			
			if (opt.attr.onMouseWheelScrollUp) this.attr.onMouseWheelScrollUp = opt.attr.onMouseWheelScrollUp; //鼠标滚轮往上
			if (opt.attr.onMouseWheelScrollDown) this.attr.onMouseWheelScrollDown = opt.attr.onMouseWheelScrollDown; //鼠标滚轮往下
			
			if (opt.attr.onShortTouch) this.attr.onShortTouch = opt.attr.onShortTouch; //短按
			if (opt.attr.onLongTouch) this.attr.onLongTouch = opt.attr.onLongTouch; //长按
			if (opt.attr.onTouchStart) this.attr.onTouchStart = opt.attr.onTouchStart; //触摸开始
			if (opt.attr.onTouchMove) this.attr.onTouchMove = opt.attr.onTouchMove; //触摸移动
			if (opt.attr.onTouchEnd) this.attr.onTouchEnd = opt.attr.onTouchEnd; //触摸结束
			if (opt.attr.onTouchCancal) this.attr.onTouchCancal = opt.attr.onTouchCancal; //触摸取消
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
	}
	deleteFace(index){
		if (index === undefined){ //无索引（所有）
			this.set("block", "face", []); //半保留
		}else{ //有索引（单个）
			this.set("block", "face", index, null); //半保留
		}
		return this;
	}
	editParent(value){
		this.set("block", "parent", value);
		return this;
	}
	
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
	}
	deleteTexture(index){
		if (index === undefined){ //无索引（所有）
			if ( this.have("block", "texture") )
				for (const i of Object.values(this.block.texture))
					i.dispose(); //清除内存
			this.set("block", "texture", []); //半保留
		}else{ //有索引（单个）
			if ( this.have("block", "texture", index) )
				this.block.texture[index].dispose(); //清除内存
			this.set("block", "texture", index, null); //半保留
		}
		return this;
	}
	
	// material
	setMaterial(material){
		this.set("block", "material", material);
		return this;
	}
	makeMaterial(textures=this.get("block", "texture")/* material */){
		/* if (material)
			return this.set("block", "material", material.map( v => v.clone() )); */
		
		const transparent = this.get("attr", "transparent") || false;
		this.set("block", "material", [
			new THREE.MeshLambertMaterial({ map:textures[0], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[1], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[2], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[3], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[4], transparent }),
			new THREE.MeshLambertMaterial({ map:textures[5], transparent })
		]); //材质对象 MeshLambertMaterial
		return this;
	}
	deleteMaterial(){
		if ( this.have("block", "material") ) //清除内存
			if (this.block.material instanceof Array){ //数组
				this.block.material.forEach(v => v.dispose())
			}else{ //单个
				this.block.material.dispose();
			}
		
		this.set("block", "material", null); //半保留
		return this;
	}
	
	// geometry
	setGeometry(geometry){
		this.set("block", "geometry", geometry);
		return this;
	}
	makeGeometry(x, y, z){
		this.set("block", "geometry", new THREE.BoxBufferGeometry(x, y, z));
		return this;
	}
	deleteGeometry(){
		if ( this.have("block", "geometry") )
			this.block.geometry.dispose(); //清除内存
		
		this.set("block", "geometry", null); //半保留
		return this;
	}
	
	// mesh
	makeMesh( geometry=this.get("block", "geometry") ){
		if ( !this.have("block", "material") ){ //没有材质
			const template = this.get("block", "material");
			this.set("block", "material", []);
			for (let i=0; i<template.length; i++)
				this.block.material[i] = template[i].clone();
		}
		let mesh;
		if (geometry){
			mesh = new THREE.Mesh(geometry, this.block.material);
		}else{ //使用默认
			mesh = new THREE.Mesh(this.constructor.normalGeometry, this.block.material);
		}
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData.thingObject = this; //物体对象
		this.set("block", "mesh", mesh); //网格模型对象Mesh
		return this;
	}
	deleteMesh(index){
		if ( this.have("block", "mesh") ){
			if (this.block.mesh.material instanceof Array){ //数组
				this.block.mesh.material.forEach(v => v.dispose())
			}else{ //单个
				this.block.mesh.material.dispose();
			}
			this.block.mesh.geometry.dispose(); //清除内存
		}
		
		this.set("block", "mesh", null); //半保留
		return this;
	}
	
	//转换为实体方块
	toEntityBlock(){
		return new EntityBlock(this);
	}
}
Block.prototype.type = "Block"; //名称
Block.normalGeometry = new THREE.BoxBufferGeometry(100, 100, 100); //通用几何体
Block.normalSize = {
	x1: 100,
	x0: 0,
	y1: 100,
	y0: 0,
	z1: 100,
	z0: 0
}; //大小默认值
Block.directions = Object.keys(Block.normalSize); //各个方向（有顺序）


/*
* EntityBlock实体方块类 继承Block类
*/
class EntityBlock extends Block{
	constructor(opt){
		super(opt);
		
		if (opt.attr){
			if (opt.attr.size){ //挖掘大小程度
				this.attr.size = {};
				if (opt.attr.size.x0) this.attr.size.x0 = opt.attr.size.x0;
				if (opt.attr.size.x1) this.attr.size.x1 = opt.attr.size.x1;
				if (opt.attr.size.y0) this.attr.size.y0 = opt.attr.size.y0;
				if (opt.attr.size.y1) this.attr.size.y1 = opt.attr.size.y1;
				if (opt.attr.size.z0) this.attr.size.z0 = opt.attr.size.z0;
				if (opt.attr.size.z1) this.attr.size.z1 = opt.attr.size.z1;
			}
		}
	}
	
	//更新实体方块大小
	updateSize(){
		const size = {
			x0: OR(this.get("attr", "size", "x0"), 0),
			x1: OR(this.get("attr", "size", "x1"), 100),
			y0: OR(this.get("attr", "size", "y0"), 0),
			y1: OR(this.get("attr", "size", "y1"), 100),
			z0: OR(this.get("attr", "size", "z0"), 0),
			z1: OR(this.get("attr", "size", "z1"), 100)
		};
		size.x = size.x1 - size.x0,
		size.y = size.y1 - size.y0,
		size.z = size.z1 - size.z0; //长宽高
		
		const pos = {
				x0: size.x0-50,
				x1: size.x1-50,
				y0: size.y0-50,
				y1: size.y1-50,
				z0: size.z0-50,
				z1: size.z1-50
			},
			uv = [
				[size.z0/100, size.y0/100, size.z1/100, size.y1/100],
				[size.x0/100, size.z0/100, size.x1/100, size.z1/100],
				[size.x0/100, size.y0/100, size.x1/100, size.y1/100]
			]/* ,
			uv = [
				[	[ pos[0][0], pos[0][1] ],
					[ pos[0][2], pos[0][1] ],
					[ pos[0][2], pos[0][3] ],
					[ pos[0][0], pos[0][3] ]	],
				
				[	[ pos[0][0], pos[0][1] ],
					[ pos[0][2], pos[0][1] ],
					[ pos[0][2], pos[0][3] ],
					[ pos[0][0], pos[0][3] ]	],
				
				[	[ pos[1][0], pos[1][1] ],
					[ pos[1][2], pos[1][1] ],
					[ pos[1][2], pos[1][3] ],
					[ pos[1][0], pos[1][3] ]	],
				
				[	[ pos[1][0], pos[1][1] ],
					[ pos[1][2], pos[1][1] ],
					[ pos[1][2], pos[1][3] ],
					[ pos[1][0], pos[1][3] ]	],
				
				[	[ pos[2][0], pos[2][1] ],
					[ pos[2][2], pos[2][1] ],
					[ pos[2][2], pos[2][3] ],
					[ pos[2][0], pos[2][3] ]	],
				
				[	[ pos[2][0], pos[2][1] ],
					[ pos[2][2], pos[2][1] ],
					[ pos[2][2], pos[2][3] ],
					[ pos[2][0], pos[2][3] ]	]
			] */;
		/* for (const [i,face] of Object.entries(this.get("entityBlock", "face")) ){
			this.setTexture(
				new THREE.TextureLoader().load(
					Img.clip(
						( face[2]? //自定义
							Img.scale(
								Img.clip( Img.get(face[2]), face[0]*16, face[1]*16, 16, 16 ),
							64, 64)
						:
							TEXTURES[ face[0] ][ face[1] ] ),
						uv[i][0], uv[i][1], uv[i][2]-uv[i][0], uv[i][3]-uv[i][1]
					).toDataURL("image/png")
				), i
			);
		} */
		this.block.geometry.setAttribute("position", new THREE.BufferAttribute(
			new Float32Array([
				pos.x1, pos.y1, pos.z1,
				pos.x1, pos.y1, pos.z0,
				pos.x1, pos.y0, pos.z1,
				pos.x1, pos.y0, pos.z0,
				
				pos.x0, pos.y1, pos.z0,
				pos.x0, pos.y1, pos.z1,
				pos.x0, pos.y0, pos.z0,
				pos.x0, pos.y0, pos.z1,
				
				pos.x0, pos.y1, pos.z0,
				pos.x1, pos.y1, pos.z0,
				pos.x0, pos.y1, pos.z1,
				pos.x1, pos.y1, pos.z1,
				
				pos.x0, pos.y0, pos.z1,
				pos.x1, pos.y0, pos.z1,
				pos.x0, pos.y0, pos.z0,
				pos.x1, pos.y0, pos.z0,
				
				pos.x0, pos.y1, pos.z1,
				pos.x1, pos.y1, pos.z1,
				pos.x0, pos.y0, pos.z1,
				pos.x1, pos.y0, pos.z1,
				
				pos.x1, pos.y1, pos.z0,
				pos.x0, pos.y1, pos.z0,
				pos.x1, pos.y0, pos.z0,
				pos.x0, pos.y0, pos.z0
			]), 3
		));
		this.block.geometry.setAttribute("uv", new THREE.BufferAttribute(
			new Float32Array([
				uv[0][0], uv[0][3],
				uv[0][2], uv[0][3],
				uv[0][0], uv[0][1],
				uv[0][2], uv[0][1],
				
				uv[0][0], uv[0][3],
				uv[0][2], uv[0][3],
				uv[0][0], uv[0][1],
				uv[0][2], uv[0][1],
				
				uv[1][0], uv[1][3],
				uv[1][2], uv[1][3],
				uv[1][0], uv[1][1],
				uv[1][2], uv[1][1],
				
				uv[1][0], uv[1][3],
				uv[1][2], uv[1][3],
				uv[1][0], uv[1][1],
				uv[1][2], uv[1][1],
				
				uv[2][0], uv[2][3],
				uv[2][2], uv[2][3],
				uv[2][0], uv[2][1],
				uv[2][2], uv[2][1],
				
				uv[2][0], uv[2][3],
				uv[2][2], uv[2][3],
				uv[2][0], uv[2][1],
				uv[2][2], uv[2][1]
				
				/* uv[0][3][0], uv[0][3][1],
				uv[0][2][0], uv[0][2][1],
				uv[0][0][0], uv[0][0][1],
				uv[0][1][0], uv[0][1][1],
				
				uv[1][3][0], uv[1][3][1],
				uv[1][2][0], uv[1][2][1],
				uv[1][0][0], uv[1][0][1],
				uv[1][1][0], uv[1][1][1],
				
				uv[2][3][0], uv[2][3][1],
				uv[2][2][0], uv[2][2][1],
				uv[2][0][0], uv[2][0][1],
				uv[2][1][0], uv[2][1][1],
				
				uv[3][3][0], uv[3][3][1],
				uv[3][2][0], uv[3][2][1],
				uv[3][0][0], uv[3][0][1],
				uv[3][1][0], uv[3][1][1],
				
				uv[4][3][0], uv[4][3][1],
				uv[4][2][0], uv[4][2][1],
				uv[4][0][0], uv[4][0][1],
				uv[4][1][0], uv[4][1][1],
				
				uv[5][3][0], uv[5][3][1],
				uv[5][2][0], uv[5][2][1],
				uv[5][0][0], uv[5][0][1],
				uv[5][1][0], uv[5][1][1] */
			]), 2
		));
		/* this.this.geometry.faceVertexUvs[0][0] = [ uv[0][3], uv[0][0], uv[0][2] ];
		this.this.geometry.faceVertexUvs[0][1] = [ uv[0][0], uv[0][1], uv[0][2] ];
		
		this.this.geometry.faceVertexUvs[0][2] = [ uv[1][3], uv[1][0], uv[1][2] ];
		this.this.geometry.faceVertexUvs[0][3] = [ uv[1][0], uv[1][1], uv[1][2] ];
		
		this.this.geometry.faceVertexUvs[0][4] = [ uv[2][3], uv[2][0], uv[2][2] ];
		this.this.geometry.faceVertexUvs[0][5] = [ uv[2][0], uv[2][1], uv[2][2] ];
		
		this.this.geometry.faceVertexUvs[0][6] = [ uv[3][3], uv[3][0], uv[3][2] ];
		this.this.geometry.faceVertexUvs[0][7] = [ uv[3][0], uv[3][1], uv[3][2] ];
		
		this.this.geometry.faceVertexUvs[0][8] = [ uv[4][3], uv[4][0], uv[4][2] ];
		this.this.geometry.faceVertexUvs[0][9] = [ uv[4][0], uv[4][1], uv[4][2] ];
		
		this.this.geometry.faceVertexUvs[0][10] = [ uv[5][3], uv[5][0], uv[5][2] ];
		this.this.geometry.faceVertexUvs[0][11] = [ uv[5][0], uv[5][1], uv[5][2] ]; */
		
		/* if ( this.have("block", "mesh") ){
			this.block.mesh.position.copy( this.block.mesh.position.clone()
				.divideScalar(100).round().multiplyScalar(100)
				.add(new THREE.Vector3(
					(size.x0 + size.x1)/2 /100 -0.5,
					(size.y0 + size.y1)/2 /100 -0.5,
					(size.z0 + size.z1)/2 /100 -0.5
				))
			);
		} */
			/* this.block.mesh.position
				.divideScalar(100).round().multiplyScalar(100) //规范化
				.add(new THREE.Vector3(
					(size.x0 + size.x1)/2 -50,
					(size.y0 + size.y1)/2 -50,
					(size.z0 + size.z1)/2 -50
				)); */
		
		return this;
	}
	
	//转换为方块
	toBlock(){
		const size = this.attr.size;
		delete this.attr.size;
		const block = new Block(this);
		this.attr.size = size;
		return block;
	}
}
EntityBlock.prototype.type = "EntityBlock"; //名称


/*
* Entity实体类 继承Thing类
*/
class Entity extends Thing{
	constructor(opt){
		super(opt);
		
		this.entity = {};
		if (opt.entity){
			//material
			if (opt.entity.material) this.entity.material = opt.entity.material; //材质
			//geometry
			if (opt.entity.geometry) this.entity.geometry = opt.entity.geometry; //几何体
			//mesh
			if (opt.entity.mesh) this.entity.mesh = opt.entity.mesh; //网格模型
			
			this.entity.added = false; //未加入scene
		}
		
		if (opt.attr){
			if (opt.attr.v){ //速度
				this.attr.v = {};
				if (opt.attr.v.x) this.attr.v = opt.attr.v.x;
				if (opt.attr.v.y) this.attr.v = opt.attr.v.y;
				if (opt.attr.v.z) this.attr.v = opt.attr.v.z;
			}
			
		}
	}
	
	// material
	setMaterial(material){
		this.set("entity", "material", material);
		return this;
	}
	deleteMaterial(){
		if ( this.have("entity", "material") )
			this.entity.material.dispose(); //清除内存
		this.set("entity", "material", null); //半保留
		return this;
	}
	
	// geometry
	setGeometry(geometry){
		this.set("entity", "geometry", geometry);
		return this;
	}
	deleteGeometry(){
		if ( this.have("entity", "geometry") )
			this.entity.geometry.dispose(); //清除内存
		this.set("entity", "geometry", null); //半保留
		return this;
	}
	
	//mesh
	makeMesh(){
		const mesh = new THREE.Mesh(this.get("entity", "geometry"), this.get("entity", "material"));
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData.thingObject = this;
		this.set("entity", "mesh", mesh); //网格模型对象Mesh
		return this;
	}
	deleteMesh(){
		if ( this.have("entity", "mesh") ){
			this.deleteMaterial();
			this.deleteGeometry(); //清除内存
		}
		this.set("entity", "mesh", null); //半保留
		return this;
	}
}
Entity.prototype.type = "Entity"; //名称


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
		this.attr = {};
		if (opt.attr){
			if (opt.attr.hardness) this.attr.hardness = opt.attr.hardness; //硬度
			if (opt.attr.durability) this.attr.durability = opt.attr.durability; //耐久度/m³
		}
	}
}
Tool.prototype.type = "Tool"; //名称
