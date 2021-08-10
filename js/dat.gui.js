/**
* dat.gui
*/
let gui;
if (DEBUG){
	gui = new dat.GUI({
		name: "控制/调试",
		useLocalStorage: false, // 使用LocalStorage来存储
		closeOnTop: true // 关闭按钮是否在顶部
	});
	gui.close();
	/*gui.add(window, "TimeSpeed", 1, 3600, 1).name("时间流逝速度").onChange((value) => {
		TimeSpeed = ((value-1)/(3600-1))**6 *(3600-1)+1;
	}).listen();*/
	gui.add({f:function(){
		run(prompt("请输入命令：","deskgood.goY(3000*100);"))
	}}, "f").name("运行(run)命令");
	gui.add(DB, "save").name("保存(save)");
	gui.add(location, "reload").name("刷新(reload)");
	/* window.addEventListener("beforeunload", function(event){
		event.preventDefault();
		event.returnValue = "未保存！";
		return "未保存！";
	}); */
	
	//时光流速
	const time_folder = gui.addFolder("时光(Time)");
		const time_now_folder = time_folder.addFolder("当前时间(time)");
			time_now_folder.open();
			time_now_folder.add({
				get t(){ return +time.getTime(); }
			}, "t").name("时间戳/ms(time)").listen();
			/*time_now_folder.add({
				get t(){ return time.getTime().getYear()+1900; }
			}, "t", 2000, 10000, 1).name("年").listen();
			time_now_folder.add({
				get t(){ return time.getTime().getMonth()+1; }
			}, "t", 1, 12, 1).name("月").listen();
			time_now_folder.add({
				get t(){ return time.getTime().getDate(); }
			}, "t", 1, 31, 1).name("日").listen();
			time_now_folder.add({
				get t(){ return time.getTime().getHours(); }
			}, "t", 0, 23, 1).name("小时").listen();
			time_now_folder.add({
				get t(){ return time.getTime().getMinutes(); }
			}, "t", 0, 59, 1).name("分").listen();
			time_now_folder.add({
				get t(){ return time.getTime().getSeconds(); }
			}, "t", 0, 59, 1).name("秒").listen();*/
			time_now_folder.add({
				get t(){ return String(time.getTime()); }
			}, "t").name("描述字符串").listen();
		time_folder.add({
			get t(){ return time.speed; },
			set t(v){ time.changeSpeed(v); }
		}, "t", 1, 3600).name("时间流速(speed)").onChange(v => time.setSpeed(((v-1)/3599)**6*3599+1)).listen();
		time_folder.add({
			get t(){ return time.stop; }
		}, "t").name("是否暂停(stop)").listen();
		time_folder.add({
			f(){ time.stopTime(); }
		}, "f").name("暂停/继续时间");
	
	//设置
	const settings_folder = gui.addFolder("设置(settings)");
		settings_folder.add(SETTINGS, "VR");
		settings_folder.add(SETTINGS, "sensitivity", 0.1, 10, 0.1);
}