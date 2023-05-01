class GameTime{
	constructor (date, speed=1, stop=true){
		this.date = +new Date();
		this.game = +(date || new Date(3000,0,1,8));
		this.speed = +speed;
		this.stop = stop;
		this.onChangeSpeed = {};
	}
	getTime(){ //获取时间
		if (isNaN(time.game)) deskgood.die("穿越时空，到达时间之尾");
		return new Date( this.game + (new Date()-this.date) * this.getSpeed() );
	}
	setTime(time){ //修改时间
		this.game = +time;
		this.date = +new Date();
	}
	
	setSpeed(speed=1){ //修改时间流速
		const v0 = this.getSpeed();
		
		this.game = +this.getTime();
		this.date = +new Date();
		this.speed = +speed;
		
		const v1 = this.getSpeed();
		if (v1 != v0) //流速改变->触发事件onChangeSpeed
			for (const i of Object.values(this.onChangeSpeed))
				i(v1);
		
		return this;
	}
	stopTime(){ //暂停时间
		const v0 = this.getSpeed();
		
		this.game = +this.getTime();
		this.date = +new Date();
		this.stop = !this.stop;
		
		const v1 = this.getSpeed();
		if (v1 != v0) //流速改变->触发事件onChangeSpeed
			for (const i of Object.values(this.onChangeSpeed))
				i(v1);
		
		return this;
	}
	getSpeed(){ //获取时间流速
		return this.stop? 0: this.speed;
	}
	
	
	addChangeSpeedListener(key, func){ //添加事件
		this.onChangeSpeed[key] = func;
		
		return this;
	}
	removeChangeSpeedListener(key){ //移除事件
		delete this.onChangeSpeed[key];
		
		return this;
	}
	
	setTimeout(func, delay){
		let time = +new Date()+delay,
			key = Math.random().toString(36).substr(2); //随机生成key
		while (this.onChangeSpeed[key])
			key = Math.random().toString(36).substr(2);
		
		let id = setTimeout(()=>{
			func( this.getSpeed() );
			this.removeChangeSpeedListener(key); //删除监听
		}, delay/this.getSpeed());
		this.addChangeSpeedListener(key, (speed)=>{ //添加监听
			if (+new Date() < time){ //未达到目标时间
				clearTimeout(id);
				id = setTimeout( ()=>{
					func( speed );
					this.removeChangeSpeedListener(key); //删除监听
				}, (time-new Date())/speed );
			}else{
				this.removeChangeSpeedListener(key); //删除监听
			}
		});
		
		return {key, id, func};
	}
	
	setInterval(func, step){
		let key = Math.random().toString(36).substr(2);
		while (this.onChangeSpeed[key])
			key = Math.random().toString(36).substr(2);
		
		//console.log(step, this.getSpeed(), step/this.getSpeed())
		let id = setInterval(
			()=>func( this.getSpeed() ),
			step/this.getSpeed()
		);
		this.addChangeSpeedListener(key, (speed)=>{ //添加监听
			clearInterval(id);
			id = setInterval(()=>func(speed), step/speed);
		});
		
		return {key, id, func};
	}
}
