
let GameUI = {
	init() {
		// fast references
		this.cvs = window.find("canvas.game");
		this.ctx = this.cvs[0].getContext("2d", { willReadFrequently: true });
		this.width = this.cvs.prop("offsetWidth"),
		this.height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width: this.width, height: this.height });
		// prepare ship blueprints
		this.bluePrintShips();

		this.area = new Rectangle(0, 0, this.width, this.height);
		this.speed = 2.25;
		this.showFps = false;
	},
	bluePrintShips() {
		let prints = [
				[[10,2], [14,18], [17,10], [14,18], [6,18], [3,10], [6,18]],
				[[10,2], [16,18], [4,18]],
				[[10,2], [16,16], [10,18], [4,16]],
				[[10,2], [16,18], [10,16], [4,18]],
			];
		// loop prints
		this.ships = prints.map(p => {
			let cvs = document.createElement("canvas"),
				ctx = cvs.getContext("2d", { willReadFrequently: true }),
				colorize = color => {
					ctx.fillStyle = color;
					ctx.fillRect(0,0,20,20);
					return cvs;
				};
			cvs.width = 20;
			cvs.height = 20;
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#fff";
			ctx.lineJoin = "round";
			// ship outline
			ctx.beginPath();
			ctx.moveTo(...p[0]);
			p.slice(1).map(e => ctx.lineTo(...e));
			ctx.closePath();
			ctx.stroke();
			ctx.globalCompositeOperation = "source-in";
			return { cvs, ctx, colorize };
		});
	},
	loop(overFunc) {
		let APP = galcon,
			_Main = Main,
			_GameUI = GameUI;
		// if any already running, stop
		if (this.fpsControl) this.fpsControl.stop();
		// reset fx pipe
		Fx.clearLines();
		// stop starfield
		APP.start.starfield.stop();
		// autohide dock
		APP.dock.els.ul.addClass("autohide");
		// save reference to "game over" function
		this.overFunc = overFunc;
		// FPS control
		this.fpsControl = karaqu.FpsControl({
			frames: {
				10: () => {
					// tick planets
					_Main.planets.map(p => p.Tick());
				},
				60: () => {
					if (_GameUI.fpsControl && _Main.ai) _Main.ai.Tick();
					_GameUI.update();
					_GameUI.render();
					_Main.CheckWinLose();
				},
			},
		});
		// start FPC
		// this.fpsControl.start();
	},
	over(looser) {
		// auto stop loop
		this.fpsControl.stop();
		// call "game over" function
		this.overFunc(looser);
	},
	resetAll() {
		// reset all
		delete this.overFunc;
		this.planets = [];
		Fx.clearLines();
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

		// render starfield
		Starfield.render();
		// render planet surface
		Main.planets.map(p => Surface.render(this.ctx, p));

		// render ships
		this.ctx.lineWidth = 3;
		Main.allships.map(s => {
			var c = s.vangle + piHalf,
				ship = this.ships[s.owner].colorize(s.color);
			if (ship.opacity <= 0) return;
			// rotate
			this.ctx.save();
			this.ctx.translate(s.vpos._x, s.vpos._y);
			this.ctx.rotate(c);
			if (s.stealth !== null) {
				this.ctx.globalAlpha = s.opacity / 60;
			}
			this.ctx.drawImage(ship, -10, -10);
			this.ctx.restore();
		});
		// effects layer
		Fx.render(this.ctx);
		// FPS 
		if (this.showFps) this.drawFps(this.ctx);
	},
	drawFps(ctx) {
		let fps = this.fpsControl ? this.fpsControl._log : [];
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
