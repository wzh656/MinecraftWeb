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


//加载配置templates.jsonp
function templates_jsonp_callback(json){
	//方块
	for (const [name, data] of Object.entries(json.blocks)){
		Thing.TEMPLATES[name] = new Block(data);
	}
	//工具
	for (const [name, data] of Object.entries(json.tools)){
		Thing.TEMPLATES[name] = new Tool(data);
	}
}
