function perGetColumn(opt){
	return new Promise(function(resolve, reject){
		let worker = new Worker("./perGetColumn_worker.js");
		worker.postMessage(opt);
		worker.onmessage = function (event){
			resolve(event.data);
		}
	});
	
}
self.addEventListener('message', function (e) {
	let {x, z, edit, t} = e.data;
	
	[x, z] = [x, z].map(Math.round); //规范化
	let ox = x*this.size.x,
		oz = z*this.size.z; //区块中心坐标
	
	let result = [];
	
	for (let dx=this.size[0].x; dx<=this.size[1].x; dx++){
		result[dx] = [];
		for (let dz=this.size[0].z; dz<=this.size[1].z; dz++){
			result[dx][dz] = await perGetColumn({x, z, edit, sNoise, t});
			for (let y in result[dx][dz])
				result[dx][dz][y] = new Thing(result[dx][dz][y]);
		}
	}
	self.postMessage({
		type: "finishCallback",
		value: result
	});
});