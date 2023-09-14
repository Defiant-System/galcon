
let Game = {
	init() {
		// fast references
		this.cvs = window.find("canvas");
		this.ctx = this.cvs[0].getContext("2d");

		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });

		Main.init();

		this.update();
		this.render();
	},
	update() {
		Main.allships.map(s => {
			let rect = new Rectangle(100, 100, 50, 50),
				rad = Math.PI * .15;
			s.Move(rect, rad, true);
			s.Rotate(rad);
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
			var w = 7,
				h = w * 2,
				c = s.vangle;
			this.ctx.save();
			// rotate
			this.ctx.translate(s.pos._x, s.pos._y);
			this.ctx.rotate((c + 90) * Math.PI / 180); 
			this.ctx.translate(-s.pos._x, -s.pos._y);
			// ship gui
			this.ctx.strokeStyle = "#b2b";
			this.ctx.lineJoin = "round";
			this.ctx.lineWidth = 3;
			// ship outline
			this.ctx.beginPath();
			this.ctx.moveTo(s.pos._x, s.pos._y - h);
			this.ctx.lineTo(s.pos._x + w, s.pos._y + w);
			this.ctx.lineTo(s.pos._x - w, s.pos._y + w);
			this.ctx.closePath();
			this.ctx.stroke();

			this.ctx.restore();
		});
	}
}
