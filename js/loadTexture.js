/**
* 创建网格模型
*/
// TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
// let num = 0;
let block_load = {
	i: 1,
	key: Object.keys(TEMPLATES)[1],
	id: null
}
$("#progress progress")[0].max = Object.keys(TEMPLATES).length;
block_load.id = setInterval(function(){
	for (let j in TEMPLATES[block_load.key].block.face)
		TEMPLATES[block_load.key].setTexture(
			new THREE.TextureLoader()
				.load( (TEMPLATES[block_load.key].block.parent||`./img/blocks/${TEMPLATES[block_load.key].id}/`) + TEMPLATES[block_load.key].block.face[j] ), j);
	
	//单个block加载完毕
	$("#progress span").text( Math.round( block_load.i++/(Object.keys(TEMPLATES).length-1)*100 *100)/100 );
	$("#progress progress")[0].value = block_load.i;
	block_load.key = Object.keys(TEMPLATES)[block_load.i];
	//console.log(block_load.key, block_load.i)
	
	if (block_load.i >= Object.keys(TEMPLATES).length){ //所有block加载完毕
		clearInterval(block_load.id);
		delete block_load;
		$("#progress header").text("载入方块中……");
		$("#progress span").text(0);
		$("#progress progress")[0].max = 1;
		$("#progress progress")[0].value = 0;
		
		map.initZone(0, 0); //初始化区块
		map.loadZoneAsync(0, 0, {
			progressCallback: function(value){
				$("#progress span").text( value*100 );
				$("#progress progress")[0].value = value;
			},
			finishCallback: function(){
				map.updateZoneAsync(0, 0); //更新区块
				if (++perload_condition >= 2){
					map.perloadZone();
				}
				console.log(perload_condition)
				$("#progress span").text("100");
				$("#progress progress")[0].value = Object.keys(TEMPLATES).length;
				setTimeout(function(){
					render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
					$("#progress").remove();
				},0);
			}
		}); //用噪声填充区块
	}
},0);

/* let textureLoader = new THREE.TextureLoader();
for (let i=1; i<TEMPLATES.length; i++){
	for (let j=0; j<6; j++){
		textureLoader.load(`./img/blocks/${i}/${TEMPLATES[i].block.face[j]}`, function (texture){
			TEMPLATES[i].block.setTexture(texture, j);
			
			if (TEMPLATES[i].block.texture.length < 6)
				return;
			for (let k=0; k<TEMPLATES[i].block.texture.length; k++)
				if (!TEMPLATES[i].block.texture[k])
					return;
			
			//单个block加载完毕
			//TEMPLATES[i].block.makeMaterial().block.deleteTexture();
			//TEMPLATES[i].block.makeMesh().deleteMaterial();
			$("#progress2").text( Math.round(i/TEMPLATES.length*100*100)/100 );
			
			for (let k=1; k<TEMPLATES.length; k++)
				if (!TEMPLATES[k].block.texture/*material*//*)
					return;
			
			//所有block加载完毕
			$("#progress_message").text("载入方块中……");
			$("#progress1").text("50");
			if (localStorage.getItem("我的世界.存档.方块")){
				map.useSave( JSON.parse(localStorage.getItem("我的世界.存档.方块")) );
				console.log("achieve loading");
				$("#progress1").text("100");
				//纹理贴图加载成功后，调用渲染函数执行渲染操作
				render();
				$("#progress").remove();
			}else{ //初始化地形
				map.loadZone(0, 0);
				map.initZone(0, 0);
				
				$("#progress1").text("100");
				//纹理贴图加载成功后，调用渲染函数执行渲染操作
				render();
				$("#progress").remove();
				/*let load = {
					x: null,
					loop: null
				}
				load.x = map.size[0].x;
				load.loop = setInterval(function (){
					for (let y=map.size[0].y; y<=map.size[1].y; y++){
						for (let z=map.size[0].z; z<=map.size[1].z; z++){
							let id = 0;
							if (y == 0){
								id = 3;
							}else if (y == 1){
								if (load.x < 0){
									id = 1;
								}else if (load.x > 6){
									id = 2;
								}else{
									id = 4;
								}
							}else if (y < 6){
								id = 6;
							}
							if (id != 0)
								map.add(new Thing(TEMPLATES[id]).block.makeMaterial().block.deleteTexture().block.makeMesh(), {x:load.x, y, z}); //以模板建立
								//map.update(load.x ,y ,z); //刷新是否添加方块
								// TEMPLATES[id].block.deleteMesh();
						}
					}
					
					$("#progress2").text( Math.round((load.x-map.size[0].x)/map.size.x*100*100)/100 );
					
					console.log("finish loading:", load.x);
					if (++load.x > map.size[1].x){
						console.log("achieve loading");
						map.updateAll();
						$("#progress1").text("100");
						//纹理贴图加载成功后，调用渲染函数执行渲染操作
						render();
						$("#progress").remove();
						clearInterval(load.loop);
						/* delete load.loop;
						delete load.x; *//*
					}
				},0);*//*
			}
		});
	}
} */