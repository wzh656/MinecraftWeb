class GameTime{
	constructor (speed=1, stop=true){
		this.date = +new Date();
		this.game = +new Date(3000,0,1,8);
		this.speed = +speed;
		this.stop = stop;
		this.onChangeSpeed = {};
	}
	getTime(){
		if (isNaN(time.game)) deskgood.die("穿越时空，到达时间之尾");
		return new Date( this.game + (new Date()-this.date) * this.getSpeed() );
	}
	
	setSpeed(speed=1){
		this.game = +this.getTime();
		this.date = +new Date();
		this.speed = +speed;
		for (let i of Object.values(this.onChangeSpeed))
			i(speed);
		return this;
	}
	stopTime(){
		this.game = +this.getTime();
		this.date = +new Date();
		this.stop = !this.stop;
		for (let i of Object.values(this.onChangeSpeed))
			i(this.getSpeed());
		return this;
	}
	getSpeed(){
		return this.stop? 0: this.speed;
	}
	
	
	addChangeSpeedListener(key, func){
		this.onChangeSpeed[key] = func;
		return this;
	}
	removeChangeSpeedListener(key){
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
			delete this.onChangeSpeed[key]; //删除监听
		}, delay/this.speed);
		this.onChangeSpeed[key] = (speed)=>{
			if (+new Date() <= time){
				clearTimeout(id);
				id = setTimeout( ()=>{
					func( speed );
					delete this.onChangeSpeed[key]; //删除监听
				}, (time-new Date())/speed );
			}else{
				delete this.onChangeSpeed[key];
			}
		};
		return [key, id];
	}
	
	setInterval(func, step){
		let key = Math.random().toString(36).substr(2);
		while (this.onChangeSpeed[key])
			key = Math.random().toString(36).substr(2);
		
		//console.log(step, this.getSpeed(), step/this.getSpeed())
		let id = setInterval( ()=>func( this.getSpeed() ), step/this.getSpeed() );
		this.onChangeSpeed[key] = (speed)=>{
			console.log(step, speed, step/speed)
			clearInterval(id);
			id = setInterval(()=>func(speed), step/speed);
		};
		return [key, id];
	}
}
