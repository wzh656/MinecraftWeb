SimplexNoise.prototype.more3D = function(xin, yin, zin, more){
	let sum = 0;
	for (let i=1; i<more; i*=2){
		sum += this.noise3D(xin*i, yin*i, zin*i)/i;
	}
	return sum;
};
// 种子随机常数
const SEED_RANDOM_CONSTANT = [
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
];
const sNoise = {
	rnd(seed){ //表达式随机
		seed = (seed *9301 +49297) %233280; //为何使用这三个数?
		return seed/233280;
	},
	rnd_error(noise, t, id, x, z){
		return exp_rnd( noise.more3D(id, x/t.q, z/t.q, 3) ) *t.k +t.b;
	},
	error(noise, t, id, x, z){
		return noise.more3D(id, x/t.q, z/t.q, 3) *t.k +t.b;
	},
	height(noise, t, x, z){
		let value = ( noise.more3D(SEED_RANDOM_CONSTANT[0],	x/t.q, z/t.q, 3)+
			noise.more3D(SEED_RANDOM_CONSTANT[1],			x/t.q, z/t.q, 3)+
			noise.more3D(SEED_RANDOM_CONSTANT[2],			x/t.q, z/t.q, 3) )/3;
		value = 1-Math.sin( (1-value)*90/180*Math.PI );
		return value *t.k +t.b +sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[3], x, z);
	},
	type(noise, t, x, z){
		let value = Math.abs( noise.noise3D(SEED_RANDOM_CONSTANT[4], x/t.q, z/t.q) );
		return value < t.desert?2: value < t.desert+t.grassland?1: 0;
	},
	dirt(noise, t, x, z){
		let value = noise.more3D(SEED_RANDOM_CONSTANT[5], x/t.q, z/t.q, 6) *t.k +t.b+
			sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[6], x, z);
		return value<0?0: value;
	},
	treeHeight(noise, t, x, z){
		let result = [0];
		let value = noise.more3D(SEED_RANDOM_CONSTANT[7], x/t.q, z/t.q, 6);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[0] = noise.more3D(SEED_RANDOM_CONSTANT[8], x/t.q, z/t.q, 6) *t.k +t.b+
				sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[9], x, z);
		
		value = noise.more3D(332.976, (x+1)/t.q, z/t.q, 6);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[1] = noise.more3D(SEED_RANDOM_CONSTANT[8], (x+1)/t.q, z/t.q, 6) *t.k +t.b+
				sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[9], (x+1), z);
		
		value = noise.more3D(332.976, (x-1)/t.q, z/t.q, 6);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[2] = noise.more3D(SEED_RANDOM_CONSTANT[8], (x-1)/t.q, z/t.q, 6) *t.k +t.b+
				sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[9], (x-1), z);
		
		value = noise.more3D(332.976, x/t.q, (z+1)/t.q, 6);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[3] = noise.more3D(SEED_RANDOM_CONSTANT[8], x/t.q, (z+1)/t.q, 6) *t.k +t.b+
				sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[9], x, (z+1));
		
		value = noise.more3D(332.976, x/t.q, (z-1)/t.q, 6);
		if (t.plt.min < value && value < t.plt.max) // 1/12
			result[4] = noise.more3D(SEED_RANDOM_CONSTANT[8], x/t.q, (z-1)/t.q, 6) *t.k +t.b+
				sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[9], x, (z-1));
		
		if (result.splice(1).some(function(value){
			return value != 0;
		})) result[0] = 0; //防止树木过密
		return result[0];
	},
	openStone(noise, t, x, z){
		let value = noise.more3D(SEED_RANDOM_CONSTANT[10], x/t.q, z/t.q, 6) *t.k +t.b;
		return value>=0? true: false;
	},
	leavesScale(noise, t, x, z){
		let value = noise.more3D(SEED_RANDOM_CONSTANT[11], x/t.q, z/t.q, 6) *t.k +t.b+
			sNoise.error(noise, t.e, SEED_RANDOM_CONSTANT[12], x, z);
		return value<0?0: value>1?1: value;
	}
};
export sNoise;