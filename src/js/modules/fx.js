
let Fx = {
	init() {
		this.pipe = [];
		this.img = new Image();
		this.img.src = "~/img/explosion-32.png";
	},
	clearLines() {
		this.pipe.map((e, i) => {
			if (e.type === "line") this.pipe.splice(i, 1);
		});
	},
	line(from, to) {
		this.pipe.push({ type: "line", from, to });
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
		let p1,
			p2;

		ctx.save();
		this.pipe.map((e, i) => {
			switch (e.type) {
				case "line":
					p1 = e.from.pos.clone();
					p2 = e.to.pos.clone();

					// line from and to "orbit"
					p1.moveTowards(p2, e.from.radius + 5);
					p2.moveTowards(p1, e.to.radius + 5);

					ctx.lineWidth = 2.5;
					ctx.strokeStyle = e.from.color;
					ctx.beginPath();
					ctx.moveTo(p1._x, p1._y);
					ctx.lineTo(p2._x, p2._y);
					ctx.stroke();
					break;
				case "explosion":
					ctx.globalCompositeOperation = "lighter";
					let f = e.frames.shift();
					if (!f) return this.pipe.splice(i, 1);
					ctx.drawImage(this.img, f[0], f[1], e.r, e.r, e.x, e.y, e.r, e.r);
					break;
			}
		});
		ctx.restore();
	}
};
