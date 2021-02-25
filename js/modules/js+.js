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

//Map遍历Object
Object.prototype.map = function(f){
	const obj = {};
	for (const [i,v] of Object.entries(this))
		obj[i] = f(v, i, this);
	return obj;
}

//some遍历Object
Object.prototype.some = function(f){
	const obj = {};
	for (const [i,v] of Object.entries(this))
		if ( f(v, i, this) )
			return true;
	return false;
}

//every遍历Object
Object.prototype.every = function(f){
	const obj = {};
	for (const [i,v] of Object.entries(this))
		if ( !f(v, i, this) )
			return false;
	return true;
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