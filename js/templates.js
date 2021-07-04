// Block
Thing.TEMPLATES["空气"] = new Block({
	name: "空气"
});
Thing.TEMPLATES["命令方块"] = new Block({
	name: "命令方块",
	view: [1,0],
	block: {
		hardnesss: 3,
		face: [
			[1,0], [1,0], [0,0], [2,0], [1,0], [1,0]
		]
	},
	attr: {
		block: {
			onRightMouseDown: "status('command');false;",
			onShortTouch: "status('command');false;"
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["草方块"] = new Block({
	name: "草方块",
	view: [4,0],
	block: {
		hardnesss: 3,
		face: [
			[4,0], [4,0], [3,0], [5,0], [4,0], [4,0]
		]
	},
	attr: {
		block: {
			digGet: "松泥土",
			idealDigSpeed: {
				"手": 400,
				
				"木镐": 200,
				"木斧": 500,
				"木铲": 1000,
				"木锄": 200,
				"木剑": 200,
				"碎木": 200,
				
				"石镐": 200,
				"石斧": 500,
				"石铲": 1000,
				"石锄": 200,
				"石剑": 200,
				"碎石": 200
			}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');message('绿色成就','【获得成就】<br/>恭喜获得成就：头上长草绿得快。');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["泥土"] = new Block({
	name: "泥土",
	view: [5,0],
	block: {
		face: [
			[5,0], [5,0], [5,0], [5,0], [5,0], [5,0]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {
				"手": 400,
				
				"木镐": 200,
				"木斧": 500,
				"木铲": 1000,
				"木锄": 200,
				"木剑": 200,
				"碎木": 200,
				
				"石镐": 200,
				"石斧": 500,
				"石铲": 1000,
				"石锄": 200,
				"石剑": 200,
				"碎石": 200
			}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["松泥土"] = new Block({
	name: "松泥土",
	view: [5,0],
	block: {
		face: [
			[5,0], [5,0], [5,0], [5,0], [5,0], [5,0]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {
				"手": 1000,
				
				"木镐": 400,
				"木斧": 1000,
				"木铲": 2000,
				"木锄": 400,
				"木剑": 400,
				"碎木": 200,
				
				"石镐": 400,
				"石斧": 1000,
				"石铲": 2000,
				"石锄": 400,
				"石剑": 400,
				"碎石": 200
			}
		},
		stackable: true, //可叠加
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["石头"] = new Block({
	name: "石头",
	view: [7,0],
	block: {
		face: [
			[7,0], [7,0], [7,0], [7,0], [7,0], [7,0]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {
				"石镐": 2,
				"石斧": 2,
				"石铲": 2,
				"石锄": 1,
				"石剑": 1,
				"碎石": 0.5
			}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});

Thing.TEMPLATES["碎石"] = new Block({
	name: "碎石",
	view: [6,0],
	block: {
		face: [
			[6,0], [6,0], [6,0], [6,0], [6,0], [6,0]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {
				"手": 800,
				
				"木镐": 200,
				"木斧": 500,
				"木铲": 2000,
				"木锄": 1000,
				"木剑": 200,
				
				"石镐": 200,
				"石斧": 500,
				"石铲": 1000,
				"石锄": 200,
				"石剑": 200
			}
		},
		stackable: true, //可叠加
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["沙子"] = new Block({
	name: "沙子",
	view: [0,1],
	block: {
		face: [
			[0,1], [0,1], [0,1], [0,1], [0,1], [0,1]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {
				"手": 1000,
				
				"木镐": 400,
				"木斧": 1000,
				"木铲": 2000,
				"木锄": 400,
				"木剑": 400,
				"碎木": 200,
				
				"石镐": 400,
				"石斧": 1000,
				"石铲": 2000,
				"石锄": 400,
				"石剑": 400,
				"碎石": 200
			}
		},
		stackable: true, //可叠加
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["细橡木"] = new EntityBlock({
	name: "细橡木",
	view: [2,1],
	block: {
		face: [
			[2,1], [2,1], [1,1], [1,1], [2,1], [2,1]
		],
	},
	attr: {
		block: {
			idealDigSpeed: {}
		},
		entityBlock: {
			size: {
				x0: 30, x1: 70,
				y0: 0, y1: 100,
				z0: 30, z1: 70
			}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["疏树叶"] = new Block({
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
			through: true, //可穿过
			idealDigSpeed: 10000000
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["密树叶"] = new Block({
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
			through: true, //可穿过
			idealDigSpeed: 5000000
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["木板"] = new Block({
	name: "木板",
	view: [5,1],
	block: {
		face: [
			[5,1], [5,1], [5,1], [5,1], [5,1], [5,1]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["砖"] = new Block({
	name: "砖",
	view: [6,1],
	block: {
		face: [
			[6,1], [6,1], [6,1], [6,1], [6,1], [6,1]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);false;"
	}
});
Thing.TEMPLATES["仙人掌"] = new Block({
	name: "仙人掌",
	view: [0,2],
	block: {
		face: [
			[0,2], [0,2], [7,1], [1,2], [0,2], [0,2]
		]
	},
	attr: {
		block: {
			idealDigSpeed: {}
		},
		onPutToHead: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);message('放到头上', '你自己要把方块放头上的，别怪我');false;",
		onPutToBody: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);message('放到身上', '你自己要把方块放身上的，别怪我');false;",
		onPutToLeg: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);false;",
		onPutToFoot: "deskgood.place(choice, {x:deskgood.pos.x/100, y:deskgood.pos.y/100-1, z:deskgood.pos.z/100});deskgood.hold.delete(deskgood.choice);deskgood.hold.delete(deskgood.choice);false;"
	}
});

// Tool
Thing.TEMPLATES["木镐"] = new Tool({
	name: "木镐",
	view: [2,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["木剑"] = new Tool({
	name: "木剑",
	view: [3,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["木斧"] = new Tool({
	name: "木斧",
	view: [4,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["木铲"] = new Tool({
	name: "木铲",
	view: [5,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
