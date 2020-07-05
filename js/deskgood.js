let deskgood = {
	pos: {},
	v: {}
}
addEventListener('message', function (e){
	deskgood.pos.x = e.data[0].x;
	deskgood.pos.y = e.data[0].y;
	deskgood.pos.z = e.data[0].z;
	deskgood.v.x = e.data[1].x;
	deskgood.v.y = e.data[1].y;
	deskgood.v.z = e.data[1].z;
	
	let t0 = +new Date();
	setInterval(function(){
		let t = +new Date()-t0;
		t0 = +new Date();
		
		let ρ = 1.25*(Math.random()*0.2+0.9), //空气密度/(kg/m³)
			c = 0.4*(Math.random()*0.2+0.9), //空气阻力系数
			s = [0.5, 0.2, 0.5], //面积/m²
			v = [deskgood.v.x, deskgood.v.y, deskgood.v.z], //速度/(m/s)
			Fw = [], //空气阻力/N
			m = 50, //质量/m
			Aw = [] //空气阻力产生的加速度/(m/s²)
		for (let i=0; i<3; i++){
			Fw[i] = (1/2) * c * ρ * s[i] * v[i]*v[i]; //F = (1/2)CρSV²
			Aw[i] = Fw[i] / m; //F=ma => a=F/m
		}
		
		deskgood.v.y -= 9.8*t/1000*(Math.random()*0.2+0.9); //重力加速度
		deskgood.v.x +=
			Math.abs(Aw[0]*t/1000) < Math.abs(deskgood.v.x)?
				Aw[0]*t/1000
			:
				deskgood.v.x
		;
		deskgood.v.y +=
			Math.abs(Aw[1]*t/1000) < Math.abs(deskgood.v.y)?
				Aw[1]*t/1000
			:
				deskgood.v.y
		;
		deskgood.v.z +=
			Math.abs(Aw[2]*t/1000) < Math.abs(deskgood.v.z)?
				Aw[2]*t/1000
			:
				deskgood.v.z
		;
		//console.info("aw:",Aw, "Fw:",Fw, "v:", deskgood.v)
		
		postMessage([deskgood.v.x*100*t/1000, deskgood.v.y*100*t/1000, deskgood.v.z*100*t/1000]);
		return;
		let rt = deskgood.go(deskgood.v.x*100*t/1000, deskgood.v.y*100*t/1000, deskgood.v.z*100*t/1000);
		//					m/s*100*ms/1000 => cm/s*s => cm => px
		if (rt[0]) deskgood.v.x = 0;
		if (rt[1]) deskgood.v.y = 0;
		if (rt[2]) deskgood.v.x = 0;
	},0);
}, false);