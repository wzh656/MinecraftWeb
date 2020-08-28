function Thing(opt, template){
	//物品ID
	this.id = Number(opt.id);
	//this.id = Thing.prototype.idLength++; //同时自增
	
	if (template){
		for (let i of Object.keys(template)){
			if ((i == "block" || i == "attr") && i in opt){
				for (let j in template[i]){
					if ((i == "attr" && j == "block") && j in opt){
						for (let k in template[i][j]){
							if (template[i][j][k] != opt[i][j][k]){
								this[i][j][k] = template[i][j][k];
							}
						}
					}else if (template[i][j] != opt[i][j]){
						this[i][j] = template[i][j];
					}
				}
			}else if (template[i] != opt[i]){
				this[i] = template[i];
			}
			//Object.defineProperties();
		}
		return;
	}
	
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
Thing.prototype.geometry = new THREE.BoxGeometry(100, 100, 100);
//face
Thing.prototype.setFace = function(value, index){
	if (index != undefined){ //有索引（单个）
		this.block.face[index] = value;
	}else{ //无索引（所有）
		for (let i=0; i<value.length; i++)
			this.block.face[i] = value[i];
	}
	return this;
};
Thing.prototype.deleteFace = function(index){
	if (index != undefined){ //有索引
		delete this.block.face[index];
	}else{ //无索引
		this.block.face = [];
	}
};
Thing.prototype.editParent = function(value){
	this.block.parent = value;
}
//texture
Thing.prototype.setTexture = function(texture, index){
	if (!this.block.texture){
		this.block.texture = [];
	}
	if (index != undefined){ //有索引
		this.block.texture[index] = texture;
	}else{ //无索引
		for (let i=0; i<texture.length; i++){
			this.block.texture[i] = texture[i];
		}
	}
	return this;
};
Thing.prototype.deleteTexture = function(index){
	if (index != undefined){ //有索引
		this.block.texture[index].dispose(); //清除内存
		delete this.block.texture[index];
	}else{ //无索引
		for (let i of this.block.texture)
			i.dispose(); //清除内存
		delete this.block.texture;
	}
	return this;
};
//material
Thing.prototype.makeMaterial = function(){
	this.block.material = [
		new THREE.MeshLambertMaterial({ map:this.block.texture[0], transparent:this.attr.block.transparent || false }),
		new THREE.MeshLambertMaterial({ map:this.block.texture[1], transparent:this.attr.block.transparent || false }),
		new THREE.MeshLambertMaterial({ map:this.block.texture[2], transparent:this.attr.block.transparent || false }),
		new THREE.MeshLambertMaterial({ map:this.block.texture[3], transparent:this.attr.block.transparent || false }),
		new THREE.MeshLambertMaterial({ map:this.block.texture[4], transparent:this.attr.block.transparent || false }),
		new THREE.MeshLambertMaterial({ map:this.block.texture[5], transparent:this.attr.block.transparent || false })
	]; //材质对象 MeshLambertMaterial
	return this;
};
Thing.prototype.deleteMaterial = function(){
	for (let i of this.block.material)
		i.dispose(); //清除内存
	delete this.block.material;
	return this;
};
//geometry
Thing.prototype.makeGeometry = function(x, y, z){
	this.block.geometry = new THREE.BoxGeometry(x, y, z);
}
Thing.prototype.deleteGeometry = function(){
	this.block.geometry.dispose();
	delete this.block.geometry;
}
//mesh
Thing.prototype.makeMesh = function(geometry=this.block.geometry){
	if (geometry){
		this.block.mesh = new THREE.Mesh(geometry, this.block.material); //网格模型对象Mesh
	}else{ //使用默认
		this.block.mesh = new THREE.Mesh(Thing.prototype.geometry, this.block.material); //网格模型对象Mesh
	}
	this.block.mesh.castShadow = true;
	this.block.mesh.receiveShadow = true;
	this.block.mesh.userData.through = !!this.attr.block.through;
	return this;
};
Thing.prototype.deleteMesh = function(index){
	for (let i of this.block.mesh.material)
		i.dispose();
	this.block.mesh.geometry.dispose(); //清除内存
	delete this.block.mesh;
	return this;
};