
class Shipset {
	constructor(area, planets) {
		this.max_ships = 400;
		this.max_fleets = 300;

		this._allships = [];
		// this.AddShip(420, 340, Main.planets[2]);
		// this.AddShip(150, 140, Main.planets[2]);
		// this.AddShip(110, 150, Main.planets[2]);
	}

	map(func) {
		return this._allships.map(func);
	}

	AddShip(x, y, planet) {
		let ship = new Ship(new Point(x, y), planet);
		this._allships.push(ship);
        return true;
	}

	RemoveShip(ship) {
		let index = this._allships.indexOf(ship);
		this._allships.splice(index, 1);
	}

	LaunchShips(owner, fleet_id, source, target, ship_num) {
		var _loc_12 = 0;
		var _loc_13 = NaN;
		var _loc_14 = NaN;

		if (source.ships < 1) return;
		if (ship_num > source.ships) ship_num = source.ships;
		if (ship_num < 1) ship_num = 1;
		
		source.ships = source.ships - ship_num;
		if (source.ships < 0) source.ships = 0;

		var _loc_10 = ship_num;
        ship_num = Math.min(ship_num, Math.sqrt(_loc_10 * 18));
        // ship_num = Math.min(ship_num, _loc_8 - 32);
        // ship_num = Math.min(ship_num, _loc_8 * _loc_10 * 2 / _loc_9);
        ship_num = Math.max(ship_num, 1);

        var _loc_11 = _loc_10 / ship_num;
        var _loc_15 = Math.sqrt(ship_num) * 6;
        var _loc_16 = target.pos.clone().subtract(source.pos);
        _loc_16.normalize(source.radius + _loc_15 / 6);
        _loc_16 = _loc_16.add(source.pos);
        _loc_12 = 0;

        while (_loc_12 < ship_num) {
            _loc_13 = Math.random() * Math.PI * 2;
            _loc_14 = Math.random() * _loc_15;

            let x = _loc_16._x + Math.cos(_loc_13) * _loc_14,
            	y = _loc_16._y + Math.sin(_loc_13) * _loc_14;
            if (!this.AddShip(x, y, target, 1, owner, _loc_11)) {
                source.ships += _loc_11;
            }
            _loc_12++;
        }
	}
}
