
class Shipset {
	constructor(area, planets) {
		this._allships = [];
		// this.AddShip(new Ship(new Point(420, 340), Main.planets[2]));
		this.AddShip(new Ship(new Point(150, 140), Main.planets[2]));
		this.AddShip(new Ship(new Point(110, 150), Main.planets[2]));

	}

	map(func) {
		return this._allships.map(func);
	}

	AddShip(ship) {
		this._allships.push(ship);
	}

	RemoveShip(ship) {
		let index = this._allships.findIndex(s => s == this);
		this._allships.splice(index, 1);
	}

	LaunchShips(owner, fleet_id, source, target, percent) {

	}
}
