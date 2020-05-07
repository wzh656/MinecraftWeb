const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

const ipcMain = require('electron').ipcMain;
// 保存窗口对象的全局引用, 如果不这样做, 当JavaScript对象被当做垃圾回收时，window窗口会自动关闭
let win

function createWindow () {
	// 创建浏览器窗口.
	win = new BrowserWindow({
		width: 1000, height: 700, autoHideMenuBar :true
	});
	
	//win.setProgressBar(0.5); //进度条
	
	win.setMenu(null);

	// 加载项目的index.html文件.
	win.loadURL("file://"+__dirname+"/index.html")

	// 打开开发工具
	win.webContents.openDevTools()

	win.on('closed', () => {
		// 取消引用窗口对象, 如果你的应用程序支持多窗口，通常你会储存windows在数组中，这是删除相应元素的时候。
		console.log("closed");
		
		win = null;
	})
}

app.on('activate', () => {
	console.log('activate')
	if (win === null) {
		createWindow()
	}else{
		win.show()
	}
})

// 当Electron完成初始化并准备创建浏览器窗口时，将调用此方法
// 一些api只能在此事件发生后使用。
app.on('ready', createWindow);

// 当所有窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在macOS上，用得多的是应用程序和它们的菜单栏，用Cmd + Q退出。
	if (process.platform !== 'darwin'){
		console.log("window-all-closed");
		app.quit()
	}
})

app.on('activate', () => {
	console.log("activate");
	// 在macOS上，当点击dock图标并且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
	if (win === null) {
		createWindow()
	}
});

/* ipcMain.on('WebToExe', function (event, args){
	console.log(args);
	event.sender.send('ExeToWeb', 'ExeToWeb_message');
}); */