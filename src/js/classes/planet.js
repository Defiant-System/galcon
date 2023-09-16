
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
		this.texture = Math.max(Math.min(texture, 18), 0);
		this.production = Math.max(production, 15);
		this.ships = this.production;
		this.radius = 15 + Math.round(this.production * .3);

		this.tilt = 25;
		this.speed = 10;
		this.rotation = 22;
	}

	Tick() {
		this.ships = this.ships + (this.production / 400);
	}

	ShipHit(ship) {
		this.ships += 1;
	}
}
