
let Starfield = {
	init() {
		this.max_depth = 32;
		this.stars = [...Array(63)].map(e => ({
			x: this.rnd(-25, 25),
			y: this.rnd(-25, 25),
			z: this.rnd(1, 32)
		}));
	},
	rnd(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	render(ctx, width, height) {
		var tau = Math.PI * 2,
			halfWidth = width >> 1,
			halfHeight = height >> 1,
			max_depth = this.max_depth,
			stars = this.stars,
			len = stars.length,
			shade,
			size,
			px,
			py,
			k;
		while (len--) {
			stars[len].z -= 0.005;

			if (stars[len].z <= 0) {
				stars[len].x = this.rnd(-25, 25);
				stars[len].y = this.rnd(-25, 25);
				stars[len].z = max_depth;
			}
			k  = 128 / stars[len].z,
			px = stars[len].x * k + halfWidth,
			py = stars[len].y * k + halfHeight;

			if (px >= 0 && px <= width && py >= 0 && py <= height) {
				shade = (1 - stars[len].z / 64),
				size = shade * 2;
				ctx.beginPath();
				ctx.fillStyle = "rgba(255,255,255," + shade + ")";
				ctx.arc(px, py, size, 0, tau);
				ctx.fill();
			}
		}
	}
};
