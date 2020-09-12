const FACE_URL = [
	["side.png", "side.png", "up.png", "down.png", "side.png", "side.png"],
	["face.png", "face.png", "face.png", "face.png", "face.png", "face.png"]
];
const template = []; //模板
template.push(new Thing({
	id: 0,
	name: "空气"
}, false));
template.push(new Thing({
	id: 1,
	name: "命令方块",
	block: {
		face: FACE_URL[0]
	},
	attr: {
		block: {
			onRightMouseDown: "state('command');false;",
			onShortTouch: "state('command');false;"
		}
	}
}, false));
/*template.push(new Thing({
	id: 2,
	name: "基岩",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));*/
template.push(new Thing({
	id: 2,
	name: "草方块",
	block: {
		face: FACE_URL[0]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 3,
	name: "泥土",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 4,
	name: "原石",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 5,
	name: "石头",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 6,
	name: "沙子",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 7,
	name: "仙人掌",
	block: {
		face: FACE_URL[0]
	},
	attr: {}
}, false));
template[8.1] = new Thing({
	id: 8.1,
	name: "细橡木",
	block: {
		parent: "./img/blocks/8/",
		face: ["side.png", "side.png", "up_down.png", "up_down.png", "side.png", "side.png"],
		geometry: new THREE.BoxGeometry(40, 100, 40)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: true, //不让本方块透明
		}
	}
});
template[8.2] = new Thing({
	id: 8.2,
	name: "粗橡木",
	block: {
		parent: "./img/blocks/8/",
		face: ["side.png", "side.png", "up_down.png", "up_down.png", "side.png", "side.png"],
		geometry: new THREE.BoxGeometry(70, 100, 70)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: true, //不让本方块透明
		}
	}
});
template[9] = new Thing({
	id: 9,
	name: "树叶",
	block: {
		face: FACE_URL[1]
	},
	attr: {
		block: {
			transparent: true, //透明方块
			through: true //可穿过
		}
	}
});
template.push(new Thing({
	id: 10,
	name: "木板",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));
template.push(new Thing({
	id: 11,
	name: "砖",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));