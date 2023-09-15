
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
		this.planets.push(new Planet(250, 180, 30, 0, 1, 0));
		this.planets.push(new Planet(400, 260, 40, 0, 1, 1));
		this.planets.push(new Planet(540, 340, 5, 0, 1, 2));

		// create shipsets
		let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		this.allships = new Shipset(rect, this.planets);

		let source = this.planets[0],
			target = this.planets[2],
			percent = .5;
		this.allships.LaunchShips(null, null, source, target, percent);
	}
};
