const FACE_URL = [
	["side.png", "side.png", "up.png", "down.png", "side.png", "side.png"],
	["face.png", "face.png", "face.png", "face.png", "face.png", "face.png"]
];
const template = []; //模板
template.push(new Thing({
	id: 0,
	name: "空气"
}));
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
}));
template.push(new Thing({
	id: 2,
	name: "基岩",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 3,
	name: "草方块",
	block: {
		face: FACE_URL[0]
	},
	attr: {}
}));
template.push(new Thing({
	id: 4,
	name: "泥土",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 5,
	name: "原石",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 6,
	name: "石头",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 7,
	name: "沙子",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 8,
	name: "仙人掌",
	block: {
		face: FACE_URL[0]
	},
	attr: {}
}));
template[9.1] = new Thing({
	id: 9.1,
	name: "细橡木",
	block: {
		parent: "./img/blocks/9/",
		face: ["side.png", "side.png", "up_down.png", "up_down.png", "side.png", "side.png"],
		geometry: new THREE.BoxGeometry(40, 100, 40)
	},
	attr: {
		transparent: true, //部分透明方块（不让相邻方块透明）
		noTransparent: true, //不让本方块透明
	}
});
template[9.2] = new Thing({
	id: 9.2,
	name: "粗橡木",
	block: {
		parent: "./img/blocks/9/",
		face: ["side.png", "side.png", "up_down.png", "up_down.png", "side.png", "side.png"],
		geometry: new THREE.BoxGeometry(70, 100, 70)
	},
	attr: {
		transparent: true, //部分透明方块（不让相邻方块透明）
		noTransparent: true, //不让本方块透明
	}
});
template[10] = new Thing({
	id: 10,
	name: "树叶",
	block: {
		face: FACE_URL[1]
	},
	attr: {
		transparent: true, //透明方块
		through: true //可穿过
	}
});
template.push(new Thing({
	id: 11,
	name: "木板",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));
template.push(new Thing({
	id: 12,
	name: "砖",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}));