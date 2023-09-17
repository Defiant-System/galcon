
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
		this.texture = Surface.textures[texture];
		this.production = Math.max(production, 15);
		this.ships = this.production;
		this.radius = 15 + Math.round(this.production * .3);

		this.tilt = (Math.random() * 90) | 0;
		// this.speed = ((Math.random() * 10) | 0) / 10;
		this.speed = 1;
		this.rotation = 22;

		this.Tick();
	}

	Tick() {
		if (GameUI.mode !== "dev") {
			// render surface
			Surface.render(this);
			// this.surface = Surface.ctx.getImageData(0, 0, 150, 150);
			this.surface = Surface.getData();
		}
		// rotate planet
		this.rotation += this.speed;
		// update shap count
		this.ships = this.ships + (this.production / 400);
	}

	ShipHit(ship) {
		this.ships += 1;
	}
}
