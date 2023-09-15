
let Game = {
	init() {
		// fast references
		this.cvs = window.find("canvas");
		this.ctx = this.cvs[0].getContext("2d");

		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });

		this._paused = false;

		Main.init();

		this.frame();
	},
	frame() {
		this.update();
		this.render();

		if (this._paused) return;
		requestAnimationFrame(this.frame.bind(this));
	},
	update() {
		Main.allships.map(s1 => {
			let rect = new Rectangle(100, 100, 50, 50),
				delta = 2;
			s1.Move(rect, delta, true);
			s1.Rotate(delta);

			Main.allships.map(s2 => {
				if (s1 === s2) return;
				if (s1.pos.distance(s2.pos) < s1.ship_radius * 2) s1.Collide(s2);
			});

			Main.planets.map(p => {
				s1.CollidePlanet(p);
			});
		});
	},
	render() {
		let tau = Math.PI * 2;

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.lineWidth = 2;
		// this.ctx.fillRect(50, 50, 30, 30);

		Main.planets.map(p => {
			this.ctx.strokeStyle = p.color || "#fff";
			this.ctx.beginPath();
			this.ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
			this.ctx.stroke();
		});

		Main.allships.map(s => {
			var w = 6,
				h = w * 2,
				c = s.vangle + (Math.PI * .5);
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
			this.ctx.strokeStyle = "#b2b";
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
