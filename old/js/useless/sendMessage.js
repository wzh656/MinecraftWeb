document.addEventListener("plusready", function(){
	plus.device.setWakelock(true); //屏幕常亮
	
	if (sessionStorage.getItem("already_send") == "true")
		return; //不再发送
	
	let types = {}; 
		types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection";
		types[plus.networkinfo.CONNECTION_NONE] = "None connection";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection";
		types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection";
		types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection";
		types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection";
	let data = {
		"device_imei(设备的国际移动设备身份码)": plus.device.imei,
		"device_imsi(设备的国际移动用户识别码)": JSON.stringify(plus.device.imsi),
		"device_model(设备的型号)": plus.device.model,
		"device_vendor(设备的生产厂商)": plus.device.vendor,
		"device_uuid(设备的唯一标识)": plus.device.uuid,
		"screen_currentSize(屏幕信息)": JSON.stringify(plus.screen.getCurrentSize()),
		"networkInfo_currentType(网络信息)": types[plus.networkinfo.getCurrentType()],
		"os_language(系统语言信息)": plus.os.language,
		"os_name(系统的名称)": plus.os.name,
		"os_vendor(系统的供应商信息)": plus.os.vendor,
		"os_version(系统版本信息)": plus.os.version
	};
	console.log($.post("http://api.s.wps.cn/api/form/f39d2d9d/mainPreviewa", data)); //发送信息
	console.log(data);
	sessionStorage.setItem("already_send", "true"); //已发送
});