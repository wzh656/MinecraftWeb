/*
* ThingGroup物品栏类 继承数组
*/
class ThingGroup extends Array{
	constructor(element, opt={}, ...array) {
		super(...array);
		
		this.e = element;
		const {fixedLength, maxLength, updateCallback} = opt;
		if (fixedLength){ //固定长度
			this.fixedLength = +fixedLength;
			if (!opt.maxLength){ //无最大长度
				for (let i=0; i<this.fixedLength; i++)
					if (!this[i]) this[i] = null; //填满
			}else{ //有最大长度
				for (let i=0; i<this.fixedLength; i++)
					if (!this[i]) this[i] = null; //填满
			}
		}
		if (maxLength) this.maxLength = +maxLength; //最大长度
		if (updateCallback) this.updateCallback = updateCallback; //更新完回调
		
		// setTimeout( ()=>this.update(), 30 ); //自动更新
	}
	
	//添加
	add(...items){
		// const [where] = items.splice(-1);
		for (let i=0; i<items.length; i++)
			this.addOne(item[i], undefined, false);
		return this.update();
	}
	//添加一个
	addOne(item, where, needUpdate=true){
		if (this.fixedLength && !this.maxLength){ //有固定长度 且 无最大长度
			if (this[where||0]){ //已满 从头找空位
				for (let i=0; i<this.length; i++)
					if (!this[i]){
						this[i] = item;
						return needUpdate? this.update(): this;
					}
			}else{ //未满
				this[where||0] = item;
				return needUpdate? this.update(): this;
			}
			console.warn(`ThingGroup is full to add:`, item, where); //找不到空位
			return needUpdate? this.update(): this;
		
		}else{ //无固定长度 或 有最大长度
			if (this.length+1 > this.maxLength){ //加入后超过长度
				console.warn(`ThingGroup is full(maxLength:${this.maxLength}) to add:`, item, where);
				return needUpdate? this.update(): this;
			}
			if (where === undefined){ //无where 加在最后
				this.push(item);
			}else{ //有where 加在指定处
				this.splice(where, 0, item);
			}
			return needUpdate? this.update(): this;
		}
	}
	
	//删除
	delete(num=1, where){
		if (this.fixedLength && !this.maxLength){ //有固定长度 且 无最大长度
			for (let i=where; i<this.length; i++){ //从where开始删除num个
				if (--num < 0)
					return this.update();
				this[i] = null;
			}
		
		}else{ //无固定长度 或 有最大长度
			if (where === undefined){ //无where 删除尾部num个
				for (let i=0; i<num; i++)
					this.pop();
			}else{ //有where 删除指定位置开始num个
				this.splice(where, num);
			}
		}
		return this.update();
	}
	
	//更新
	update(retryTime=1000){
		if (!TEXTURES) //贴图未加载 等待重试
			return setTimeout(()=>this.update(retryTime), retryTime);
		
		let children = [],
			len = 0;
		if (this.fixedLength && !this.maxLength){ //有固定长度 且 无最大长度
			len = this.fixedLength;
		}else{
			len = this.length;
		}
		for (let i=0; i<len; i++){
			let src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42m"; //透明图片
			if ( this[i] ){ //有方块
				const face = this[i].get("view");
				src = ( face[2]? //自定义贴图位置
						Img.clip( Img.get(face[2]), face[0]*16, face[1]*16, 16, 16 )
					:
						TEXTURES[ face[0] ][ face[1] ]
				).toDataURL("image/png");
			}
			children.push(
				$("<li></li>")
					.append(
						$("<img/>").attr("src", src)
					)
			);
		}
		if (this.fixedLength && this.maxLength){ //有固定长度 且 有最大长度  在尾部添加fixedLength个空格
			const addLen = Math.min(this.fixedLength, this.maxLength-(len+this.fixedLength));
			for (let i=addLen; i>0; i--) //添加空白
				children.push(
					$("<li></li>")
					.append(
						$("<img/>")
							.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4//8/AwAI/AL+eMSysAAAAABJRU5ErkJggg==") //透明图片
					)[0]
				);
		}
		if (typeof this.updateCallback == "function") this.updateCallback(children);
		$(this.e).empty().append(...children);
		return this;
	}
}