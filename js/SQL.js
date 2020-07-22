function SQL(dbName, version, decision, size){
	//打开数据库
	this.db = openDatabase(dbName, version, decision, size);
	
	//设置错误回调
	this.setErrCallback = function(callback){
		this.errCallback = callback;
	};
	//设置成功回调
	this.setSuccessCallback = function(callback){
		this.successCallback = callback;
	};
	
	/* //删除数据库
	this.deleteDatabase = function(dbName, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`DROP DATABASE ${dbName}`);
		}, errCallback, successCallback);
	}; */
												/* 表 */
	//读取所有表
	this.selectTable = function(readCallback, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`SHOW TABLES`,[],function(tx, data){
				readCallback(data.rows);
			});
		}, errCallback, successCallback);
	};
	//创建表
	this.createTable = function(tName, value, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tName} (${ value.join(",") })`);
		}, errCallback, successCallback);
	};
	//删除表
	this.deleteTable = function(tName, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`DROP TABLE ${tName}`);
		}, errCallback, successCallback);
	};
												/* 数据 */
	//插入数据
	this.insertData = function(tName, dataName, data, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`INSERT INTO ${tName} (${ dataName.join(",") }) VALUES (${ data.join(",") })`);
			console.log(`INSERT INTO ${tName} (${ dataName.join(",") }) VALUES (${ data.join(",") })`)
		}, errCallback, successCallback);
	};
	//读取数据
	this.selectData = function(tName, dataName=["*"], readCallback, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			tx.executeSql(`SELECT ${ dataName.join(",") } FROM ${tName}`,[],function(tx, data){
				readCallback(data.rows);
			});
		}, errCallback, successCallback);
	};
	//删除数据
	this.deleteData = function(tName, where, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			var sql = `DELETE FROM ${tName}`;
			if (where)
				sql += ` WHERE ${where}`;
			tx.executeSql(sql);
		}, errCallback, successCallback);
	};
	//更新数据
	this.updateData = function(tName, set, where, errCallback = this.errCallback, successCallback = this.successCallback){
		this.db.transaction(function (tx){
			set = set.map(function(value){
				return value.join("=");
			}).join(",");
			var sql = `UPDATE ${tName} SET ${set}`;
			if (where)
				sql += ` WHERE ${where}`;
			tx.executeSql(sql);
		}, errCallback, successCallback);
	};
}
