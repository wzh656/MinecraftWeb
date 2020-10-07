/**
* dat.gui
*/
let gui = new dat.GUI({
	name: "控制/调试",
	useLocalStorage: false, // 使用LocalStorage来存储
	closeOnTop: true // 关闭按钮是否在顶部
});
gui.close();
gui.add(window, "TimeSpeed", 1, 3600, 1).name("时间流逝速度").onChange((value) => {
	TimeSpeed = ((value-1)/(3600-1))**6 *(3600-1)+1;
}).listen();
gui.add({f:function(){
	run(prompt("请输入命令：","deskgood.goY(3000*100);"))
}}, "f").name("运行(run)命令");
gui.add(window, "SQL_save").name("保存(save)");
gui.add(location, "reload").name("刷新(reload)");
/* window.addEventListener("beforeunload", function(event){
	event.preventDefault();
	event.returnValue = "未保存！";
	return "未保存！";
}); */