
class Planet {
	constructor(x, y, production, owner, id, texture) {
		let zradius = 0,
			attacker = 0,
			selected = false,
			hover_select = false,
			takeover = false,
			local_game = true,
			attack_timer = 0,
			initialized = false;
		
		this.id = id;
		this.pos = new Point(Math.floor(x), Math.floor(y));
		this.zpos = new Point();
		this._owner = owner;
		this.color = Palette[owner].color;
		this.opacity = Palette[owner].opacity;
		this.texture = Surface.maps[texture];
		this.production = production;
		this.ships = this.owner !== 2 ? Math.max(Math.min(production, 65), 15) : production;
		this.radius = 15 + Math.round(this.production * .2);

		this.tilt = ((Math.random() * 90) - 45) | 0;
		this.speed = (Math.random() * 3) - 1.5;
		this.rotation = 0;
		this.rotation_max = 0;

		this.Tick();
	}

	get owner() {
		return this._owner;
	}

	set owner(v) {
		this.color = Palette[v].color;
		this.opacity = Palette[v].opacity;
		this._owner = v;
	}

	Tick() {
		// rotate planet
		this.rotation += this.speed;
		if (!this.rotation_max && Surface.texture[this.texture]) {
			let ratio = Surface.texture[this.texture].width / Surface.texture[this.texture].height;
			this.rotation_max = (ratio * (this.radius * 2)) | 0;
		}
		if (this.speed > 0 && this.rotation > this.rotation_max) this.rotation = 0;
		if (this.speed < 0 && this.rotation < -this.radius * 4) this.rotation = this.rotation_max;
		if (this._owner !== 2) {
			// update shap count
			this.ships += this.production / 1000;
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
				let el = galcon.stage.els.el.find(`.planet-outline[data-id="${this.id}"]`);
				el.removeClass("neutral enemy mine").addClass("mine");
			}
			// explosion effect
			Fx.explode(ship.pos._x, ship.pos._y);
			// sound effect
			window.audio.play("blast");
		}
	}
}
