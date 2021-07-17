SimplexNoise.prototype.more3D = function(xin, yin, zin, more){
	let sum = 0, s=1;
	while (more--){
		sum += this.noise3D(xin*s, yin*s, zin*s)/s;
		s *= 2;
	}
	return sum;
};
const sNoise = {
	// 种子随机常数
	RANDOM: [
		0.6,
		-3.1415926,
		54.782,
		-1428.57,
		333.35,
		6.6,
		-52.6338,
		332.976,
		-5.4128,
		-8.766164554948489,
		93.139,
		3528.17,
		644.157
	],
	
	rnd(seed){ //表达式随机
		seed = (seed *9301 +49297) %233280; //为何使用这三个数?
		return seed/233280;
	},
	rnd_error(noise, t, id, x, z){
		return exp_rnd( noise.more3D(id, x/t.q, z/t.q, 6) ) *t.k +t.b;
	},
	
	error(noise, t, id, x, z){
		return noise.more3D(id, x/t.q, z/t.q, 6) *t.k +t.b;
	},
	height(noise, t, x, z){
		let value = ( noise.more3D(this.RANDOM[0],	x/t.q, z/t.q, 3)+
			noise.more3D(this.RANDOM[1],			x/t.q, z/t.q, 3)+
			noise.more3D(this.RANDOM[2],			x/t.q, z/t.q, 3) )/3;
		value = 1-Math.sin( (1-value)*90/180*Math.PI );
		return Math.limitRange(
			value *t.k +t.b +sNoise.error(noise, t.e, this.RANDOM[3], x, z),
			t.min, t.max
		)
	},
	type(noise, t, x, z){
		const value = Math.abs( noise.noise3D(this.RANDOM[4], x/t.q, z/t.q) );
		return value < t.desert? 2:
			value < t.desert+t.grassland? 1:
			0;
	},
	dirt(noise, t, x, z){
		const value = noise.more3D(this.RANDOM[5], x/t.q, z/t.q, 3) *t.k +t.b+
			sNoise.error(noise, t.e, this.RANDOM[6], x, z);
		return Math.limitRange(value, 0, 1);
	},
	treeHeight(noise, t, x, z){
		const result = [0, 0, 0, 0 ,0],
			value = noise.more3D(this.RANDOM[7], x/t.q, z/t.q, 3);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[0] = noise.more3D(this.RANDOM[8], x/t.q, z/t.q, 3) *t.k +t.b+
				sNoise.error(noise, t.e, this.RANDOM[9], x, z);
		
		/* value = noise.more3D(this.RANDOM[7], (x+1)/t.q, z/t.q, 3);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[1] = noise.more3D(this.RANDOM[8], (x+1)/t.q, z/t.q, 3) *t.k +t.b+
				sNoise.error(noise, t.e, this.RANDOM[9], (x+1), z);
		
		value = noise.more3D(this.RANDOM[7], (x-1)/t.q, z/t.q, 3);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[2] = noise.more3D(this.RANDOM[8], (x-1)/t.q, z/t.q, 3) *t.k +t.b+
				sNoise.error(noise, t.e, this.RANDOM[9], (x-1), z);
		
		value = noise.more3D(this.RANDOM[7], x/t.q, (z+1)/t.q, 3);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[3] = noise.more3D(this.RANDOM[8], x/t.q, (z+1)/t.q, 3) *t.k +t.b+
				sNoise.error(noise, t.e, this.RANDOM[9], x, (z+1));
		
		value = noise.more3D(this.RANDOM[7], x/t.q, (z-1)/t.q, 3);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[4] = noise.more3D(this.RANDOM[8], x/t.q, (z-1)/t.q, 3) *t.k +t.b+
				sNoise.error(noise, t.e, this.RANDOM[9], x, (z-1));
		
		if (result.splice(1).some(function(value){
			return value != 0;
		})) result[0] = 0; //防止树木过密 */
		return result[0];
	},
	leavesScale(noise, t, x, z){
		const value = noise.more3D(this.RANDOM[10], x/t.q, z/t.q, 3) *t.k +t.b+
			sNoise.error(noise, t.e, this.RANDOM[11], x, z);
		return Math.limitRange(value, 0, 1);
	},
	/* openStone(noise, t, x, z){
		const value = noise.more3D(this.RANDOM[12], x/t.q, z/t.q, 3) *t.k +t.b;
		return value>=0? true: false;
	}, */
	weatherRain(noise, t, x, z, time){
		const value = noise.more3D(time/t.q, x/t.q, z/t.q, 3) *t.k +t.b+
			sNoise.error(noise, t.e, time, x, z);
		return Math.limitRange(value, 0, 1);
	}
};