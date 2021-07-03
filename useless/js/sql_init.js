const sql = new SQL("Minecraft", "1.0", "我的世界游戏存档", 10*1024*1024),
	tableName = "world";
sql.setErrCallback(function(err){
	console.error("SQL运行出错", err, err.message);
	//alert("SQL存档数据库 读取/写入 错误");
});
sql.createTable(tableName, [
	"type UNSIGNED TINYINT",
	"x INT",
	"y INT",
	"z INT",
	"id UNSIGNED FLOAT(5,2)",
	"attr TEXT"
]);

/* type
* 0：方块放置/移除：(x,y,z,id,attr)
* 1：坐标：(x,y,z)
* 2：速度：(x,y,z)
* 3：{
*	x=0：物品栏：((row, )id, attr)，
*	x=1：选中物品：(id)
* }
* 4：时间，灵敏度，旋转角&俯仰角：(x, id, attr)
*/

// 读取存档
function SQL_read(){
	//type=1：坐标：(x,y,z)
	sql.selectData(tableName, ["x", "y", "z"], "type=1", function(result){
		console.log("sql read","type=1", result)
		if (result.length){
			const res = result[ result.length-1 ];
			deskgood.pos.x = res.x;
			deskgood.pos.y = res.y;
			deskgood.pos.z = res.z;
		}
		
		//加载区块
		console.log("load_condition(sql)", perload_condition+1)
		if (++perload_condition == 2){
			map.perloadChunk({
				progressCallback: (value)=>{
					$("#progress span").text( Math.round(value*100, 2).changeDecimalBuZero(2, 2) );
					$("#progress progress").val( value );
					if (ipcRenderer)
						ipcRenderer.send('progressUpdate', Math.min(value, 1));
				},
				finishCallback: ()=>{
					$("#progress span").text("100");
					$("#progress progress").val("1");
					deskgood.update_round_blocks();
					deskgood.update_round_blocks();
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
						if (ipcRenderer)
							ipcRenderer.send('progressUpdate', -1); //关闭进度条
					},0);
				}
			});
		}
	});
	
	//type=2：速度：(x,y,z)
	sql.selectData(tableName, ["x", "y", "z"], "type=2", function(result){
		console.log("sql read","type=2", result)
		if (!result.length) return;
		const res = result[ result.length-1 ];
		deskgood.v.x = res.x,
		deskgood.v.y = res.y,
		deskgood.v.z = res.z;
	});
	
	//type=3&x=0：物品栏：((row, )id, attr)
	sql.selectData(tableName, ["id", "attr"], "type=3 AND x=0", function(result){ //物品栏
		console.log("sql read","type=3&x=0", result)
		for (let i=0; i<result.length; i++){
			console.log(i, result[i])
			if (result[i].id == 0){
				deskgood.hold[i] = null;
			}else{
				deskgood.hold[i] = new Block({
					id: result[i].id,
					attr: JSON.parse("{"+result[i].attr+"}")
				});
			}
		}
		deskgood.hold.update();
	});
	//type=3&x=1：选中物品：(id)
	sql.selectData(tableName, ["id"], "type=3 AND x=1", function(result){ //选择物品
		console.log("sql read","type=3&x=1", result)
		if (!result.length) return;
		const res = result[ result.length-1 ];
		deskgood.choice = res.id;
		deskgood.hold.update();
	});
	
	//type=4：时间，灵敏度，旋转角&俯仰角：(x, id, attr)
	sql.selectData(tableName, ["x", "id", "attr"], "type=4", function(result){ //选择物品
		console.log("sql read","type=4", result)
		if (!result.length) return;
		const res = result[ result.length-1 ];
		time.setTime(res.x);
		deskgood.sensitivity = res.id;
		[deskgood.lookAt.left_right, deskgood.lookAt.top_bottom] = res.attr.split(" ").map(Number);
		deskgood.look_update();
	});
}


// 保存存档
function SQL_save(){
	//type=1：坐标：(x,y,z)
	sql.deleteData(tableName, "type=1", undefined, function(){
		sql.insertData(tableName, ["type", "x", "y", "z"], [
			1,
			Math.round(deskgood.pos.x),
			Math.round(deskgood.pos.y),
			Math.round(deskgood.pos.z)
		]);
		console.log("sql save","type=1", {
			type: 1,
			x: Math.round(deskgood.pos.x),
			y: Math.round(deskgood.pos.y),
			z: Math.round(deskgood.pos.z)
		});
	});
	
	//type=2：速度：(x,y,z)
	sql.deleteData(tableName, "type=2", undefined, function(){
		sql.insertData(tableName, ["type", "x", "y", "z"], [
			2,
			Math.round(deskgood.v.x),
			Math.round(deskgood.v.y),
			Math.round(deskgood.v.z)
		]);
		console.log("sql save","type=2", {
			type: 2,
			x: Math.round(deskgood.v.x),
			y: Math.round(deskgood.v.y),
			z: Math.round(deskgood.v.z)
		});
	});
	
	/*type=3：{
		x=0：物品栏：((row, )id, attr)，
		x=1：选中物品：(id)
	}*/
	sql.deleteData(tableName, "type=3", undefined, function(){
		for (const i of deskgood.hold){
			console.log(
				(i? JSON.stringify(i.attr).slice(1,-1): "")+
				"\n"+
				(i? `"${JSON.stringify(i.attr).slice(1,-1)}"`: '""')
			)
			sql.insertData(tableName, ["type", "x", "id", "attr"], [
				3,
				0, //x=0：物品栏
				i? i.id: 0,
				i? `"${JSON.stringify(i.attr).slice(1,-1)}"`: '""'
			]);
			console.log("sql save","type=3&x=0", {
				type: 3,
				x: 0, //x=0：物品栏
				id: i? i.id: 0,
				attr: i? `"${JSON.stringify(i.attr).slice(1,-1)}"`: '""'
			});
		}
		
		sql.insertData(tableName, ["type", "x", "id"], [
			3,
			1, //x=1：选择物品
			deskgood.choice
		]);
		console.log("sql save","type=3&x=1", {
			type: 3,
			x: 1, //x=1：选择物品
			id: deskgood.choice
		});
	});
	
	//type=4：时间，灵敏度，旋转角&俯仰角：(x, id, attr)
	sql.deleteData(tableName, "type=4", undefined, function(){
		sql.insertData(tableName, ["type", "x", "id", "attr"], [
			4,
			+time.getTime(),
			deskgood.sensitivity,
			`"${deskgood.lookAt.left_right} ${deskgood.lookAt.top_bottom}"`
		]);
		console.log("sql save","type=4", {
			type: 4,
			x: +time.getTime(),
			id: deskgood.sensitivity,
			attr: `"${deskgood.lookAt.left_right} ${deskgood.lookAt.top_bottom}"`
		});
	});
	
	console.log("存档+1中……");
}

setInterval(SQL_save, 10*1000); // 10s/time
document.addEventListener("background", SQL_save, false); //plus切换到后台时自动保存