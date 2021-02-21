function try_start_load(){
	console.log("load_condition", try_start_load.prototype.condition+1)
	if (++try_start_load.prototype.condition == 2){
		map.perloadChunk({
			progressCallback: (value)=>{
				$("#progress span").text( Math.round(value*100, 2).padding(2, 2) );
				$("#progress progress").val( value );
				if (ipcRenderer)
					ipcRenderer.send("progressUpdate", Math.min(value, 1));
			},
			finishCallback: ()=>{
				$("#progress span").text("100");
				$("#progress progress").val("1");
				deskgood.update_round_blocks();
				deskgood.update_round_blocks();
				setTimeout(function(){
					render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
					$("#progress").remove();
					if (ipcRenderer)
						ipcRenderer.send("progressUpdate", -1); //关闭进度条
				},0);
			}
		});
	}
};
try_start_load.prototype.condition = 0;