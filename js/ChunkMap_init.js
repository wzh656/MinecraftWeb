if (localStorage.getItem("我的世界_seed") === null){
	location.href = "home.html";
	message("无法读取数据", "无法读取数据！<br/>请重新创建游戏", "red", 3);
}

const map = new ChunkMap({
	scene: Thing.group,
	size: [
		{x: -SETTINGS.chunk.size.x, y: 0, z: -SETTINGS.chunk.size.z},
		{x: SETTINGS.chunk.size.x, y: SETTINGS.chunk.size.y, z: SETTINGS.chunk.size.z},
	],
	seed: {
		seed: localStorage.getItem("我的世界_seed"),
		height: JSON.parse(localStorage.getItem("我的世界_height")) || {
			min: 1,
			max: 256,
			//ave: 10,
			q: 266,
			error:{
				min: -1,
				max: 1,
				q: 6
			}
		},
		dirt: JSON.parse(localStorage.getItem("我的世界_dirt")) || {
			min: 0.1,
			max: 0.4,
			q: 66,
			error:{
				min: -0.1,
				max: 0.1,
				q: 6
			}
		},
		type: JSON.parse(localStorage.getItem("我的世界_type")) || {
			forest: 0.4,
			grassland: 0.4,
			desert: 0.2,
			q: 666
		},
		treeHeight: JSON.parse(localStorage.getItem("我的世界_treeHeight")) || {
			plant: {
				min: 3/6,
				max: 4/6
			},
			min: 1,
			max: 10,
			q: 1,
			error:{
				min: -1,
				max: 1,
				q: 1
			}
		},
		leavesScale: JSON.parse(localStorage.getItem("我的世界_leavesScale")) || {
			min: 0.6,
			max: 0.9,
			q: 16,
			error:{
				min: -0.1,
				max: 0.1,
				q: 6
			}
		},
		openStone: JSON.parse(localStorage.getItem("我的世界_openStone")) || {
			min: -0.99,
			max: 0.01,
			q: 1
		},
		weatherRain: JSON.parse(localStorage.getItem("我的世界_weatherRain")) || {
			min: -0.6, // 66%不下雨
			max: 0.3,
			q: 10000, //10000m=10km <=> 86400s=1440min=24h
			error:{
				min: -0.1,
				max: 0.1,
				q: 16
			}
		},
	},
	preloadLength: SETTINGS.chunk.preloadLength,
	preloadEntityLength: SETTINGS.chunk.preloadEntityLength,
});
document.title = "我的世界:"+map.seed.seed||"读取数据失败";