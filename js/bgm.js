/* 播放BGM */
function playBGM(){
	const bgm = $("#bgm")[0];
	if ( bgm.paused ){
		if ( Math.random(0, 1, 0) ){
			bgm.volume = 1;
			bgm.src = "./music/1.m4a";
			bgm.play();
			console.info("bgm(BackGround Music)", "begin(1.m4a)", "time:"+new Date());
		}else{
			bgm.volume = 1;
			bgm.src = "./music/2.m4a";
			bgm.play();
			console.info("bgm(BackGround Music)", "begin(2.m4a)", "time:"+new Date());
		}
		setTimeout(function(){
			if (DEBUG && !"背景音乐(bgm)" in gui.__folders){
				const bgm_folder = gui.addFolder("背景音乐(bgm)")
				bgm_folder.add(bgm, "volume", 0, 1, 0.01).name("音量(volume)");
				bgm_folder.add(bgm, "paused").name("是否暂停(paused)").listen();
				bgm_folder.add({f:()=>{
					bgm.pause();
				}}, "f").name("暂停(pause)");
				bgm_folder.add({f:()=>{
					bgm.play();
				}}, "f").name("播放(play)");
				bgm_folder.add(bgm, "currentTime", 0, bgm.duration, 0.001).name("播放进度(current time)").listen();
				bgm_folder.add(bgm, "src").name("音乐路径(src)");
			}
		}, 1000);
		
	}else{
		//console.log("already", bgm.paused);
		bgm.play();
	}
}

document.addEventListener("plusready", playBGM);
document.addEventListener("touchstart", playBGM);