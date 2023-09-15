
let Main = {
	init() {
		this.winzoom = 1;
		this.winwidth = Game.width;
		this.winheight = Game.height;

		this.mission_seed = 0;
		this.playfield_zoom = 1;
		this.playfield_center = new Point(this.winwidth / 2, this.winheight / 2);

		// create planets
		this.planets = [];
		level.planets.map(p => this.planets.push(new Planet(...p)));

		// create shipsets
		let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		this.allships = new Shipset(rect, this.planets);

		// let source = this.planets[0],
		// 	target = this.planets[2],
		// 	ship_num = 15;
		// this.allships.LaunchShips(null, null, source, target, ship_num);
	}
};
