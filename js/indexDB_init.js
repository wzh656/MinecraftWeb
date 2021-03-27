//数据库
let openDBListener = null; //数据库加载完毕监听
const db = new IndexDB("Minecraft", 1, {
		updateCallback: function(){
			db.createTable(TABLE.WORLD, {
				keyPath: "key", //主键
				autoIncrement: true //自增
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

const DB = {
	/* 读取存档 */
	read(){
		if (!db.db) //未加载完毕
			return (openDBListener = DB.read);
		
		db.readStep(TABLE.WORLD, {
			index: "type",
			range: ["only", 0],
			dirt: "prev",
			stepCallback: function(res){
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
			},
			successCallback: try_start_load //没有数据也开始加载
		});
	},
	
	/* 保存存档 */
	save(){
		const data = {
			type: 0,
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
	},
	
	/* 读取区块信息 */
	readChunk(x, z, opt={}){
		const {successCallback, errorCallback} = opt;
		const ox = x*map.size.x,
			oz = z*map.size.z; //区块中心坐标
		const edit = [];
		db.readStep(TABLE.WORLD, {
			index: "type",
			range: ["only", 0],
			stepCallback: (res)=>{
				if ( res.x >= ox+map.size[0].x && res.x <= ox+map.size[1].x &&
					res.z >= oz+map.size[0].z && res.z <= oz+map.size[1].z
				) edit.push(res);
			},
			successCallback: ()=> successCallback(edit),
			errorCallback
		});
	}
};




setInterval(DB.save, 10*1000); // 10s/time
document.addEventListener("background", DB.save, false); //plus切换到后台时自动保存