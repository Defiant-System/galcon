
let GameUI = {
	init() {
		// fast references
		this.cvs = window.find("canvas");
		this.ctx = this.cvs[0].getContext("2d", { willReadFrequently: true });
		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });

		this.area = new Rectangle(0, 0, this.width, this.height);
		this.speed = 2;
		this.mode = "dev";

		Main.init();
		Fx.init();

		let _Main = Main,
			_GameUI = GameUI;
		this.fpsControl = karaqu.FpsControl({
			frames: {
				10: () => {
					// tick planets
					_Main.planets.map(p => p.Tick());
				},
				60: () => {
					_Main.ai.Tick();
					_GameUI.update();
					_GameUI.render();
				},
			}
		});
		// start FPC
		this.fpsControl.start();
	},
	update() {
		Main.allships.map(s1 => {
			// move ship
			s1.Move(this.area, this.speed, true);
			s1.Rotate(this.speed);
			// collision detection; ships
			Main.allships.map(s2 => {
				if (s1 === s2 || s1.fleet_id !== s2.fleet_id) return;
				if (s1.pos.distance(s2.pos) < s1.radius << 1) s1.Collide(s2);
			});
			// collision detection; planets
			Main.planets.map(p => s1.CollidePlanet(p));
		});
	},
	render() {
		let width = this.width,
			height = this.height,
			tau = Math.PI * 2,
			piHalf = Math.PI / 2;

		this.cvs.attr({ width });
		// this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.lineWidth = 3;
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "18px Lucida Console";

		// render starfield
		Starfield.render(this.ctx, width, height);
		// render planet surface
		Main.planets.map(p => Surface.render(this.ctx, p));
		// render ships
		Main.allships.map(s => {
			var c = s.vangle + piHalf;
			// rotate
			this.ctx.save();
			this.ctx.translate(s.vpos._x, s.vpos._y);
			this.ctx.rotate(c);

			// debug ring
			// this.ctx.strokeStyle = "#eeeeee77";
			// this.ctx.lineWidth = 1;
			// this.ctx.beginPath();
			// this.ctx.arc(0, 0, s.ship_radius, 0, tau, true);
			// this.ctx.stroke();

			// ship gui
			this.ctx.strokeStyle = s.color || "#ffffff";
			this.ctx.lineJoin = "round";
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
		// if (Fx._loaded) Fx.explode(150, 140);
		Fx.render(this.ctx);
		// FPS 
		if (this.mode === "dev") this.drawFps(this.ctx);
	},
	drawFps(ctx) {
		let fps = this.fpsControl._log;
		ctx.save();
		ctx.translate(this.width - 109, this.height - 49);
		// draw box
		ctx.fillStyle = "rgba(0,200,100,0.5)";
		ctx.fillRect(5, 5, 100, 40);
		ctx.fillStyle = "rgba(80,255,80,0.5)";
		ctx.fillRect(7, 7, 96, 11);
		ctx.fillStyle = "rgba(255,255,255,0.6)";
		// loop log
		for (let i=0; i<96; i++) {
			let bar = fps[i];
			if (!bar) break;
			let p = bar/90;
			if (p > 1) p = 1;
			ctx.fillRect(102 - i, 43, 1, -24 * p);
		}
		// write fps
		ctx.fillStyle = "#000";
		ctx.font = "9px Arial";
		ctx.textAlign = "left";
		ctx.fillText('FPS: '+ fps[0], 8, 14);
		// restore state
		ctx.restore();
	}
}
