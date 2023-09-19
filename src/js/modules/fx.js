
let Fx = {
	init() {
		this.pipe = [];
		this.img = new Image();
		this.img.src = "~/img/explosion-32.png";
	},
	clearLines(types="line outline") {
		for (let i=this.pipe.length-1; i>=0; i--) {
			if (types.split(" ").includes(this.pipe[i].type)) this.pipe.splice(i, 1);
		}
	},
	outline: {
		add(planet, color) {
			let e = { type: "outline", planet, color };
			// prevents duplicates
			if (Fx.pipe.find(l => l.type == e.type && l.planet.id == e.planet.id && l.color == e.color)) return;
			Fx.pipe.push(e);
		},
		remove(id) {
			Fx.pipe.map((e, i) => {
				if (e.type === "outline" && e.planet.id === id) Fx.pipe.splice(i, 1);
			});
		}
	},
	line: {
		add(from, to) {
			let e = { type: "line", from, to };
			// prevents duplicates
			if (Fx.pipe.find(l => l.type == e.type && l.from.id == e.from.id && l.to.id == e.to.id)) return;
			Fx.pipe.push(e);
		},
		remove(id) {
			Fx.pipe.map((e, i) => {
				if (e.type === "line" && e.to.id === id) Fx.pipe.splice(i, 1);
			});
		}
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
		let tau = Math.PI * 2,
			p1, p2;

		ctx.save();
		this.pipe.map((e, i) => {
			switch (e.type) {
				case "outline":
					p1 = e.planet;
					// paint
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = e.color;
					ctx.beginPath();
					ctx.arc(p1.pos._x, p1.pos._y, p1.radius + 5, 0, tau, true);
					ctx.stroke();
					break;
				case "line":
					p1 = e.from.pos.clone();
					p2 = e.to.pos.clone();
					// line from and to "orbit"
					p1.moveTowards(p2, e.from.radius + 5);
					p2.moveTowards(p1, e.to.radius + 5);
					// paint
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
