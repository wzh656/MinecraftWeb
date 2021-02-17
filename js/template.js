const TEMPLATES = []; //模板
TEMPLATES[0] = new Block({
	id: 0,
	name: "空气"
});
TEMPLATES[1] = new Block({
	id: 1,
	name: "命令方块",
	view: [1,0],
	block: {
		face: [
			[1,0], [1,0], [0,0], [2,0], [1,0], [1,0]
		]
	},
	attr: {
		block: {
			onRightMouseDown: "status('command');false;",
			onShortTouch: "status('command');false;"
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
/*TEMPLATES[2] = new Block({
	id: 2,
	name: "基岩",
	block: {
		face: FACE_URL[1]
	},
	attr: {}
});*/
TEMPLATES[2] = new Block({
	id: 2,
	name: "草方块",
	view: [4,0],
	block: {
		face: [
			[4,0], [4,0], [3,0], [5,0], [4,0], [4,0]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');message('绿色成就','【获得成就】<br/>恭喜获得成就：头上长草绿得快。');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[3] = new Block({
	id: 3,
	name: "泥土",
	view: [5,0],
	block: {
		face: [
			[5,0], [5,0], [5,0], [5,0], [5,0], [5,0]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[4] = new Block({
	id: 4,
	name: "原石",
	view: [6,0],
	block: {
		face: [
			[6,0], [6,0], [6,0], [6,0], [6,0], [6,0]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[5] = new Block({
	id: 5,
	name: "石头",
	view: [7,0],
	block: {
		face: [
			[7,0], [7,0], [7,0], [7,0], [7,0], [7,0]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[6] = new Block({
	id: 6,
	name: "沙子",
	view: [0,1],
	block: {
		face: [
			[0,1], [0,1], [0,1], [0,1], [0,1], [0,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[7.1] = new Block({
	id: 7.1,
	name: "细橡木",
	view: [2,1],
	block: {
		parent: "./img/blocks/8/",
		face: [
			[2,1], [2,1], [1,1], [1,1], [2,1], [2,1]
		], geometry: new THREE.BoxBufferGeometry(40, 100, 40)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: [
				true,
				true,
				false,
				false,
				true,
				true
			] //不让本方块前后左右透明
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[8] = new Block({
	id: 8,
	name: "疏树叶",
	view: [3,1],
	block: {
		face: [
			[3,1], [3,1], [3,1], [3,1], [3,1], [3,1]
		]
	},
	attr: {
		block: {
			transparent: true, //透明方块
			noTransparent: true, //不让本方块透明
			through: true //可穿过
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[8.2] = new Block({
	id: 8.2,
	name: "密树叶",
	view: [4,1],
	block: {
		face: [
			[4,1], [4,1], [4,1], [4,1], [4,1], [4,1]
		]
	},
	attr: {
		block: {
			transparent: true, //透明方块
			noTransparent: true, //不让本方块透明
			through: true //可穿过
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[9] = new Block({
	id: 9,
	name: "木板",
	view: [5,1],
	block: {
		face: [
			[5,1], [5,1], [5,1], [5,1], [5,1], [5,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[10] = new Block({
	id: 10,
	name: "砖",
	view: [6,1],
	block: {
		face: [
			[6,1], [6,1], [6,1], [6,1], [6,1], [6,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[11] = new Block({
	id: 11,
	name: "仙人掌",
	view: [0,2],
	block: {
		face: [
			[0,2], [0,2], [7,1], [1,2], [0,2], [0,2]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[12.2] = new Tool({
	id: 12.2,
	name: "石镐",
	view: [2,2],
	attr: {
		hardnesss: 10,
		durability: 10
	}
});
TEMPLATES[13.2] = new Tool({
	id: 13.2,
	name: "石剑",
	view: [3,2],
	attr: {
		hardnesss: 10,
		durability: 10
	}
});
TEMPLATES[14.2] = new Tool({
	id: 14.2,
	name: "石斧",
	view: [4,2],
	attr: {
		hardnesss: 10,
		durability: 10
	}
});
TEMPLATES[15.2] = new Tool({
	id: 15.2,
	name: "石铲",
	view: [5,2],
	attr: {
		hardnesss: 10,
		durability: 10
	}
});
