function changeDecimalBuZero(number, bitNum) {
	var f_x = parseFloat(number);
	if (isNaN(f_x)) {
		return 0;
	}
	var s_x = number.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + bitNum) {
		s_x += '0';
	}
	return s_x;
}