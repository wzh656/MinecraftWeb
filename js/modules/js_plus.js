/**
 * String.padStart()
 * version 1.0.1
 */
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

// 小数点前后补位
Number.prototype.padding = function(start, end){
	var part = String(this).split(".");
	var symbol = "";
	if (isNaN( Number(part[0].charAt(0)) )){
		symbol = part[0].charAt(0);
		part[0] = part[0].slice(1);
	}
	while (part[0].length+symbol.length < start)
		part[0] = "0"+part[0];
	part[1] = part[1] || "";
	while (part[1].length < end)
		part[1] += "0";
	return symbol + part[0] + (part[1] ?"." + part[1] :"");
}

// 保留小数位数
{
	const round = Math.round;
	Math.round = function (n=0, s){
		if (s !== undefined) return round(n*10**s)/10**s;
		return round(n);
	};
	
	const random = Math.random;
	Math.random = function (max=1, min, s){
		if (min !== undefined){
			if (s !== undefined) return Math.round( random()*(max-min)+min, s );
			return random()*(max-min)+min;
		};
		return random()*max;
	}
}


//Map遍历Object
Object.map = function(object, f=v=>v){
	const obj = {};
	for (const [i,v] of Object.entries(object))
		obj[i] = f(v, i, object);
	return obj;
}

//some遍历Object
Object.some = function(object, f=v=>v){
	const obj = {};
	for (const [i,v] of Object.entries(object))
		if ( f(v, i, object) )
			return true;
	return false;
}

//every遍历Object
Object.every = function(object, f=v=>v){
	const obj = {};
	for (const [i,v] of Object.entries(object))
		if ( !f(v, i, object) )
			return false;
	return true;
}


//格式化日期
Date.prototype.format = function(fmt){
	const o = {	 
		"M+": this.getMonth()+1,					//月份
		"d+": this.getDate(),						//日
		"h+": this.getHours(),						//小时
		"m+": this.getMinutes(),					//分
		"s+": this.getSeconds(),					//秒
		"q+": Math.floor((this.getMonth()+3)/3),	//季度
		"S": this.getMilliseconds()					//毫秒
	};	 
	if ( /(y+)/.test(fmt) )	 
		fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));	 
	for (const k in o)	 
		if ( new RegExp("("+ k +")").test(fmt) )
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));	 
	return fmt;	 
}

//随机字符串
String.random = function(len, obj=[]){
	let str = "";
	if ( !(obj instanceof Array) )
		obj = Object.keys(obj)
	
	if (len === undefined){
		while ( obj.some(v => v == str) ) //重复
			str = Math.random().toString(36).substr(2);
		return str;
		
	}else{
		while ( obj.some(v => v == str)) { //重复
			while (str.length < len)
				str += Math.random().toString(36).substr(2);
			str = str.slice(0, len)
		}
		return str
	}
	
}

location.getQueryString = function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return decodeURIComponent(r[2]); return null;
}
