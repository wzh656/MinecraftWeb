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
Number.prototype.padding = function(padEnd, padAll){
	var f_x = parseFloat(this);
	if (isNaN(f_x)) {
		return 0;
	}
	var s_x = this.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + padEnd){
		s_x += '0';
	}
	return s_x.padStart(padAll, "0");
}

// 保留小数位数
{
	const round = Math.round;
	Math.round = function (n, s){
		if (s) return round(n*10**s)/10**s;
		return round(n);
	};
}