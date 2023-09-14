
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
		let get_distance = (p1, p2) =>
				Math.sqrt(Math.pow((p1._x-p2._x), 2) + Math.pow((p1._y-p2._y), 2));

		Main.allships.map(s => {
			let rect = new Rectangle(100, 100, 50, 50),
				delta = 2;
			s.Move(rect, delta, true);
			s.Rotate(delta);

			Main.planets.map(p => {
				let dist = get_distance(s.pos, p.pos);
				if (dist < p.radius) s.CollidePlanet(p);
			});
		});
	},
	render() {
		let tau = Math.PI * 2;

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = "#fff";
		this.ctx.strokeStyle = "#fff";
		this.ctx.lineWidth = 2;
		// this.ctx.fillRect(50, 50, 30, 30);

		Main.planets.map(p => {
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
			this.ctx.translate(-s.vpos._x, -s.vpos._y);
			// ship gui
			this.ctx.strokeStyle = "#b2b";
			this.ctx.lineJoin = "round";
			this.ctx.lineWidth = 3;
			// ship outline
			this.ctx.beginPath();
			this.ctx.moveTo(s.vpos._x, s.vpos._y - h);
			this.ctx.lineTo(s.vpos._x + w, s.vpos._y + w);
			this.ctx.lineTo(s.vpos._x - w, s.vpos._y + w);
			this.ctx.closePath();
			this.ctx.stroke();

			this.ctx.restore();
		});
	}
}
