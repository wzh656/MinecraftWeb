class ColorUpdater{
	constructor (opt, setter){
		this.config = opt;
		this.setter = setter;
	}
	update(){
		let h = time.getTime(), colors={};
		h = h.getHours() + h.getMinutes()/60 + h.getSeconds()/3600 + h.getMilliseconds()/1000/3600;
		//h = (h.getSeconds()+h.getMilliseconds()/1000)/60*24
		
		const {pow, E} = Math;
		for (const i of ["R", "G", "B"]){
			const t = this.config[i];
			colors[i] = Math.round(Math.min(
				t[0].v.i / ( 1+pow( E,-(E/t[0].t.d)*(h-t[0].t.s) ) ) + t[0].v.s,
				t[1].v.i / ( 1+pow( E,-(E/t[1].t.d)*(h-t[1].t.s) ) ) + t[1].v.s
			));
		}
		//console.log(h, time.getTime(), colors)
		if (typeof this.setter == "function"){
			this.setter(`rgb(${colors.R},${colors.G},${colors.B})`);
		}else{
			this.setter.r = colors.R;
			this.setter.g = colors.G;
			this.setter.b = colors.B;
		}
		return this;
	}
	autoUpdate(step){
		time.setInterval((now, speed)=>{
			if(speed) this.update(); //时间流逝
		}, step);
		/*this.id = setInterval(()=>{this.update();}, step/gameTime.speed);
		gameTime.addChangeSpeedListener((speed)=>{
			if (speed){ //?0
				clearInterval(this.id);
				this.id = setInterval(()=>this.update(), step/speed);
			}
		});*/
		return this;
	}
	static dateToNumber(h=0, m=0, s=0){
		return (s/60+m)/60+h;
	}
}