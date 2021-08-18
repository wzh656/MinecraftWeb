const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const child_process = require("child_process");
// const path = require('path');
// const url = require('url');

// 保存窗口对象的全局引用, 如果不这样做, 当JavaScript对象被当做垃圾回收时，window窗口会自动关闭
let win;

function createWindow(){ //创建了一个新的窗口
	child_process.exec("创建桌面快捷方式.vbs");

	win = new BrowserWindow({
		minWidth: 300,
		minHeight: 300,
		fullscreenable: true,
		webPreferences: {
			nodeIntegration: true
		},
		autoHideMenuBar: true //隐藏菜单
	});
	win.setMenu(null); //清除菜单
	win.maximize(); //默认最大化
	let fullscreen = false; //默认不全屏

	win.loadFile('home.html'); // 加载项目的home.html文件.

	win.webContents.openDevTools(); // 打开开发工具

	win.on('closed', () => {
		// 取消引用窗口对象, 如果你的应用程序支持多窗口，通常你会储存windows在数组中，这是删除相应元素的时候。
		console.log('closed');
		
		win = null;
	});

	//注册F11
	globalShortcut.register('F11', function () {
		if (fullscreen){
			win.setFullScreen(false); //退出全屏
			fullscreen = false;
		}else{
			win.setFullScreen(true); //进入全屏
			fullscreen = true;
		}
	});
}

app.on('activate', () => {
	console.log('activate');
	if (win === null) {
		createWindow();
	}else{
		win.show();
	}
})

app.on('activate', () => {
	console.log('activate');
	// 在macOS上，当点击dock图标并且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
	if (win === null) {
		createWindow();
	}
});

// 当Electron完成初始化并准备创建浏览器窗口时，将调用此方法
// 一些api只能在此事件发生后使用。
app.on('ready', createWindow);

// 当所有窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在macOS上，用得多的是应用程序和它们的菜单栏，用Cmd + Q退出。
	if (process.platform !== 'darwin'){
		console.log("window-all-closed");
		app.quit();
	}
})

ipcMain.on('progressUpdate', (event, arg)=>{
	console.log('progressUpdate', arg);
	win.setProgressBar(arg); //进度条
});

/*const fs = require("fs");
const http = require('http');
const querystring = require('querystring');
const request = require('request');
let cookie = 'Hm_lvt_6bb63e416c91510a666853fe6e7935df=1594616784; Hm_lpvt_6bb63e416c91510a666853fe6e7935df=1594616784; csrf=DrDKrFwfhXfE2XtYjjsknyTChWQer53Z; ktag=bda725d7a90ceaff3d75e79ec03c7dea; UM_distinctid=173469163856aa-08c193fbbf208c-3e3e5f0e-13c680-173469163868e3; _ga=GA1.2.77413595.1594616800; _gid=GA1.2.113233672.1594616800; fingerprint=1fd76ab9e60024de; uzone=CN-HN; ulocale=zh-CN; io=159SxuACLgiwKnxpAAMT; wps_sid=V02SisXoeInRNHfq6K74x8arCoxWoKs00aaef8c70011f2a277; wps_sid_xiu=V02SisXoeInRNHfq6K74x8arCoxWoKs00aaef8c70011f2a277; kso.sid=s%3Aaaa0.6483403717893501.b4SrJNxfNylRSH9DbePlVDzyzQJJbiGD9minbDr4K9A; CNZZDATA1256693129=1999056031-1594614067-https%253A%252F%252Fwww.baidu.com%252F%7C1594619467; _gat=1';

function submit(id, data, success, error){
	request({
		url: `http://api.s.wps.cn/api/form/${id}/mainPreviewa`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			// 'Cookie': 'UM_distinctid=17161c9f8041d6-001b803bb34a38-5a4c2571-13c680-17161c9f80550e; CNZZDATA1256693129=276174020-1586483203-null%7C1586483203; _ga=GA1.2.1332515440.1586483559; _gid=GA1.2.1659547471.1586483559; fingerprint=28df19f62bd18eff; wps_sid_xiu=V02SNbOcUDFHTdtHn6QHr1i9npmgGr800aa407af0011f2a277; io=ozOwBf3PIQwQ-q9kAAvq; kso.sid=s%3Aaaa0.7647665795058898.Wje4K2Z%2BNV3yHOJj0Oi%2BcUVkTrtoTzxgifbRhEBNdys; ktag=f30787c6d31f4802ea58ba31201c3082; wps_sid_xiu=V02SNbOcUDFHTdtHn6QHr1i9npmgGr800aa407af0011f2a277' // 指定 Cookie
		},
		'body': JSON.stringify(data)
	}, function (error, response, body) {
		if (!error && response.statusCode == 200){
			try{
				JSON.parse(body).result
			}catch(err){
				error( body );
			}
			if (JSON.parse(body).result == "ok"){
				success( JSON.parse(body) );
			}else{
				error( JSON.parse(body) );
			}
		}else{
			error( [response.statusCode, error] );
		}
	});
}

function get(id, cookie, success, error){
	request({
		url: 'http://s.wps.cn/api/index/getFormData',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Cookie': cookie // 指定 Cookie
		},
		'body': JSON.stringify({
			fid: id,
			from: '301113975'
		})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200){
			try{
				JSON.parse(body).data.cnt.files;
			}catch(err){
				error( body );
			}
			success( JSON.parse(body).data.cnt.files );
		}else{
			error( [response.statusCode, error] );
		}
	});
}

function clean(id, cookie, success, error){
	request({
		url: 'http://s.wps.cn/api/index/getFormData',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Cookie': cookie // 指定 Cookie
		},
		'body': JSON.stringify({
			fid: id,
			from: '301113975'
		})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200){
			success( JSON.parse(body) );
		}else{
			error( [response.statusCode, error] );
		}
	});
}

function getCookie(success, error){
	request({
		url: 'https://wzh656.github.io/notice/Talking_cookie.txt',
		method: 'GET'
	}, function (err, response, body) {
		if (!err && response.statusCode == 200){
			success( body );
		}else{
			error( [response.statusCode, err] );
		}
	});
}

getCookie(function(data){
	console.log(data);
	cookie = data;
	submit('f39d2d9d', {
		device: "PC(electron)"
	}, function(data){
		console.log(data);
	},function(err){
		console.log("err2:", err);
	})
},function(err){
	console.log("err:", err);
});*/