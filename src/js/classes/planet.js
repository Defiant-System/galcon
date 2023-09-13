
class Planet {
	constructor(x, y, production, owner, id, texture) {
		let pos = new Point(Math.floor(x), Math.floor(y));
		let zpos = new Point(),
			zradius = 0,
			attacker = 0,
			selected = false,
			hover_select = false,
			takeover = false,
			ships = 0,
			server_ships = ships,
			local_game = true,
			attack_timer = 0,
			initialized = false;
			
		this.texture = Math.max(Math.min(texture, 63), 0);
		this.production = Math.max(production, 15);
		this.radius = 12 + (this.production - 15) * (24 - 12) / (100 - 15);
	}

	Tick() {

	}

	ShipHit() {
		
	}
}
