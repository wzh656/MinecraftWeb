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
			[1,0], [1,0], [0,0], [2,0], [1,0], [1,0]
		]
	},
	attr: {
		block: {
			onRightMouseDown: "state('command');false;",
			onShortTouch: "state('command');false;"
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
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
			[4,0], [4,0], [3,0], [5,0], [4,0], [4,0]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');message('绿色成就','【获得成就】<br/>恭喜获得成就：头上长草绿得快。');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
}, false));
TEMPLATES.push(new Block({
	id: 3,
	name: "泥土",
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
}, false));
TEMPLATES.push(new Block({
	id: 4,
	name: "原石",
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
}, false));
TEMPLATES.push(new Block({
	id: 5,
	name: "石头",
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
}, false));
TEMPLATES.push(new Block({
	id: 6,
	name: "沙子",
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
}, false));
TEMPLATES[7.1] = new Block({
	id: 7.1,
	name: "细橡木",
	block: {
		parent: "./img/blocks/8/",
		face: [
			[2,1], [2,1], [1,1], [1,1], [2,1], [2,1]
		], geometry: new THREE.BoxBufferGeometry(40, 100, 40)
	},
	attr: {
		block: {
			transparent: true, //部分透明方块（不让相邻方块透明）
			noTransparent: true //不让本方块透明
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
});
TEMPLATES[8] = new Block({
	id: 8,
	name: "树叶",
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
TEMPLATES.push(new Block({
	id: 9,
	name: "木板",
	block: {
		face: [
			[4,1], [4,1], [4,1], [4,1], [4,1], [4,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);false;"
	}
}, false));
TEMPLATES.push(new Block({
	id: 10,
	name: "砖",
	block: {
		face: [
			[5,1], [5,1], [5,1], [5,1], [5,1], [5,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;"
	}
}, false));
TEMPLATES.push(new Block({
	id: 11,
	name: "仙人掌",
	block: {
		face: [
			[7,1], [7,1], [6,1], [0,2], [7,1], [7,1]
		]
	},
	attr: {
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(1, deskgood.choice);deskgood.hold.delete(1, deskgood.choice);false;"
	}
}, false));