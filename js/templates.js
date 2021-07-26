// Block
Thing.TEMPLATES_EVENT.onPutToHead = Thing.TEMPLATES_EVENT.onPutToBody = function(){
	const {x,y,z} = deskgood.pos.clone().divideScalar(100).round();
	if (map.get(x, y, z) === null){
		deskgood.place(choice, {x, y, z});
		deskgood.hold.delete(deskgood.choice);
	}
	false;
}.compress();

Thing.TEMPLATES_EVENT.onPutToLeg = Thing.TEMPLATES_EVENT.onPutToFoot = function(){
	const {x,y,z} = deskgood.pos.clone().divideScalar(100).round();
	if (map.get(x, y-1, z) === null){
		deskgood.place(choice, {x, y:y-1, z});
		deskgood.hold.delete(deskgood.choice);
	}
	false;
}.compress();


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
		directGet: true, //直接获取
		idealDigSpeed: 0.5e6, //2s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
		
		onRightMouseDown: function(){
			state("command");
			false;
		}.compress(), //打开界面
		
		onShortTouch: function(){
			state("command");
			false;
		}.compress() //打开界面
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
		},
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
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
		},
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["松泥土"] = new Block({
	name: "松泥土",
	view: [6,0],
	block: {
		face: [
			[6,0], [6,0], [6,0], [6,0], [6,0], [6,0]
		]
	},
	attr: {
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
		},
		
		stackable: true, //可叠加
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["石头"] = new Block({
	name: "石头",
	view: [0,1],
	block: {
		face: [
			[0,1], [0,1], [0,1], [0,1], [0,1], [0,1]
		]
	},
	attr: {
		digGet: "碎石",
		idealDigSpeed: {
			"石镐": 2,
			"石斧": 2,
			"石铲": 2,
			"石锄": 1,
			"石剑": 1,
			"碎石": 0.5
		},
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});

Thing.TEMPLATES["碎石"] = new Block({
	name: "碎石",
	view: [7,0],
	block: {
		face: [
			[7,0], [7,0], [7,0], [7,0], [7,0], [7,0]
		]
	},
	attr: {
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
		},
		
		stackable: true, //可叠加
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["沙子"] = new Block({
	name: "沙子",
	view: [1,1],
	block: {
		face: [
			[1,1], [1,1], [1,1], [1,1], [1,1], [1,1]
		]
	},
	attr: {
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
		},
		
		stackable: true, //可叠加
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["细橡木"] = new EntityBlock({
	name: "细橡木",
	view: [3,1],
	block: {
		face: [
			[3,1], [3,1], [2,1], [2,1], [3,1], [3,1]
		],
	},
	attr: {
		idealDigSpeed: {},
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["疏树叶"] = new Block({
	name: "疏树叶",
	view: [4,1],
	block: {
		face: [
			[4,1], [4,1], [4,1], [4,1], [4,1], [4,1]
		]
	},
	attr: {
		transparent: true, //透明方块
		through: true, //可穿过
		
		directGet: true, //直接获取
		idealDigSpeed: 0.2e6, //5s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["密树叶"] = new Block({
	name: "密树叶",
	view: [5,1],
	block: {
		face: [
			[5,1], [5,1], [5,1], [5,1], [5,1], [5,1]
		]
	},
	attr: {
		transparent: true, //透明方块
		through: true, //可穿过
		
		directGet: true, //直接获取
		idealDigSpeed: 0.1e6, //10s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["木板"] = new Block({
	name: "木板",
	view: [6,1],
	block: {
		face: [
			[6,1], [6,1], [6,1], [6,1], [6,1], [6,1]
		]
	},
	attr: {
		directGet: true, //直接获取
		idealDigSpeed: 0.5e6, //2s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["砖"] = new Block({
	name: "砖",
	view: [7,1],
	block: {
		face: [
			[7,1], [7,1], [7,1], [7,1], [7,1], [7,1]
		]
	},
	attr: {
		directGet: true, //直接获取
		idealDigSpeed: 0.5e6, //2s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});
Thing.TEMPLATES["仙人掌"] = new Block({
	name: "仙人掌",
	view: [1,2],
	block: {
		face: [
			[1,2], [1,2], [0,2], [2,2], [1,2], [1,2]
		]
	},
	attr: {
		directGet: true, //直接获取
		idealDigSpeed: 0.3e6, //3+s/个
		
		onPutToHead: Thing.TEMPLATES_EVENT.onPutToHead,
		onPutToBody: Thing.TEMPLATES_EVENT.onPutToBody,
		onPutToLeg: Thing.TEMPLATES_EVENT.onPutToLeg,
		onPutToFoot: Thing.TEMPLATES_EVENT.onPutToFoot,
	}
});

// Tool
Thing.TEMPLATES["石镐"] = new Tool({
	name: "石镐",
	view: [3,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["石剑"] = new Tool({
	name: "石剑",
	view: [4,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["石斧"] = new Tool({
	name: "石斧",
	view: [5,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
Thing.TEMPLATES["石铲"] = new Tool({
	name: "石铲",
	view: [6,2],
	attr: {
		stackable: 3, //可叠加在手中（最多3把）
		hardnesss: 3,
		durability: 1
	}
});
