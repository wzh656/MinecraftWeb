/**
 * 天气(sprite精灵)
 */
weather = Math.random()<0.75? 0: Math.random()*Math.random()*Math.random()/300*1000;//Math.abs(1-(Math.log(Math.random()+0.003)+6)/6);
console.info(`降水概率:${weather}滴/s/m²`, `降水范围：地图有效区域（<x:${map.size[0].x}~${map.size[1].x}>*<z:${map.size[0].z}~${map.size[1].z}>）`);
let sprite_system = [],
	sprite_lastTime = null,
	sprite_material = new THREE.SpriteMaterial({
		color: "#4c51a7", //设置精灵矩形区域颜色
		// rotation: Math.PI/180*45, //旋转精灵对象45度，弧度值
		// map: new THREE.TextureLoader().load("img/rain.png"), //设置精灵纹理贴图
	});
setInterval(function(){
	if (sprite_lastTime == null)
		sprite_lastTime = +new Date();
	let t = Math.round((+new Date() - sprite_lastTime)/1000*map.size.x*map.size.z*weather);
	sprite_lastTime = +new Date();
	
	if (stop)
		return;
	
	//雨滴降落
	for (let i=0; i<sprite_system.length; i++){
		sprite_system[i].position.y -= 10*1000*t/1000*rnd_error(); //10m/s //sprite_system[i].v*t/1000;
		if (map.get(
				sprite_system[i].position.x/100,
				sprite_system[i].position.y/100,
				sprite_system[i].position.z/100
			) //有方块
			||sprite_system[i].position.y < 0
		){
			sprite_system[i].material.dispose(); //清除内存
			scene.remove(sprite_system[i]);
			sprite_system.splice(i,1);
		}
	}
	
	while (t--){
		if (Math.random() <= weather){
			//创建精灵模型对象，不需要几何体geometry参数
			let sprite = new THREE.Sprite(sprite_material);
			scene.add(sprite);
			let pX = Math.random()*2000-1000, //[-1000,1000)
				pY = Math.random()*150*100+200*100, //[150m,200m)
				pZ = Math.random()*2000-1000; //[-1000,1000)
			
			sprite.position.set(pX, pY, pZ); //设置精灵位置
			//控制精灵大小，比如可视化中精灵大小表征数据大小
			sprite.scale.set(Math.random()*4+6, Math.random()*8+12, 1); //只需要设置x、y两个分量就可以 x:[6,10) y:[12,20)
			sprite_system.push(sprite);
		}
	}
}, 0);


let weather_folder = gui.addFolder("天气(weather)");
	weather_folder.add(window, "weather", 0, 1/300*1000, 1e-3).name("降水系数").onChange((value)=>{weather = (value*300/1000)**3/300*1000});
	weather_folder.add(sprite_system, "length", 0, 1000, 1).name("雨滴(sprite)个数").listen();
	weather_folder.add({clean: function(){
		for (let i in sprite_system){
			scene.remove(sprite_system[i]);
		}
		sprite_system.splice(0, sprite_system.length);
	}},"clean").name("清空(clean)");