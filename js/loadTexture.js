/**
 * String.padStart()
 * version 1.0.1
 * Feature	        Chrome  Firefox Internet Explorer   Opera	Safari	Edge
 * Basic support	57   	51      (No)	            44   	10      15
 * -------------------------------------------------------------------------------
 */
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}
// 小数点后补位
Number.prototype.changeDecimalBuZero = function(padEnd, padStart){
	var f_x = parseFloat(this);
	if (isNaN(f_x)) {
		return 0;
	}
	var s_x = this.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + padEnd){
		s_x += '0';
	}
	return s_x.padStart(padStart, "0");
}


/**
* 创建网格模型
*/
function getImage(src){
	return new Promise((resolve,reject)=>{
		let img = new Image();
		img.src = src;
		img.onload = ()=>{
			resolve(img);
		}
	});
}
async function getImageBase64(src, width, height){
	let canvas1 = $("<canvas></canvas>").attr("width", "16").attr("height", "16")[0],
		canvas2 = $("<canvas></canvas>").attr("width", width).attr("height", height)[0];
	let ctx1 = canvas1.getContext("2d"),
		ctx2 = canvas2.getContext("2d");
	let img = await getImage(src);
	ctx1.drawImage(img, 0, 0, 16, 16);
	let imgData = ctx1.getImageData(0, 0, 16, 16);
	let x_scale = width/16,
		y_scale = height/16;
	let x=0, y=0;
	for (let i=0; i<imgData.data.length; i+=4){
		let r = imgData.data[i+0];
		let g = imgData.data[i+1];
		let b = imgData.data[i+2];
		let a = imgData.data[i+3];
		ctx2.fillStyle = `rgba(${r},${g},${b},${a})`;
		ctx2.fillRect(x*x_scale, y*y_scale, x_scale, y_scale);
		if (++x >= WIDTH){
			y++;
			x = 0;
		}
	}
	return canvas2.toDataURL("image/png");
}
// TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
// let num = 0;
$("#progress progress")[0].max = Object.keys(TEMPLATES).length;
for (i=1; i<Object.keys(TEMPLATES).length; i++){
	(async function (){
		let block = TEMPLATES[ Object.keys(TEMPLATES)[i] ];
		for (let j in block.block.face){
			let url = await getImageBase64(
				(block.block.parent || `./img/blocks/${block.id}/`)+
				block.block.face[j]
			);
			block.setTexture( new THREE.TextureLoader().load(url), j );
		}
		
		//单个block加载完毕
		$("#progress span").text( Math.round( i/(Object.keys(TEMPLATES).length-1)*100 *100)/100 );
		$("#progress progress")[0].value = i;
		//console.log(key, i)
		
		if (i >= Object.keys(TEMPLATES).length){ //所有block加载完毕
			$("#progress header").text("载入方块中……");
			$("#progress span").text(0);
			$("#progress progress")[0].max = 1;
			$("#progress progress")[0].value = 0;
			
			if (++perload_condition >= 2){
				console.log(perload_condition)
				map.perloadChunk({
					progressCallback: (value)=>{
						$("#progress span").text( (Math.round(value*100*100)/100 ).changeDecimalBuZero(2, 2) );
						$("#progress progress")[0].value = value;
					},
					finishCallback: ()=>{
						$("#progress span").text("100");
						$("#progress progress")[0].value = 1;
						setTimeout(function(){
							render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
							$("#progress").remove();
						},0);
					}
				});
			}
			/* // map.initChunk(0, 0); //初始化区块
			map.loadChunkAsync(0, 0, {
				progressCallback: function(value){
					$("#progress span").text( value*100 );
					$("#progress progress")[0].value = value;
				},
				finishCallback: function(){
					// map.updateChunkAsync(0, 0); //更新区块
					if (++perload_condition >= 2){
						map.perloadChunk();
					}
					console.log(perload_condition)
					$("#progress span").text("100");
					$("#progress progress")[0].value = Object.keys(TEMPLATES).length;
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
					},0);
				}
			}); //用噪声填充区块 */
		}
	})();
}

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