function state(id, pointerLock){
	if ($("#"+id).css("display") != "none"){ //已显示
		$("#"+id).css("display", "none");
		stop = false;
		document.body.requestPointerLock();
		console.log(id, ":close");
	}else{ //未显示
		$("#"+id).css("display", $("#"+id).attr("data-display") || "block");
		stop = id;
		document.exitPointerLock();
		console.log(id, ":open");
	}
	return;
}