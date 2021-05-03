/* 鼠标锁定操作 */
const PointerLock = {
	//请求指针锁定
	lock(){
		return (document.body.requestPointerLock ||
			document.body.mozRequestPointerLock ||
			document.body.webkitRequestPointerLock)();
	},
	
	//解除鼠标锁定
	unlock(){
		return (document.exitPointerLock ||
			document.mozExitPointerLock ||
			document.webkitExitPointerLock)();
	},
	
	//是否锁定
	isLocked(){
		return document.pointerLockElement === document.body ||
			document.mozPointerLockElement === document.body ||
			document.webkitPointerLockElement === document.body;
	},
	
	//添加锁定改变事件
	onChange(func){
		document.addEventListener("pointerlockchange", func, false);
		document.addEventListener("mozpointerlockchange", func, false);
		document.addEventListener("webkitpointerlockchange", func, false);
	},
	
	//添加锁定错误事件
	onError(func){
		document.addEventListener("pointerlockerror", func, false);
		document.addEventListener("mozpointerlockerror", func, false);
		document.addEventListener("webkitpointerlockerror", func, false);
	}
};