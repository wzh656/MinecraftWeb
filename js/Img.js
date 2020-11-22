const Img = {
	// 获取图片对象
	get(src){
		return new Promise((resolve,reject)=>{
			let img = new Image();
			img.src = src;
			img.onload = ()=>{
				resolve(img);
			};
		});
	},
	// 图片裁剪
	clip(img, [x, y], [width, height]){
		let canvas1 = $("<canvas></canvas>").attr("width", img.width).attr("height", img.height)[0],
			canvas2 = $("<canvas></canvas>").attr("width", width).attr("height", height)[0],
			ctx1 = canvas1.getContext("2d"),
			ctx2 = canvas2.getContext("2d");
		ctx1.drawImage(img, 0, 0, img.width, img.height);
		let imgData = ctx1.getImageData(x, y, width, height);
		ctx2.putImageData(imgData, 0, 0);
		return canvas2;
	},
	// 图片大小缩放
	scale(img, width, height){
		let canvas1 = $("<canvas></canvas>").attr("width", img.width).attr("height", img.height)[0],
			canvas2 = $("<canvas></canvas>").attr("width", width).attr("height", height)[0],
			ctx1 = canvas1.getContext("2d"),
			ctx2 = canvas2.getContext("2d");
		ctx1.drawImage(img, 0, 0, img.width, img.height);
		let imgData = ctx1.getImageData(0, 0, img.width, img.height),
			x_scale = width/16,
			y_scale = height/16,
			x = y=0;
		for (let i=0; i<imgData.data.length; i+=4){
			let r = imgData.data[i+0],
				g = imgData.data[i+1],
				b = imgData.data[i+2],
				a = imgData.data[i+3];
			ctx2.fillStyle = `rgba(${r},${g},${b},${a})`;
			ctx2.fillRect(x*x_scale, y*y_scale, x_scale, y_scale);
			if (++x >= 16){
				y++;
				x = 0;
			}
		}
		return canvas2;
	}
};