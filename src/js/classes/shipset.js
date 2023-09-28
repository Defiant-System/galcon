
class Shipset {
	constructor(planets, stealth) {
		this.tree = new Quadtree({ x: 0, y: 0, width: GameUI.width, height: GameUI.height });
		this.fleets = [];
		this._allships = [];
		this._stealth = stealth;
		this.fleet_id = 1; // just a counter
	}

	map(func) {
		return this._allships.map(func);
	}

	AddShip(x, y, planet, fleet_id, owner, value) {
		let ship = new Ship(x, y, planet, fleet_id, owner, value, this._stealth);
		this._allships.push(ship);
		return true;
	}

	RemoveShip(ship) {
		let index = this._allships.indexOf(ship);
		this._allships.splice(index, 1);
	}

	LaunchShips(source, target, fleet_id, percentage) {
		if (source.ships < 1) return;
		let ship_num = source.ships * percentage;
		if (ship_num > source.ships) ship_num = source.ships;
		if (ship_num < 1) ship_num = 1;

		source.ships = source.ships - ship_num;
		if (source.ships < 0) source.ships = 0;

		var _loc_10 = ship_num;
		ship_num = Math.min(ship_num, Math.sqrt(_loc_10 * 21));
		ship_num = Math.max(ship_num, 1);

		var _loc_11 = _loc_10 / ship_num;
		var _loc_15 = Math.sqrt(ship_num) * 6;
		var _loc_16 = target.pos.clone().subtract(source.pos);
		_loc_16.normalize(source.radius + _loc_15 / 6);
		_loc_16 = _loc_16.add(source.pos);
		let _loc_12 = 0;
		let owner = source.owner;

		while (_loc_12 < ship_num) {
			let _loc_13 = Math.random() * Math.PI * 2;
			let _loc_14 = Math.random() * _loc_15;

			let x = _loc_16._x + Math.cos(_loc_13) * _loc_14,
				y = _loc_16._y + Math.sin(_loc_13) * _loc_14;
			if (!this.AddShip(x, y, target, fleet_id, owner, _loc_11)) {
				source.ships += _loc_11;
			}
			_loc_12++;
		}
		// sound effect
		window.audio.play("launch");
	}

	RedirectFleet(fleet_id, planet) {
		console.log( "redirect fleet to:", fleet_id );
	}
}
