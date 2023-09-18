
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
		this.owner = owner;
		this.color = Colors[owner] || "#ffffff";
		this.texture = Surface.maps[texture];
		this.production = Math.max(Math.min(production, 70), 20);
		this.ships = this.production;
		this.radius = 15 + Math.round(this.production * .3);

		this.tilt = (Math.random() * 90) | 0;
		// this.speed = ((Math.random() * 10) | 0) / 10;
		this.speed = 1;
		this.rotation = 22;

		this.Tick();
	}

	Tick() {
		// rotate planet
		this.rotation += this.speed;
		// update shap count
		this.ships += this.production / 400;
	}

	ShipHit(ship) {
		this.ships += ship.value || 1;
		// explosion effect
		Fx.explode(ship.pos._x, ship.pos._y);
		// sound effect
		window.audio.play("blast");
	}
}
