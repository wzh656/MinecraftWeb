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
			if ( this[i] ){
				const face = this[i].get("view");
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