class GameTime{
	constructor (date, speed=1, stop=true){
		this.date = +new Date();
		this.game = +(date || new Date(3000,0,1,8));
		this.speed = +speed;
		this.stop = stop;
		this.onChangeSpeed = {};
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
	
	setTimeout(func, delay){
		const endTime = +new Date()+delay/this.getSpeed(),
			key = this.newChangeSpeedKey(), //随机生成key
			id = setTimeout(()=>{
				func( this.getTime(), this.getSpeed() );
				this.removeChangeSpeedListener(key); //删除监听	
			}, delay/this.getSpeed());
		
		this.addChangeSpeedListener(key, (speed)=>{ //添加监听
			this.removeChangeSpeedListener(key); //删除监听
			if (+new Date() < endTime){ //未达到目标时间
				clearTimeout(id);
				this.setTimeout(func, endTime-new Date()); //重新setTimeout
			}
		});
		
		return {key, id, func};
	}
	clearTimeout({key, id}){
		clearTimeout(id);
		this.removeChangeSpeedListener(key); //删除监听
		return this;
	}
	
	setInterval(func, step){
		const startTime = +new Date(),
			startSpeed = this.getSpeed(),
			key = this.newChangeSpeedKey(), //随机生成key
			id = setInterval(
				() => func( this.getTime(), this.getSpeed() ),
				step/this.getSpeed()
			);
		
		this.addChangeSpeedListener(key, (speed)=>{ //添加监听
			clearInterval(id);
			this.setTimeout(
				() => this.setInterval(func, step),
				(new Date()-startTime)*startSpeed%step
			)
		});
		
		return {key, id, func};
	}
	clearInterval({key, id}){
		clearInterval(id);
		this.removeChangeSpeedListener(key); //删除监听
		return this;
	}
}
