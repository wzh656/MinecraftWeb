import sNoise from "./SimplexNoise.js";
self.addEventListener('message', function (e) {
	let {x, z, edit, t} = e.data;
	
	// [x, z] = [x, z].map(Math.round); //规范化
	// console.warn("load", x, z)
	
	let column = [];
	let height = sNoise.height(t.noise, t.h, x, z);
	if (height < this.size[0].y){
		height = this.size[0].y;
	}else if (height > this.size[1].y){
		height = this.size[1].y;
	}
	/* let sNoise = ( t.noise.more3D(0.6, x/t.h.q, z/t.h.q, 3)+
	t.noise.more3D(-3.1415926, x/t.h.q, z/t.h.q, 3)+
	t.noise.more3D(54.782, x/t.h.q, z/t.h.q, 3) )/3;
	noise = 1-Math.sin( (1-noise)*90/180*Math.PI );
	let height = noise *t.h.k +t.h.b+
	t.noise.more3D(-1428.57, x/t.h.e.q, z/t.h.e.q, 3) *t.h.e.k +t.h.e.b; */
	
	/*let noise = Math.abs(t.noise.more3D(0.6, x/t.h.q/2, z/t.h.q/2, 5));
	let height = noise*noise*noise*(noise*(noise*6-15)+10) //*t.h.k +t.h.b;
	height = Math.pow(t.h.k, height) + t.h.b;*/
	// debugger
	// let a = 1/(1+Math.pow(Math.E, 3)), // 1/(1+e^3)
	// 	b = 1/(1+Math.pow(Math.E, -3)), // 1/(1+e^(-3))
	// 	noise = (1+Math.pow(Math.E, -3*noise)-a)/(b-a); // (1+e^(-3x)-a)/(b-a)
	// let height = (t.h.max -t.h.min)/(t.h.ave -1) *Math.pow(t.h.ave, noise) *(t.h.min *t.h.ave -t.h.max)/(t.h.ave -1);
	// let height = Math.pow(1000, 0.5+0.5*noise, 3), 10);
	// let height = t.noise.noise3D(0.6, x/t.h.q, z/t.h.q) *t.h.de + t.h.ave;
	
	// let grass = false;
	let type = sNoise.type(t.noise, t.t, x, z);
	// 90%+ 高原（草木不生，积雪覆盖）
	// 70%+ 高山（无树，有草）
	// 26+ 丘陵（树）
	let treeTop = null; //保留最高树干坐标
	let earth = height - sNoise.dirt(t.noise, t.d, x, z);
	let treeHeight = height + sNoise.treeHeight(t.noise, t.tH, x, z);
	for (let dy=this.size[1].y; dy>=this.size[0].y; dy--){ //注意：从上到下
		
		for (let value of edit){
			if (
				value.x == x &&
				value.y == dy &&
				value.z == z
			){ //被编辑
				column.push({
					id: value.id,
					attr: value.attr
				});
				continue;
			}
		}
		//未编辑
		
		/* let earth = height - height * (t.noise.more3D(6.6, x/t.s.q, z/t.s.q, 6) *t.s.k +t.s.b)+
		t.noise.more3D(-52.6338, x/t.s.e.q, z/t.s.e.q, 3) *t.s.e.k +t.s.e.b; */
		let id = 0;
		switch (type){
			case 0: //森林
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				}else */if (height > 0.7*this.size[1].y){ // 70%+ 高山（无树，有草）
					treeHeight = height;
				}
				
				if (dy > treeHeight){
					id = 0; // 空气/真空 (null)
				}else if (dy > height){
					if (!treeTop) treeTop = dy;
					id = 8.1; //橡木
				}else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(t.noise, t.oS, x, z)){
						id = 5; //草方块
					}else{
						id = 2; //草方块
					}
				}else if (dy > earth){
					// if (grass){
						id = 3; //泥土
					/* }else{
						id = 2; //草方块
						// grass = true;
					} */
				}/*else if (dy == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(t.noise, t.oS, x, z)){
						id = 2; //草方块
						grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
				
			case 1: //草原
				
				/* if (height > 0.9*this.size[1].y){ // 90%+ 高原（草木不生，积雪覆盖）
					grass = true;
				} */
				
				if (dy > height){
					id = 0; // 空气/真空 (null)
				}/* else if (dy > height){
					if (!treeTop) treeTop = dy;
					id = 8.1; //橡木
				} */else if (dy == Math.floor(height) && !(height > 0.9*this.size[1].y)){ // 90%+ 高原（草木不生，积雪覆盖）
					if (sNoise.openStone(t.noise, t.oS, x, z)){
						id = 5; //草方块
					}else{
						id = 2; //草方块
					}
				}else if (dy > earth){
					// if (grass){
						id = 3; //泥土
					/* }else{
						id = 2; //草方块
						// grass = true;
					} */
				}/*else if (dy == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(t.noise, t.oS, x, z)){
						id = 2; //草方块
						// grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
				
			case 2: //沙漠
				
				if (dy > height){
					id = 0; // 空气/真空 (null)
				}else if (dy > earth){
					id = 6; //沙子
				}/*else if (dy == 0){
					id = 2; //基岩
				}*/else{
					/* if (!grass && !sNoise.openStone(t.noise, t.oS, x, z)){
						id = 6; //沙子
						grass = true;
					}else{ */
						id = 5; //石头
					// }
				}
				break;
			
			default:
				id = 0;
		}
		
		column.push({ id });
	}
	
	self.postMessage( column.reverse() );
	/* if (treeTop){ //非强制添加树叶(9)
		setTimeout(()=>{
			this.addID(9, {
				x: x,
				y: treeTop+1,
				z: z
			}, template, {
				type: false
			});
			let leavesHeight = sNoise.leavesScale(t.noise, t.lS, x, z) *(treeHeight - height);
			for (let i=0; i<=leavesHeight; i++){
				this.addID(9, {
					x: x+1,
					y: treeTop-i,
					z: z
				}, template, {
					type: false
				});
				this.addID(9, {
					x: x-1,
					y: treeTop-i,
					z: z
				}, template, {
					type: false
				});
				this.addID(9, {
					x: x,
					y: treeTop-i,
					z: z+1
				}, template, {
					type: false
				});
				this.addID(9, {
					x: x,
					y: treeTop-i,
					z: z-1
				}, template, {
					type: false
				});
			}
		}, 1000);
		
	} */
});