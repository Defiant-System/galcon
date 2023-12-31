
let Starfield = {
	init() {
		this.cvs = window.find("canvas.starfield");
		this.ctx = this.cvs[0].getContext("2d", { willReadFrequently: true });
		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });

		this.max_depth = 48;
		this.stars = [...Array(64)].map(e => ({
			x: this.rnd(-25, 25),
			y: this.rnd(-25, 25),
			z: this.rnd(1, this.max_depth)
		}));
	},
	rnd(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	render() {
		var ctx = this.ctx,
			width = this.width,
			height = this.height,
			halfWidth = width >> 1,
			halfHeight = height >> 1,
			max_depth = this.max_depth,
			stars = this.stars,
			len = stars.length,
			tau = Math.PI * 2,
			shade,
			size,
			px,
			py,
			k;
		// reset canvas
		this.cvs.attr({ width });
		// draw stars
		while (len--) {
			stars[len].z -= 0.01;
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
