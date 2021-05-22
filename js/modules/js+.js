(function(){
	/* String */
	//String.prototype.padStart 前补位
	if (!String.prototype.padStart){
		String.prototype.padStart = function(targetLength, padString){
			targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
			padString = String(typeof padString !== "undefined" ? padString : " ");
			if (this.length > targetLength) {
				return String(this);
			}else{
				targetLength = targetLength - this.length;
				if (targetLength > padString.length){
					padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
				}
				return padString.slice(0, targetLength) + String(this);
			}
		};
	};
	
	//String.random 随机字符串
	String.random = function(len, obj=[]){
		let str = "";
		if ( !(obj instanceof Array) )
			obj = Object.keys(obj)
		
		if (len === undefined){
			while ( obj.some(v => v == str) ) //重复
				str = Math.random().toString(36).substr(2);
		}else{
			while ( obj.some(v => v == str)) { //重复
				while (str.length < len)
					str += Math.random().toString(36).substr(2);
				str = str.slice(0, len)
			}
		}
		return str;
	};
	
	
	/* Number */
	//Number.prototype.padding 小数点前后补位
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
	};
	
	
	/* Math */
	//Math.round 保留小数位数
	const round = Math.round;
	Math.round = function(n=0, s){
		if (s !== undefined) //有范围
			return round(n * 10**s) / 10**s;
		return round(n);
	};
	
	//Math.random 随机数范围
	const random = Math.random;
	Math.random = function(start=1, end, step){
		if (end !== undefined){ //有end 双参数
			if (step !== undefined) //有范围 三参数
				return Math.round( random()*(end-start)+start, step );
			return random() * (end - start) + start;
		};
		//start => end 单参数
		return random() * start;
	};
	
	//Math.range 限制范围（超出直接返回）
	Math.range = function(num, min, max, step){
		if (num <= min) return min;
		if (num >= max) return max;
		return Math.round(num, step);
	};
	
	//Math.modRange 限制范围（超出求余）
	Math.modRange = function(num, min, max){
		// 范围： [min ,max)
		const range = max - min;
		if (num > max) return (num - min) % range + min;
		if (num < min) return max - ( (max - num) % range || max); //保证不取max
		return num;
	}
	
	
	/* Object */
	//Object.map map遍历Object
	Object.map = function(object, f=v=>v){
		const obj = {};
		for (const [i,v] of Object.entries(object))
			obj[i] = f(v, i, object);
		return obj;
	};
	
	//Object.some some遍历Object
	Object.some = function(object, f=v=>v){
		const obj = {};
		for (const [i,v] of Object.entries(object))
			if ( f(v, i, object) )
				return true;
		return false;
	};
	
	//Object.every every遍历Object
	Object.every = function(object, f=v=>v){
		const obj = {};
		for (const [i,v] of Object.entries(object))
			if ( !f(v, i, object) )
				return false;
		return true;
	};
	
	
	/* Array */
	// Array.range 生成范围数组[start, end)
	Array.range = function(start, end, step=1){
		if (end === undefined) //单参数
			[start, end] = [0, start];
		
		return Array.from({
			length: Math.ceil( (end - start) / step )
		}, (_, i) => start + i * step);
	};
	
	// Array.random 生成随机数组
	Array.random = function(length, start, end, step){
		return Array.from({
			length
		}, () => Math.random(start, end, step));
	};
	
	
	/* Date */
	//Date.prototype.format 格式化日期
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
	};
	
	
	/* location */
	//location.getQueryString 获取url queryString
	location.getQueryString = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null) return decodeURIComponent(r[2]); return null;
	};
})();