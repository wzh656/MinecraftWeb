class GameTime{
	constructor (speed=1){
		this.date = +new Date();
		this.game = +new Date(3000,0,1,8);
		this.speed = +speed;
		this.stop = true;
		this.onChangeSpeed = [];
	}
	getTime(){
		if (isNaN(time.game)) deskgood.die("穿越时空，到达时间之尾");
		return new Date(this.game+(new Date()-this.date)*(stop? 0: this.speed));
	}
	setSpeed(speed=0){
		this.game = +this.getTime();
		this.date = +new Date();
		this.speed = +speed;
		for (let i of this.onChangeSpeed)
			i(this.speed);
		return this;
	}
	stopTime(){
		this.game = +this.getTime();
		this.date = +new Date();
		this.stop = !this.stop;
		for (let i of this.onChangeSpeed)
			i(this.speed);
		return this;
	}
	addChangeSpeedListener(func){
		this.onChangeSpeed.push(func);
		return this;
	}
}