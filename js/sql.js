const SQL = {};
//打开数据库
SQL.openDatabase = function(dbName, version, decision, size){
	SQL.db = openDatabase(dbName, version, decision, size);
};

//设置错误回调
SQL.setErrCallback = function(callback){
	SQL.errCallback = callback;
};
//设置成功回调
SQL.setSuccessCallback = function(callback){
	SQL.successCallback = callback;
};

//创建表
SQL.createTable = function(tName, value, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tName} (${ value.join(",") })`);
	}, errCallback, successCallback);
};
//删除表
SQL.createTable = function(tName, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		tx.executeSql(`DROP TABLE ${tName}`);
	}, errCallback, successCallback);
};

//插入数据
SQL.insertData = function(tName, dataName, data, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		tx.executeSql(`INSERT INTO ${tName} (${ dataName.join(",") }) VALUES (${ data.join(",") })`);
	}, errCallback, successCallback);
};
//读取数据
SQL.selectData = function(tName, dataName=["*"], readCallback, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		tx.executeSql(`SELECT ${ dataName.join(",") } FROM ${tName}`,[],function(tx, data){
			readCallback(data.rows);
		});
	}, errCallback, successCallback);
};
//删除数据
SQL.deleteData = function(tName, where, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		var sql = `DELETE FROM ${tName}`;
		if (where)
			sql += ` WHERE ${where}`;
		tx.executeSql(sql);
	}, errCallback, successCallback);
};
//更新数据
SQL.deleteData = function(tName, set, where, errCallback = SQL.errCallback, successCallback = SQL.successCallback){
	if (!SQL.db)
		console.error("请先打开数据库");
	
	SQL.db.transaction(function (tx){
		set = set.map(function(value){
			return value.join("=");
		}).join(",");
		var sql = `UPDATE ${tName} SET ${set}`;
		if (where)
			sql += ` WHERE ${where}`;
		tx.executeSql(sql);
	}, errCallback, successCallback);
};