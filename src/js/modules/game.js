
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
				4: () => {
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
				if (s1.pos.distance(s2.pos) < s1.ship_radius * 2) s1.Collide(s2);
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
		this.ctx.font = "25px sans-serif";

		Main.planets.map(p => {
			this.ctx.fillStyle =
			this.ctx.strokeStyle = Colors[p.owner] || "#fff";
			this.ctx.beginPath();
			this.ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
			this.ctx.stroke();
			// production number
			this.ctx.fillText(Math.round(p.ships), p.pos._x, p.pos._y, p.radius * 2);
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
			this.ctx.strokeStyle = Colors[s.owner] || "#fff";
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
