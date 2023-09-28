
class Planet {
	constructor(x, y, radius, ships, owner, texture) {
		this.id = Main.planets.length + 1;
		this.pos = new Point(x, y);
		this.zpos = new Point();
		this._owner = owner;
		this.color = Palette[owner].color;
		this.texture = Surface.maps[texture];
		this.width =
		this.height = radius * 2;
		this.radius = radius;
		this.ships = ships;
		this.production = radius / 200;
		
		this.tilt = ((Math.random() * 90) - 45) | 0;
		this.speed = (Math.random() * 3) - 1.5;
		this.aura = 0;
		this.aura_step = owner === Owner.HUMAN ? .015 : -.015;
		this.rotation = 0;
		this.rotation_max = 0;

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

	Tick() {
		// aura / dashed line
		this.aura += this.aura_step;
		// rotate planet
		this.rotation += this.speed;
		if (!this.rotation_max && Surface.texture[this.texture]) {
			let ratio = Surface.texture[this.texture].width / Surface.texture[this.texture].height;
			this.rotation_max = (ratio * (this.radius * 2)) | 0;
		}
		if (this.speed > 0 && this.rotation > this.rotation_max) this.rotation = 0;
		if (this.speed < 0 && this.rotation < -this.radius * 4) this.rotation = this.rotation_max;
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
}
