//数据库
let openDBListener = null; //数据库加载完毕监听
const db = new IndexDB("Minecraft", 1, {
		updateCallback: function(){
			db.createTable(TABLE.WORLD, {
				keyPath: "key",
				autoIncrement: true
			}, [
				{name:"type", attr:"type", unique:false}
			]);
		},
		successCallback: function(){
			if (openDBListener)
				openDBListener();
		}
	}),
	TABLE = {
		WORLD: "world"
	};

db.setErrCallback(function(err){
	console.error("DB运行出错", err);
	//alert("DB存档数据库 读取/写入 错误");
});

// 读取存档
function DB_read(){
	if (!db.db) //未加载完毕
		return (openDBListener = DB_read);
	
	db.readStep(TABLE.WORLD, {
		index: "type",
		range: ["only", 1],
		dirt: "prev",
		stepCallback: function(res){
			console.log("存档read成功", res)
			
			deskgood.pos.x = res.pos.x,
			deskgood.pos.y = res.pos.y,
			deskgood.pos.z = res.pos.z;
			
			deskgood.v.x = res.v.x,
			deskgood.v.y = res.v.y,
			deskgood.v.z = res.v.z;
			
			deskgood.look.left_right = res.look.left_right,
			deskgood.look.top_bottom = res.look.top_bottom;
			deskgood.look_update();
			
			for (const [i, v] of Object.entries(res.hold))
				if (v){ //{id, attr}
					deskgood.hold[i] = new Block({
						id: v.id,
						attr: JSON.parse("{"+v.attr+"}")
					});
				}else{ //null
					deskgood.hold[i] = null;
				}
			deskgood.choice = res.choice;
			
			deskgood.sensitivity = res.sensitivity;
			
			time.setTime(res.time);
			
			try_start_load(); //加载区块
			
			return false; //停止查找
		},
		successCallback: try_start_load //没有数据也开始加载
	});
}


// 保存存档
function DB_save(){
	const data = {
		type: 1,
		pos: {
			x: deskgood.pos.x,
			y: deskgood.pos.y,
			z: deskgood.pos.z
		},
		v: {
			x: deskgood.v.x,
			y: deskgood.v.y,
			z: deskgood.v.z
		},
		look: {
			left_right: deskgood.look.left_right,
			top_bottom: deskgood.look.top_bottom
		},
		hold: [],
		choice: deskgood.choice,
		sensitivity: deskgood.sensitivity,
		time: time.getTime()
	};
	for (let i=0,v=deskgood.hold[i]; i<deskgood.hold.length; v=deskgood.hold[++i]){
		if (v){ //{id, attr}
			data.hold[i] = {
				id: v.id,
				attr: JSON.stringify(v.attr).slice(1,-1)
			}
		}else{
			data.hold[i] = null;
		}
	}
	
	db.addData(TABLE.WORLD, data, {
		successCallback: function(){
			console.log("存档save成功"/*, data*/);
			
			let find = false;
			db.readStep(TABLE.WORLD, {
				index: "type",
				range: ["only", 1],
				dirt: "prev",
				stepCallback: function(res){
					if (find){
						// console.log("DB 删除多余", res.key, res);
						db.remove(TABLE.WORLD, res.key);
					}else{
						find = true;
					}
				}
			});
		}
	});
	
}

setInterval(DB_save, 10*1000); // 10s/time
document.addEventListener("background", DB_save, false); //plus切换到后台时自动保存