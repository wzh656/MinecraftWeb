// SQL
const sql = new SQL("Minecraft", "1.0", "我的世界游戏存档", 10*1024*1024);
sql.setErrCallback(function(err){
	console.error("SQL运行出错：", err, err.message);
	//alert("SQL存档数据库 读取/写入 错误");
});
sql.createTable("file", [
	"type UNSIGNED TINYINT",
	"x INT",
	"y INT",
	"z INT",
	"id UNSIGNED FLOAT(5,2)",
	"attr TEXT"
]);
function read(){
	sql.selectData("file", ["x", "y", "z", "id", "attr"], "type=1", function(result){
		if (result.length){
			deskgood.pos.x = result[0].x;
			deskgood.pos.y = result[0].y;
			deskgood.pos.z = result[0].z;
			deskgood.sensitivity = result[0].id;
			[deskgood.lookAt.left_right, deskgood.lookAt.top_bottom] = result[0].attr.split(" ").map(Number);
			deskgood.look_refresh();
			if (++perload_condition >= 2){
				map.perloadZone();
			}
			console.log(perload_condition)
		}
	});
	sql.selectData("file", ["x", "y", "z"], "type=2", function(result){
		if (result.length){
			deskgood.v.x = result[0].x;
			deskgood.v.y = result[0].y;
			deskgood.v.z = result[0].z;
		}
	});
	sql.selectData("file", ["id", "attr"], "type=3 AND x=0", function(result){ //物品栏
		if (result.length){
			for (let i in deskgood.hold){
				deskgood.hold[i] = result[i].id;
				//...
			}
			deskgood.hold_things_refresh();
		}
	});
	sql.selectData("file", ["id"], "type=3 AND x=1", function(result){ //选择物品
		if (result.length){
			deskgood.choice = result[0].id;
			deskgood.hold_choice_refresh();
		}
	});
}
if (typeof deskgood != "undefined"){
	read();
}else{
	let id = setInterval(function(){
		if (typeof deskgood != "undefined"){
			clearInterval(id);
			read();
		}
	},10);
}

function save(){
	sql.deleteData("file", "type=1", undefined, function(){
		sql.insertData("file", ["type", "x", "y", "z", "id", "attr"], [
			1,
			Math.round(deskgood.pos.x),
			Math.round(deskgood.pos.y),
			Math.round(deskgood.pos.z),
			deskgood.sensitivity,
			`"${deskgood.lookAt.left_right} ${deskgood.lookAt.top_bottom}"`
		]);
	});
	sql.deleteData("file", "type=2", undefined, function(){
		sql.insertData("file", ["type", "x", "y", "z"], [
			2,
			Math.round(deskgood.v.x),
			Math.round(deskgood.v.y),
			Math.round(deskgood.v.z)
		]);
	});
	sql.deleteData("file", "type=3", undefined, function(){
		for (let i of deskgood.hold){
			sql.insertData("file", ["type", "x", "id", "attr"], [
				3,
				0, //物品栏
				i,
				`""` //...
			]);
		}
		sql.insertData("file", ["type", "x", "id"], [
			3,
			1, //选择物品
			deskgood.choice
		]);
	});
	
	console.log("存档+1中……");
	// return;
	/* localStorage.setItem("我的世界.存档.方块", map.save());
	localStorage.setItem("我的世界.存档.玩家.位置", JSON.stringify(deskgood.pos));
	localStorage.setItem("我的世界.存档.玩家.朝向", JSON.stringify(deskgood.lookAt));
	localStorage.setItem("我的世界.存档.玩家.物品.工具栏", JSON.stringify({
		hold: deskgood.hold,
		choice: deskgood.choice
	}));
	console.log("备份成功"); */
}
setInterval(save, 10*1000); // 10s

/* //读取
if (localStorage.getItem("我的世界.存档.玩家.位置")){
	deskgood.pos.x = JSON.parse(localStorage.getItem("我的世界.存档.玩家.位置")).x;
	deskgood.pos.y = JSON.parse(localStorage.getItem("我的世界.存档.玩家.位置")).y;
	deskgood.pos.z = JSON.parse(localStorage.getItem("我的世界.存档.玩家.位置")).z;
}
if (localStorage.getItem("我的世界.存档.玩家.朝向")){
	deskgood.lookAt.left_right = JSON.parse(localStorage.getItem("我的世界.存档.玩家.朝向")).left_right;
	deskgood.lookAt.top_bottom = JSON.parse(localStorage.getItem("我的世界.存档.玩家.朝向")).top_bottom;
}
if (localStorage.getItem("我的世界.存档.玩家.物品.工具栏")){
	deskgood.hold = JSON.parse(localStorage.getItem("我的世界.存档.玩家.物品.工具栏")).hold;
	deskgood.choice = Number(JSON.parse(localStorage.getItem("我的世界.存档.玩家.物品.工具栏")).choice);
} */