
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
		this.planets.push(new Planet(250, 180, 35, 0, 1, 0));

		// create shipsets
		// let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		// this.allships = new Shipset(rect, this.planets);

		this.allships = [];

		let point = new Point(100, 100),
			planet = this.planets[0];
		this.allships.push(new Ship(point, planet));
	}
};
