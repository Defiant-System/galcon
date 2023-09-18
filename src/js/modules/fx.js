
let Fx = {
	init() {
		this.pipe = [];
		
		this.img = new Image();
		this.img.src = "~/img/explosion-32.png";
	},
	explode(x, y) {
		this.pipe.push({ type: "explosion", x: x-16, y: y-16, r: 32, frames: [
				[0,0],[32,0],[64,0],[96,0],[128,0],
				[0,32],[32,32],[64,32],[96,32],[128,32],
				[0,64],[32,64],[64,64],[96,64],[128,64],
				[0,96],[32,96],[64,96],[96,96],[128,96],
				[0,128],[32,128],[64,128],[96,128]
			] });
	},
	render(ctx) {
		ctx.save();
		// ctx.globalAlpha = .25;
		ctx.globalCompositeOperation = "lighter";

		this.pipe.map((e, i) => {
			let f = e.frames.shift();
			if (!f) return this.pipe.splice(i, 1);
			ctx.drawImage(this.img, f[0], f[1], e.r, e.r, e.x, e.y, e.r, e.r);
		});

		ctx.restore();
	}
};
