addEventListener('message', function (e){
	switch (e.data.type){
		case "initBlock":
			let map = e.data.map;
			let [x, z] = [e.data.x, e.data.z].map(Math.round); //规范化
			
			if (map.activeBlock.every(function(value, index, arr){
				return value[0] != x || value[1] != z;
			})) //每个都不一样（不存在）
				map.activeBlock.push([x,z]);
			
			let ox = x*map.size.x,
				oz = z*map.size.z; //区块中心坐标
			for (let dx=map.size[0].x; dx<=map.size[1].x; dx++){
				map.map[ox+dx] = map.map[ox+dx] || [];
				for (let dy=map.size[0].y; dy<=map.size[1].y; dy++){
					map.map[ox+dx][dy] = map.map[ox+dx][dy] || [];
					for (let dz=map.size[0].z; dz<=map.size[1].z; dz++){
						map.map[ox+dx][dy][oz+dz] = null;
					}
				}
			}
			postMessage({
				map,
				callback: e.data.callback
			});
			break;
		case "unloadBlock":
			
			break;
		case "loadBlock":
			
			break;
	}
});