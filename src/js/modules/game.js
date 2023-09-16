
let Game = {
	init() {
		// fast references
		this.cvs = window.find("canvas");
		this.ctx = this.cvs[0].getContext("2d");

		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });

		Main.init();

		let that = this;
		this.fpsControl = karaqu.FpsControl({
			frames: {
				10: () => {
					// tick planets
					Main.planets.map(p => p.Tick());
				},
				60: () => {
					that.update();
					that.render();
				},
			}
		});
		// start FPC
		this.fpsControl.start();
	},
	update() {
		Main.allships.map(s1 => {
			let rect = new Rectangle(100, 100, 50, 50),
				delta = 2;
			// move ship
			s1.Move(rect, delta, true);
			s1.Rotate(delta);
			// collision detection; ships
			Main.allships.map(s2 => {
				if (s1 === s2) return;
				if (s1.pos.distance(s2.pos) < s1.radius * 2) s1.Collide(s2);
			});
			// collision detection; planets
			Main.planets.map(p => s1.CollidePlanet(p));
		});
	},
	render() {
		let width = this.width,
			tau = Math.PI * 2,
			piHalf = Math.PI / 2;

		this.cvs.attr({ width });
		// this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.lineWidth = 2;
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "18px Lucida Console";

		Main.planets.map(p => {
			let color = Colors[p.owner] || "#ffffff",
				ships = Math.round(p.ships),
				r2 = p.radius * 2;

			this.ctx.save();
			// planet atmosphere
			this.ctx.shadowColor = '#ffffff50';
			this.ctx.shadowBlur = 5;
			// this.ctx.drawImage(Surface.cvs, p.pos._x - p.radius, p.pos._y - p.radius, r2, r2);
			this.ctx.putImageData(p.surface, p.pos._x - p.radius, p.pos._y - p.radius, 0, 0, r2, r2);
			this.ctx.restore();

			// this.ctx.strokeStyle = color;
			// this.ctx.fillStyle = color +"77";
			// this.ctx.beginPath();
			// this.ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
			// this.ctx.stroke();

			// this.ctx.beginPath();
			// this.ctx.arc(p.pos._x, p.pos._y, p.radius - 3, 0, tau, true);
			// this.ctx.fill();

			// production number
			this.ctx.save();
			this.ctx.lineWidth = 3;
			this.ctx.strokeStyle = "#000";
			this.ctx.fillStyle = "#fff";
			this.ctx.strokeText(ships, p.pos._x, p.pos._y+2, r2);
			this.ctx.fillText(ships, p.pos._x, p.pos._y+2, r2);
			this.ctx.restore();
		});

		Main.allships.map(s => {
			var w = 6,
				h = w * 2,
				c = s.vangle + piHalf;
			this.ctx.save();
			// rotate
			this.ctx.translate(s.vpos._x, s.vpos._y);
			this.ctx.rotate(c);

			// debug ring
			// this.ctx.strokeStyle = "#eeeeee77";
			// this.ctx.lineWidth = 1;
			// this.ctx.beginPath();
			// this.ctx.arc(0, 0, s.ship_radius, 0, tau, true);
			// this.ctx.stroke();

			// ship gui
			this.ctx.fillStyle = Colors[s.owner] || "#ffffff";
			this.ctx.lineJoin = "round";
			this.ctx.lineWidth = 3;
			// ship outline
			this.ctx.beginPath();
			this.ctx.moveTo(0, -9);
			this.ctx.lineTo(6, 7);
			this.ctx.lineTo(-6, 7);
			this.ctx.closePath();
			this.ctx.stroke();

			this.ctx.translate(-s.vpos._x, -s.vpos._y);

			this.ctx.restore();
		});
	}
}
