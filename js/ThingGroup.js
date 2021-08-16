/*
* ThingGroup物品栏类 继承数组
*/
class ThingGroup extends Array{
	constructor (element, opt={}, ...array){
		super(...array);
		
		const {maxLength, fixedLength, onUpdate, onSelect} = opt;
		this.e = element; //文档元素
		this.maxLength = maxLength; //最大长度（包括固定）
		this.fixedLength = fixedLength; //固定长度
		this.validLength = this.length; //有效长度
		this.onUpdate = onUpdate; //更新回调
		this.onSelect = onSelect; //选择改变回调
		
		this.fix().update();
		this.select = this.length-1;
		this.setSelect(this.select); //更新css
	}
	
	//添加项目
	add(item){
		if (this.validLength+1 > this.maxLength){
			console.warn("ThingGroup.add", "full to add", item);
			return this;
		}
		
		this[this.validLength] = item;
		this.validLength++;
		
		return this.fix().update();
	}
	
	//删除项目
	delete(index, num=1){
		if (index+num-1 >= this.validLength){
			num = this.validLength-index;
		}
		this.splice(index, num);
		this.validLength -= num;
		
		return this.fix().update();
	}
	
	//更新固定
	fix(){
		const fixed = Math.min(this.fixedLength, this.maxLength-this.validLength); //可在末尾添加固定个数
		for (let i=0; i<fixed; i++)
			this[this.validLength+i] = null;
		
		return this;
	}
	
	//设置选中项
	setSelect(select){
		const before = this.select,
			after = Math.modRange(select, 0, this.length, 1);
		
		//onSelect事件
		if (this.select != after && this.onSelect && this.onSelect(after, before) === false)
			return;
		
		//改变并修改class
		this.select = after;
		$(this.e).children(":eq("+this.select+")").addClass("checked")
			.siblings().removeClass("checked");
		
		return this.update();
	}
	
	//选中项后移
	selectAdd(num=1){
		const before = this.select,
			after = Math.modRange(this.select+num, 0, this.length, 1);
		
		//onSelect事件
		if (this.select != after && this.onSelect && this.onSelect(after, before) === false)
			return;
		
		//改变并修改class
		this.select = after;
		$(this.e).children(":eq("+this.select+")").addClass("checked")
			.siblings().removeClass("checked");
		
		return this.update();
	}
	
	//选中项前移
	selectSub(num=1){
		const before = this.select,
			after = Math.modRange(this.select-num, 0, this.length, 1);
		
		//onSelect事件
		if (this.select != after && this.onSelect && this.onSelect(after, before) === false)
			return;
		
		//改变并修改class
		this.select = after;
		$(this.e).children(":eq("+this.select+")").addClass("checked")
			.siblings().removeClass("checked");
		
		return this.update();
	}
	
	//更新显示
	update(retryTime=1000){
		if (!TEXTURES) //贴图未加载 等待重试
			return setTimeout(()=>this.update(retryTime), retryTime);
		
		const children = [];
		for (let i=0; i<this.length; i++){
			let src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42m";
			if (this[i]){
				const [x, y] = this[i].get("view");
				src = TEXTURES[x][y].toDataURL();
			}
			children.push(
				$("<li></li>")
					.append(
						$("<img/>").attr("src", src)
					)
					.addClass(i==this.select? "checked": "")
			);
		}
		if (this.onUpdate)
			this.onUpdate(children);
		$(this.e).empty().append(...children);
		
		return this;
	}
}
/* class ThingGroup extends Array{
	constructor(element, opt={}, ...array) {
		super(...array);
		
		this.e = element;
		const {fixedLength, maxLength, onUpdate} = opt;
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
		if (onUpdate) this.onUpdate = onUpdate; //更新完回调
		
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
		if (typeof this.onUpdate == "function") this.onUpdate(children);
		$(this.e).empty().append(...children);
		return this;
	}
} */