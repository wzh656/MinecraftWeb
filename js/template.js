const TEMPLATES = []; //模板
TEMPLATES.push(new Block({
	id: 0,
	name: "空气"
}, false));
TEMPLATES.push(new Block({
	id: 1,
	name: "命令方块",
	block: {
		face: [
			[1,0, "./img/textures/textures.png"],
			[1,0, "./img/textures/textures.png"],
			[0,0, "./img/textures/textures.png"],
			[2,0, "./img/textures/textures.png"],
			[1,0, "./img/textures/textures.png"],
			[1,0, "./img/textures/textures.png"]
		]
	},
	attr: {
		block: {
			onRightMouseDown: "state('command');false;",
			onShortTouch: "state('command');false;"
		}
	}
}, false));
/*TEMPLATES.push(new Block({
	id: 2,
	name: "基岩",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
}, false));*/
TEMPLATES.push(new Block({
	id: 2,
	name: "草方块",
	block: {
		face: [
			[4,0, "./img/textures/textures.png"],
			[4,0, "./img/textures/textures.png"],
			[3,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"],
			[4,0, "./img/textures/textures.png"],
			[4,0, "./img/textures/textures.png"]
		]
	},
	attr: {
		block: {
			onChangeTo: "alert();"
		}
	}
}, false));
TEMPLATES.push(new Block({
	id: 3,
	name: "泥土",
	block: {
		face: [
			[5,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"],
			[5,0, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES.push(new Block({
	id: 4,
	name: "原石",
	block: {
		face: [
			[6,0, "./img/textures/textures.png"],
			[6,0, "./img/textures/textures.png"],
			[6,0, "./img/textures/textures.png"],
			[6,0, "./img/textures/textures.png"],
			[6,0, "./img/textures/textures.png"],
			[6,0, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES.push(new Block({
	id: 5,
	name: "石头",
	block: {
		face: [
			[7,0, "./img/textures/textures.png"],
			[7,0, "./img/textures/textures.png"],
			[7,0, "./img/textures/textures.png"],
			[7,0, "./img/textures/textures.png"],
			[7,0, "./img/textures/textures.png"],
			[7,0, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES.push(new Block({
	id: 6,
	name: "沙子",
	block: {
		face: [
			[0,1, "./img/textures/textures.png"],
			[0,1, "./img/textures/textures.png"],
			[0,1, "./img/textures/textures.png"],
			[0,1, "./img/textures/textures.png"],
			[0,1, "./img/textures/textures.png"],
			[0,1, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES[7.1] = new Block({
	id: 7.1,
	name: "细橡木",
	block: {
		parent: "./img/blocks/8/",
		face: [
			[2,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"],
			[1,1, "./img/textures/textures.png"],
			[1,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"]
		],
		geometry: new THREE.BoxBufferGeometry(40, 100, 40)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: true, //不让本方块透明
		}
	}
});
TEMPLATES[7.2] = new Block({
	id: 7.2,
	name: "粗橡木",
	block: {
		parent: "./img/blocks/8/",
		face: [
			[2,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"],
			[1,1, "./img/textures/textures.png"],
			[1,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"],
			[2,1, "./img/textures/textures.png"]
		],
		geometry: new THREE.BoxBufferGeometry(70, 100, 70)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: true, //不让本方块透明
		}
	}
});
TEMPLATES[8] = new Block({
	id: 8,
	name: "树叶",
	block: {
		face: [
			[3,1, "./img/textures/textures.png"],
			[3,1, "./img/textures/textures.png"],
			[3,1, "./img/textures/textures.png"],
			[3,1, "./img/textures/textures.png"],
			[3,1, "./img/textures/textures.png"],
			[3,1, "./img/textures/textures.png"]
		]
	},
	attr: {
		block: {
			transparent: true, //透明方块
			through: true //可穿过
		}
	}
});
TEMPLATES.push(new Block({
	id: 9,
	name: "木板",
	block: {
		face: [
			[4,1, "./img/textures/textures.png"],
			[4,1, "./img/textures/textures.png"],
			[4,1, "./img/textures/textures.png"],
			[4,1, "./img/textures/textures.png"],
			[4,1, "./img/textures/textures.png"],
			[4,1, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES.push(new Block({
	id: 10,
	name: "砖",
	block: {
		face: [
			[5,1, "./img/textures/textures.png"],
			[5,1, "./img/textures/textures.png"],
			[5,1, "./img/textures/textures.png"],
			[5,1, "./img/textures/textures.png"],
			[5,1, "./img/textures/textures.png"],
			[5,1, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));
TEMPLATES.push(new Block({
	id: 11,
	name: "仙人掌",
	block: {
		face: [
			[7,1, "./img/textures/textures.png"],
			[7,1, "./img/textures/textures.png"],
			[6,1, "./img/textures/textures.png"],
			[0,2, "./img/textures/textures.png"],
			[7,1, "./img/textures/textures.png"],
			[7,1, "./img/textures/textures.png"]
		]
	},
	attr: {}
}, false));