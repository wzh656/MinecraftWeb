//数据库
let openDBListener = null; //数据库加载完毕监听
const db = new IndexDB("Minecraft", 3, {
		updateCallback(){
			db.createTable(DB.TABLE.WORLD, {
				keyPath: "key", //主键
				autoIncrement: true //自增
			}, [
				{name:"type", attr:"type", unique:false}
			]);
		},
		successCallback(){
			if (openDBListener)
				openDBListener();
		}
	}).setErrCallback(function(err){
		console.error("DB运行出错", err);
		//alert("DB存档数据库 读取/写入 错误");
	});

const DB = {
	TYPE: {
		deskgood: 0,
		Block: 1,
		EntityBlock: 2,
		Entity: 2
	},
	TABLE: {
		WORLD: "world"
	},
	
	/* 读取存档 */
	read(){
		if (!db.db) //未加载完毕
			return (openDBListener = DB.read);
		
		db.readStep(DB.TABLE.WORLD, {
			index: "type",
			range: ["only", DB.TYPE.deskgood],
			dirt: "prev",
			stepCallback(res){
				console.log("存档read成功", res)
				
				deskgood.pos.x = res.pos.x,
				deskgood.pos.y = res.pos.y,
				deskgood.pos.z = res.pos.z; //位置
				
				deskgood.v.x = res.v.x,
				deskgood.v.y = res.v.y,
				deskgood.v.z = res.v.z; //速度
				
				deskgood.look.x = res.look.x,
				deskgood.look.y = res.look.y; //朝向
				//deskgood.look_update();
				
				time.game = res.time;
				colosUpdate(time.getTime(), true); //更新环境色
				
				for (const t of ["hold", "head", "body", "leg", "foot"]){
					for (const [i, v] of Object.entries(res[t])){
						if (v){ //{name, attr}
							deskgood[t][i] = new (eval(v.type))({
								name: v.name,
								attr: JSON.parse("{"+v.attr+"}")
							});
						}else{ //null
							deskgood[t][i] = null;
						}
					}
					deskgood[t].update(); //更新
				}
				deskgood.choice = res.choice; //选择方块
				deskgood.sensitivity = res.sensitivity; //灵敏度
				time.setTime(res.time); //设置时间
				try_start_load(); //加载区块
				
				return false; //停止查找
			}
		}).then(try_start_load); //没有数据也开始加载
	},
	
	/* 保存存档 */
	save(){
		const data = {
			type: DB.TYPE.deskgood,
			pos: deskgood.pos.clone(), //位置
			v: deskgood.v.clone(), //速度
			look: { //朝向
				x: deskgood.look.x,
				y: deskgood.look.y
			},
			hold: [], //手
			head: [], //头
			body: [], //身
			leg: [], //腿
			foot: [], //脚
			choice: deskgood.choice, //选择物品
			sensitivity: deskgood.sensitivity, //灵敏度
			time: time.getTime() //当前时间
		};
		
		for (const t of ["hold", "head", "body", "leg", "foot"])
			for (let i=0,v=deskgood[t][i],len=deskgood[t].length; i<len; v=deskgood[t][++i])
				if (v){ //{name, attr}
					data[t][i] = {
						type: v.type, //物品类型
						name: v.name,
						attr: JSON.stringify(v.attr).slice(1,-1)
					}
				}else{
					data[t][i] = null;
				}
		
		db.addData(DB.TABLE.WORLD, data).then(()=>{
			console.log("存档save成功"/*, data*/);
			
			let find = false;
			db.readStep(DB.TABLE.WORLD, {
				index: "type",
				range: ["only", DB.TYPE.deskgood],
				dirt: "prev",
				stepCallback: function(res){
					if (find){
						// console.log("DB 删除多余", res.key, res);
						db.remove(DB.TABLE.WORLD, res.key);
					}else{
						find = true;
					}
				}
			});
		});
	},
	
	/* 添加方块 */
	addBlock(x, y, z, name, attr={}){
		console.log("DB.addBlock", {x,y,z, name, attr})
		return new Promise((resolve, reject)=>{
			db.addData(DB.TABLE.WORLD, {
				type: DB.TYPE.Block,
				x,
				y,
				z,
				name,
				attr: JSON.stringify(attr).slice(1, -1)
			}).then(()=>{
				let find = false;
				return db.readStep(DB.TABLE.WORLD, {
					index: "type",
					range: ["only", DB.TYPE.Block],
					dirt: "prev",
					stepCallback: function(res){
						if (res.x!=x || res.y!=y || res.z!=z) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(DB.TABLE.WORLD, res.key);
						}else{
							find = true; //刚才添加的
						}
					}
				});
			}).then(resolve);
		});
	},
	
	/* 添加实体 */
	addEntity(id, x, y, z, name, attr={}){
		console.log("DB.addEntity", {x,y,z, id, name, attr})
		return new Promise((resolve, reject)=>{
			db.addData(DB.TABLE.WORLD, {
				type: DB.TYPE.EntityBlock,
				id,
				x,
				y,
				z,
				name,
				attr: JSON.stringify(attr).slice(1, -1)
			}).then(()=>{
				let find = false;
				return db.readStep(DB.TABLE.WORLD, {
					index: "type",
					range: ["only", DB.TYPE.EntityBlock],
					dirt: "prev",
					stepCallback: function(res){
						if (res.id != id) return;
						if (find){
							// console.log("DB 删除多余", res.key, res);
							db.remove(DB.TABLE.WORLD, res.key);
						}else{
							find = true; //刚才添加的
						}
					}
				});
			}).then(resolve);
		});
	},
	
	/* 删除数据 */
	deleteEntity(id){
		console.log("DB.deleteEntity", {id})
		return new Promise((resolve, reject)=>{
			db.readStep(DB.TABLE.WORLD, {
				index: "type",
				range: ["only", DB.TYPE.EntityBlock],
				dirt: "prev",
				stepCallback: function(res){
					if (res.id == id){
						// console.log("DB 删除多余", res.key, res);
						db.remove(DB.TABLE.WORLD, res.key);
					}
				}
			}).then(resolve);
		});
	},
	
	/* 读取区块信息 */
	readChunk(x, z){
		return new Promise((resolve, reject)=>{
			const [ox, oz] = map.c2o(x, z), //区块中心坐标
				edit = {
					block: [],
					entity: [],
				};
			db.readStep(DB.TABLE.WORLD, {
				index: "type",
				range: ["only", DB.TYPE.Block],
				stepCallback: (res)=>{
					if ( res.x >= ox+map.size[0].x && res.x <= ox+map.size[1].x &&
						res.z >= oz+map.size[0].z && res.z <= oz+map.size[1].z
					) edit.block.push(res);
				}
			}).then(()=>{
				return db.readStep(DB.TABLE.WORLD, {
					index: "type",
					range: ["only", DB.TYPE.EntityBlock],
					stepCallback: (res)=>{
						if ( res.x >= ox+map.size[0].x && res.x <= ox+map.size[1].x &&
							res.z >= oz+map.size[0].z && res.z <= oz+map.size[1].z
						) edit.entity.push(res);
					}
				})
			}).then(()=>resolve(edit));
		});
	}
};




setInterval(DB.save, 10*1000); // 10s/time
document.addEventListener("background", DB.save, false); //plus切换到后台时自动保存