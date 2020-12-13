class Weather{
	constructor ( [x0, z0], [x1, z1], rain ){
		this.size = {
			x: Math.round(x1 - x0),
			z: Math.round(z1 - z0),
			0: {
				x: Math.round(x0), //-8m
				z: Math.round(z0) //-8m
			},
			1: {
				x: Math.round(x1), //8m
				z: Math.round(z1) //8m
			}
		};
		this.rain = rain;
		this.rain_sys = [];
		this.rain_material = new THREE.SpriteMaterial({
			color: "#4c51a7", //设置精灵矩形区域颜色
			opacity: 0.3 //透明度
			// rotation: Math.PI/180*45, //旋转精灵对象45度，弧度值
			// map: new THREE.TextureLoader().load("img/rain.png"), //设置精灵纹理贴图
		});
	}
	
	start_rain(rest=0){
		this.rain_last = +new Date();
		this.rain_id = setInterval(()=>{
			const t = (new Date() - this.rain_last) /1000; //s
			this.rain_last = +new Date();
			
			if (stop)
				return;
			
			//雨滴降落
			for (let i=this.rain_sys.length-1; i>=0; i--){
				const item = this.rain_sys[i];
				item.position.y -= 10*100 *t *rnd_error(); //10m/s
				if (map.get(
						item.position.x/100,
						item.position.y/100,
						item.position.z/100
					) //有方块
					|| item.position.y < 0
				){
					item.material.dispose(); //清除内存
					scene.remove( item );
					this.rain_sys.splice(i, 1);
				}
			}
			
			let count = Math.round( t *this.size.x *this.size.z );
			while (count--){
				if (Math.random() <= this.rain){
					//创建精灵模型对象，不需要几何体geometry参数
					const sprite = new THREE.Sprite(this.rain_material),
						x = Math.random() *this.size.x*100 + this.size[0].x*100, //[-1000,1000)
						y = Math.random() *10*100 + deskgood.pos.y +10*100, //[~+10m, ~+20m)
						z =Math.random() *this.size.z*100 + this.size[0].z*100; //[-1000,1000)
					
					sprite.position.set(x, y, z); //设置精灵位置
					sprite.scale.set(Math.random()*4+6, Math.random()*8+12, 1); //只需要设置x、y两个分量就可以 x:[6,10) y:[12,20) //控制精灵大小，比如可视化中精灵大小表征数据大小
					
					scene.add(sprite);
					this.rain_sys.push(sprite);
				}
			}
		}, rest);
		return this.rain_id;
	}
	
	clear_rain(){
		clearInterval(this.rain_id);
		for (let i=this.rain_sys.length-1; i>=0; i--){
			this.rain_sys[i].material.dispose(); //清除内存
			scene.remove(this.rain_sys[i]);
			delete this.rain_sys[i];
		}
		this.rain_sys = [];
		return this;
	}
}