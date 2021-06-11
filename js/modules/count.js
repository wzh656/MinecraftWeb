(function(){
	const name = "我的世界-wzh";
	function request(method, data){
		return new Promise((resolve, reject)=>{
			//console.log(method, data)
			$.ajax({
				url: "https://wzh.glitch.me/count/" + method,
				data,
				type: "GET",
				dataType: "jsonp",
				success: (response, status, xhr)=>{
					//console.log("count/"+method, data, response)
					resolve(response);
				},
				error: (response, status, xhr)=>{
					// alert(`请求错误！\nstatus: ${status}\nresponse: ${response}`);
					reject(response, status, xhr);
				}
			});
		});
	}
	const url = location.href,
		intoTime = +new Date(),
		referer = document.referrer,
		ua = navigator.userAgent,
		platform = navigator.platform,
		language = navigator.language;
	request("into", {
		name,
		url,
		intoTime,
		referer,
		ua,
		platform,
		language
	}).then(()=>{
		setInterval(()=>{
			request("continue", {
				name,
				url,
				intoTime,
				leaveTime: +new Date(),
				referer,
				ua,
				platform,
				language
			});
		}, 1000);
	});
})();
