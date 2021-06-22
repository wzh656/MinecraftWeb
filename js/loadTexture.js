// 加载贴图
let TEXTURES;
async function loadTextures(){
	const keys = Object.keys(TEMPLATES);
	TEXTURES = Img.grid(await Img.get("./img/textures/textures.png"), 16, 16);
	for (const i of keys.slice(1)){ //除去空气
		const block = TEMPLATES[i];
		for (let j=0; j<block.block.face.length; j++){
			const face = block.block.face[j];
			block.setTexture(
				new THREE.TextureLoader().load(
					Img.scale(
						( face[2]? //自定义
							Img.clip( await Img.get(face[2]), face[0]*16, face[1]*16, 16, 16 )
						:
							TEXTURES[ face[0] ][ face[1] ] ),
						64, 64
					).toDataURL("image/png")
				), j
			);
		}
		block.makeMaterial().deleteTexture();
	}
	// 所有block贴图加载完毕
	setTimeout(function(){
		$("#progress header").text("载入方块中……");
		$("#progress span").text(0);
		$("#progress progress")[0].max = 1;
		$("#progress progress")[0].value = 0;
		
		try_start_load(); //加载区块
	}, 0);
}
loadTextures();


// TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
// let num = 0;
/*let texture_load = {
	keys: Object.keys(TEMPLATES),
	id: null,
	try_load(){
		console.log("load_condition", perload_condition+1)
		if (++perload_condition == 2){
			map.perloadChunk({
				progressCallback: (value)=>{
					$("#progress span").text( Math.round(value*100, 2).changeDecimalBuZero(2, 2) );
					$("#progress progress").val( value );
				},
				finishCallback: ()=>{
					$("#progress span").text("100");
					$("#progress progress").val("1");
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
					},0);
				}
			});
		}
	} 
};
texture_load.id = setInterval(async function(){
	let block = TEMPLATES[ texture_load.keys[texture_load.i] ];
	for (let j in block.block.face){
		block = TEMPLATES[ texture_load.keys[texture_load.i] ];
		let img = await Img.imageScale( // 缩放图片至64*64
			await Img.getImage( //获取图片
				(block.block.parent || `./img/blocks/${block.id}/`) +
				block.block.face[j]
			), 64, 64
		);
		block.setTexture(
			new THREE.TextureLoader().load( //转换成texture
				img.toDataURL("image/png")
			),
		j );
		console.log(texture_loadi, block, TEMPLATES[ texture_load.keys[texture_load.i] ], j)
	}
	
	//单个block加载完毕
	$("#progress span").text( Math.round(texture_load.i/(texture_load.keys.length-1)*100, 2) );
	$("#progress progress")[0].value = texture_load.i;
	//console.log(texture_load.keys, texture_load.i)
	
	texture_load.i++;
	if ( TEMPLATES.every(v => v.have("block", "texture")) ){ //所有block贴图加载完毕
		$("#progress header").text("载入方块中……");
		$("#progress span").text(0);
		$("#progress progress")[0].max = 1; // 进度条最大进度（区块加载）
		$("#progress progress")[0].value = 0;
		
		clearInterval(texture_load.id);
		texture_load.id = null;
		
		console.log("load_condition", perload_condition+1)
		if (++perload_condition == 2){
			map.perloadChunk({
				progressCallback: (value)=>{
					$("#progress span").text( Math.round(value*100, 2).changeDecimalBuZero(2, 2) );
					$("#progress progress").val( value );
				},
				finishCallback: ()=>{
					$("#progress span").text("100");
					$("#progress progress").val("1");
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
					},0);
				}
			});
		}
		
		/* // map.initChunk(0, 0); //初始化区块
		map.loadChunkGenerator(0, 0, {
			progressCallback: function(value){
				$("#progress span").text( value*100 );
				$("#progress progress")[0].value = value;
			},
			finishCallback: function(){
				// map.updateChunkGenerator(0, 0); //更新区块
				if (++perload_condition >= 2){
					map.perloadChunk();
				}
				console.log(perload_condition)
				$("#progress span").text("100");
				$("#progress progress")[0].value = keys.length;
				setTimeout(function(){
					render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
					$("#progress").remove();
				},0);
			}
		}); //用噪声填充区块 *//*
	}
}, 0);
*/


/* (async function(){
	let keys = Object.keys(TEMPLATES);
	$("#progress progress")[0].max = keys.length; //进度条最大进度（贴图加载）
	for (let i=1; i<keys.length; i++){
		let block = TEMPLATES[ keys[i] ];
		for (let j in block.block.face)
			block.setTexture(
				new THREE.TextureLoader().load( // 转换为texture
					(await Img.scale( // 缩放图片至64*64
							await Img.get( // 获取图片
								(block.block.parent || `./img/blocks/${block.id}/`) +
								block.block.face[j]
							), 64, 64
						)
					).toDataURL("image/png") //保存为url:base64
				),
			j );
		
		//单个block贴图加载完毕
		$("#progress span").text( Math.round(i/(keys.length-1)*100, 2) );
		$("#progress progress")[0].value = i;
		//console.log(key, i)
	}
	// 所有block贴图加载完毕
	setTimeout(function(){
		$("#progress header").text("载入方块中……");
		$("#progress span").text(0);
		$("#progress progress")[0].max = 1;
		$("#progress progress")[0].value = 0;
		
		console.log("load_condition(load_texture)", perload_condition+1)
		if (++perload_condition == 2){
			map.perloadChunk({
				progressCallback: (value)=>{
					$("#progress span").text( Math.round(value*100, 2).changeDecimalBuZero(2, 2) );
					$("#progress progress").val( value );
				},
				finishCallback: ()=>{
					$("#progress span").text("100");
					$("#progress progress").val("1");
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
					},0);
				}
			});
		}
	}, 0);
})(); */

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
				map.loadChunk(0, 0);
				map.initChunk(0, 0);
				
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
								map.add(new Block(TEMPLATES[id]).block.makeMaterial().block.deleteTexture().block.makeMesh(), {x:load.x, y, z}); //以模板建立
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