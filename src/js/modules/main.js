
let Main = {
	init() {
		this.grand = 0;
		this.rseed = Math.random() * 8388607 + 24478357;

		this.winzoom = 1;
		this.winwidth = Game.width;
		this.winheight = Game.height;

		this.mission_seed = 0;
		this.playfield_zoom = 1;
		this.playfield_center = new Point(this.winwidth / 2, this.winheight / 2);

		// create planets
		this.planets = [];
		// level.planets.map(p => this.planets.push(new Planet(...p)));
		this.generateMap(10);

		// create shipsets
		let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		this.allships = new Shipset(rect, this.planets);

		// let source = this.planets[0],
		// 	target = this.planets[2],
		// 	ship_num = 15;
		// this.allships.LaunchShips(null, null, source, target, ship_num);
	},
	generateMap(num) {
		[...Array(num)].map((e, id) => {
			let x = 40 + this.prand() * (this.winwidth / this.playfield_zoom - 80),
				y = 60 + this.prand() * (this.winheight / this.playfield_zoom - 120),
				production = this.prand() * 100,
				owner = 0,
				texture = 0;
			this.planets.push(new Planet(x, y, production, owner, id, texture));
		});
	},
	prand() {
		var count = 25;
        while (count--) {
            this.prandi();
        }
        return this.prandi();
	},
	prandi() {
        this.grand += 1;
        this.rseed = this.rseed << 1;
        this.rseed = this.rseed | (this.rseed & 1073741824) >> 30;
        this.rseed = this.rseed ^ (this.rseed & 614924288) >> 9;
        this.rseed = this.rseed ^ (this.rseed & 4241) << 17;
        this.rseed = this.rseed ^ (this.rseed & 272629760) >> 23;
        this.rseed = this.rseed ^ (this.rseed & 318767104) >> 10;
        return (this.rseed & 16777215) / 16777216;
	}
};
