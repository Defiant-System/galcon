
let Fx = {
	init() {
		this.pipe = [];
		
		this.img = new Image();
		this.img.src = "~/img/explosion.png";
	},
	explode(x, y) {
		this.pipe.push({ type: "explosion", x: x-16, y: y-16, frames: [
				[0,0],[64,0],[128,0],[192,0],[256,0],
				[0,64],[64,64],[128,64],[192,64],[256,64],
				[0,128],[64,128],[128,128],[192,128],[256,128],
				[0,192],[64,192],[128,192],[192,192],[256,192],
				[0,256],[64,256],[128,256],[192,256]
			] });
	},
	render(ctx) {
		ctx.save();
		// ctx.globalAlpha = .25;
		ctx.globalCompositeOperation = "lighter";

		this.pipe.map((e, i) => {
			let f = e.frames.shift();
			if (!f) return this.pipe.splice(i, 1);
			ctx.drawImage(this.img, f[0], f[1], 64, 64, e.x, e.y, 32, 32);
		});

		ctx.restore();
	}
};
