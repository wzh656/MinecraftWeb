if (localStorage.getItem("我的世界_seed") === null){
	location.href = "home.html";
	message("无法读取数据！<br/>请重新创建游戏", 3);
}
let map = new ZoneMap([
	{x: -8, y: 0, z: -8},
	{x: 8, y: 256, z: 8}
],{
	seed: localStorage.getItem("我的世界_seed"),
	height: JSON.parse(localStorage.getItem("我的世界_height")) || {
		min: 30,
		max: 256,
		//ave: 10,
		q: 166,
		error:{
			min: -1,
			max: 1,
			q: 6
		}
	},
	dirt: JSON.parse(localStorage.getItem("我的世界_dirt")) || {
		min: 1,
		max: 4,
		q: 66,
		error:{
			min: -1,
			max: 1,
			q: 36
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
		min: 0.4,
		max: 0.8,
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
	}
}, 6*100);
document.title = "我的世界:"+map.seed.seed||"读取数据失败";