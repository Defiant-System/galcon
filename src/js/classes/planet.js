
class Planet {
	constructor(x, y, radius, ships, owner) {
		this.id = Main.planets.length + 1;
		this.pos = new Point(x, y);
		this.zpos = new Point();
		this._owner = owner;
		this.color = Palette[owner].color;
		// this.texture = Surface.maps[texture];
		this.TAU = Math.PI * 2;
		this.width =
		this.height = radius * 2;
		this.radius = radius;
		this.ships = ships;
		this.production = radius / 200;
		
		// this.tilt = ((Math.random() * 90) - 45) | 0;
		// this.speed = (Math.random() * 3) - 1.5;
		this.aura = 0;
		this.aura_step = owner === Owner.HUMAN ? .015 : -.015;
		// this.rotation = 0;
		// this.rotation_max = 0;

		this.lines = {};

		this.Tick();
	}

	get x() { return this.pos._x - this.radius; }
	get y() { return this.pos._y - this.radius; }

	get owner() {
		return this._owner;
	}

	set owner(v) {
		this.color = Palette[v].color;
		this.aura_step = v === Owner.HUMAN ? .015 : -.015;
		this._owner = v;
	}

	calcLines(planets) {
		planets.map(p => {
			if (p.id === this.id) return;
			let p1 = this.pos.clone(),
				p2 = p.pos.clone();
			// line from and to "orbit"
			p1.moveTowards(p2, this.radius + 5);
			p2.moveTowards(p1, p.radius + 5);

			let angle = p1.direction(p2) + Math.PI / 2;
			this.lines[`${this.id}-${p.id}`] = { p1, p2, angle };
		});
	}

	Tick() {
		// aura / dashed line
		this.aura += this.aura_step;
		// rotate planet
		// this.rotation += this.speed;
		// if (!this.rotation_max && Surface.texture[this.texture]) {
		// 	let ratio = Surface.texture[this.texture].width / Surface.texture[this.texture].height;
		// 	this.rotation_max = (ratio * (this.radius * 2)) | 0;
		// }
		// if (this.speed > 0 && this.rotation > this.rotation_max) this.rotation = 0;
		// if (this.speed < 0 && this.rotation < -this.radius * 4) this.rotation = this.rotation_max;
		if (this._owner !== Owner.NEUTRAL) {
			// update shap count
			this.ships += this.production;
		}
	}

	ShipHit(ship) {
		if (ship.owner === this.owner) {
			this.ships += ship.value;
		} else {
			this.ships -= ship.value;
			// planet is overtaken
			if (this.ships < 1) {
				this.owner = ship.owner;
				// sound effect
				window.audio.play("takeover");
				// 
				let Stage = galcon.stage,
					el = Stage.els.el.find(`.planet[data-id="${this.id}"]`).removeClass("neutral ai human");
				if (this.owner === Owner.HUMAN) el.addClass("human");
				else Stage.dispatch({ type: "unselect-planet", planet: this });
			}
			// explosion effect
			Fx.explode(ship.pos._x, ship.pos._y);
			// sound effect
			window.audio.play("blast");
		}
	}

	render(ctx) {
		let ships = Math.abs(Math.round(this.ships)),
			r = this.radius,
			x = this.pos._x,
			y = this.pos._y,
			r2 = r << 1;

		/*/ dashed line START */
		if (this.owner !== Owner.NEUTRAL && !this.selected) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.aura);
			ctx.translate(-x, -y);
			let tot = 15,
				len = 15;
			ctx.strokeStyle = this.color + "bb";
			ctx.lineWidth = 3;
			r += 5;
			while (len--) {
				let s1 = len / tot,
					s2 = (len - .6) / tot;
				ctx.beginPath();
				ctx.arc(x, y, r, s1*this.TAU, s2*this.TAU, true);
				ctx.stroke();
			}
			ctx.restore();
		}
		// dashed line END 

		// production number
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "16px Lucida Console";
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff";
		ctx.strokeText(ships, x, y+2, r2);
		ctx.fillText(ships, x, y+2, r2);
	}
}
