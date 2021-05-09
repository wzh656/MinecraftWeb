class GameTime{
	constructor (date, speed=1, stop=true){
		this.date = +new Date();
		this.game = +(date || new Date(3000,0,1,8));
		this.speed = +speed;
		this.stop = stop;
		this.onChangeSpeed = {};
		this.ids = {}; //setTimeout, setInterval
	}
	
	//获取时间
	getTime(){
		if (isNaN(time.game)) deskgood.die("穿越时空，到达时间之尾");
		return new Date( this.game + (new Date()-this.date) * this.getSpeed() );
	}
	//修正时间
	setTime(time){
		this.game = +time;
		this.date = +new Date();
		return this;
	}
	
	//修改时间流速
	setSpeed(speed=1){
		const v0 = this.getSpeed();
		
		this.game = +this.getTime();
		this.date = +new Date();
		this.speed = +speed;
		
		const v1 = this.getSpeed();
		if (v1 != v0) //流速改变 触发事件onChangeSpeed
			for (const i of Object.values(this.onChangeSpeed))
				i(v1);
		
		return this;
	}
	//获取时间流速
	getSpeed(){
		return this.stop? 0: this.speed;
	}
	
	//暂停时间
	stopTime(){
		const v0 = this.getSpeed();
		
		this.game = +this.getTime();
		this.date = +new Date();
		this.stop = !this.stop;
		
		const v1 = this.getSpeed();
		if (v1 != v0) //流速改变 触发事件onChangeSpeed
			for (const i of Object.values(this.onChangeSpeed))
				i(v1);
		
		return this;
	}
	//设置时间是否暂停
	setStop(stop){
		if (this.stop != stop)
			this.stopTime(); //暂停
		return this;
	}
	
	//添加事件
	addChangeSpeedListener(key, func){
		this.onChangeSpeed[key] = func;
		return this;
	}
	//移除事件
	removeChangeSpeedListener(key){
		delete this.onChangeSpeed[key];
		return this;
	}
	//分配不重复的key
	newChangeSpeedKey(){
		let key = String.random(); //随机生成key
		while (this.onChangeSpeed[key])
			key = String.random();
		return key;
	}
	
	//分配不重复的id及空间
	newId(){
		let id = String.random(); //随机生成id
		while (this.ids[id])
			id = String.random();
		this.ids[id] = {};
		return id;
	}
	
	setTimeout(func, delay){
		const endTime = +new Date()+delay/this.getSpeed(),
			id = this.newId(), //随机生成id
			space = this.ids[id];
		
		space.key = this.newChangeSpeedKey(); //随机生成key
		if ( this.getSpeed() ) //非暂停
			space.id = setTimeout(()=>{
				func( this.getTime(), this.getSpeed() );
				this.clearTimeout(id); //清除自己
			}, delay/this.getSpeed());
		
		this.addChangeSpeedListener(space.key, (speed)=>{ //添加时间流速改变监听
			this.clearTimeout(id); //清除自己
			
			if (+new Date() < endTime) //未达到目标时间
				this.ids[id] = this.setTimeout(func, endTime-new Date()); //重新setTimeout
		});
		
		return {id, func};
	}
	clearTimeout(id){
		clearTimeout(this.ids[id].id);
		this.removeChangeSpeedListener(this.ids[id].key); //删除监听
		delete this.ids[id];
		return this;
	}
	
	setInterval(func, step){
		const startTime = +new Date(),
			startSpeed = this.getSpeed(),
			id = this.newId(), //随机生成id
			space = this.ids[id];
		
		space.key = this.newChangeSpeedKey(); //随机生成key
		if ( this.getSpeed() ) //非暂停
			space.id = setInterval(
				() => func( this.getTime(), this.getSpeed() ),
				step / this.getSpeed()
			);
		
		this.addChangeSpeedListener(space.key, (speed)=>{ //添加时间流速改变监听
			this.clearTimeout(id); //清除自己
			
			this.ids[id] = this.setTimeout(
				() => {
					this.clearTimeout(id); //清除自己
					this.ids[id] = this.setInterval(func, step);
				},
				(new Date() - startTime) * startSpeed % step
			);
		});
		
		return {id, func};
	}
	clearInterval(id){
		clearInterval(this.ids[id].id);
		this.removeChangeSpeedListener(this.ids[id].key); //删除监听
		delete this.ids[id];
		return this;
	}
}
