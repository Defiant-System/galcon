
let Fx = {
	init() {
		this.pipe = [];
		this.TAU = Math.PI * 2;
		this.img = new Image();
		this.img.src = "~/img/explosion-32.png";

		let cvs = document.createElement("canvas"),
			ctx = cvs.getContext("2d", { willReadFrequently: true });
		cvs.width = 18;
		cvs.height = 20;
		ctx.fillStyle = "#55eeee";
		// ship outline
		ctx.beginPath();
		ctx.moveTo(9, 2);
		ctx.lineTo(16, 18);
		ctx.lineTo(2, 18);
		ctx.closePath();
		ctx.fill();

		this.arrowHead = { cvs, ctx };
	},
	clearLines(types="line outline") {
		for (let i=this.pipe.length-1; i>=0; i--) {
			let e = this.pipe[i];
			if (types.split(" ").includes(e.type)) {
				if (e.planet) e.planet.selected = false;
				this.pipe.splice(i, 1);
			}
		}
	},
	outline: {
		add(planet, color) {
			let e = { type: "outline", planet, color };
			// prevents duplicates
			if (planet && color && Fx.pipe.find(l => l.type == e.type && l.planet.id == e.planet.id && l.color == e.color)) return;
			planet.selected = true;
			Fx.pipe.push(e);
		},
		remove(id) {
			Fx.pipe.map((e, i) => {
				if (e.type === "outline" && e.planet.id === id) {
					e.planet.selected = false;
					Fx.pipe.splice(i, 1);
				}
			});
		}
	},
	line: {
		add(from, to) {
			let e = { type: "line", from, to };
			// prevents duplicates
			if (to && from && Fx.pipe.find(l => l.type == e.type && l.from.id == e.from.id && l.to.id == e.to.id)) return;
			if (to.id !== from.id) Fx.pipe.push(e);
		},
		remove(id) {
			Fx.pipe.map((e, i) => {
				if (e.type === "line" && (e.from.id === id || e.to.id === id)) Fx.pipe.splice(i, 1);
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
		let arrowHead = this.arrowHead.cvs,
			line,
			p1, p2;

		this.pipe.map((e, i) => {
			switch (e.type) {
				case "outline":
					ctx.save();
					p1 = e.planet;
					// paint
					ctx.shadowBlur = 4;
					ctx.lineWidth = 2;
					ctx.strokeStyle = "#55eeee";
					ctx.shadowColor = "#55eeee";
					ctx.beginPath();
					ctx.arc(p1.pos._x, p1.pos._y, p1.radius + 5, 0, this.TAU, true);
					ctx.stroke();
					ctx.restore();
					break;
				case "line":
					ctx.save();
					line = e.from.lines[`${e.from.id}-${e.to.id}`];
					if (!line) console.log(`${e.from.id}-${e.to.id}`);
					// paint
					ctx.shadowBlur = 4;
					ctx.lineWidth = 2;
					ctx.strokeStyle = "#55eeee";
					ctx.shadowColor = "#55eeee";
					ctx.beginPath();
					ctx.moveTo(line.p1._x, line.p1._y);
					ctx.lineTo(line.p2._x, line.p2._y);
					ctx.stroke();
					// arrow head
					ctx.translate(line.p2._x, line.p2._y);
					ctx.rotate(line.angle);
					ctx.drawImage(arrowHead, -9, -5);
					ctx.restore();
					break;
				case "explosion":
					ctx.save();
					ctx.shadowBlur = 0;
					ctx.globalCompositeOperation = "lighter";
					let f = e.frames.shift();
					if (!f) return this.pipe.splice(i, 1);
					ctx.drawImage(this.img, f[0], f[1], e.r, e.r, e.x, e.y, e.r, e.r);
					ctx.restore();
					break;
			}
		});
	}
};
