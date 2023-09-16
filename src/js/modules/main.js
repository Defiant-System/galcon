
let Main = {
	init() {
		this.grand = 0;
		this.rseed = Math.random() * 8388607 + 24478357;
		this.planet_count = 10;

		this.winzoom = 1;
		this.winwidth = Game.width;
		this.winheight = Game.height;

		this.mission_seed = 0;
		this.playfield_zoom = 1;
		this.playfield_center = new Point(this.winwidth / 2, this.winheight / 2);

		// create planets
		this.planets = [];
		// level.planets.map(p => this.planets.push(new Planet(...p)));
		this.generateMap();

		// create shipsets
		let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		this.allships = new Shipset(rect, this.planets);
	},
	generateMap() {
		let ship_radius = Ship.radius * 2;

		[...Array(this.planet_count)].map((e, id) => {
			let x = 40 + this.prand() * (this.winwidth / this.playfield_zoom - 80),
				y = 60 + this.prand() * (this.winheight / this.playfield_zoom - 120),
				production = this.prand() * 100,
				owner = 0,
				texture = 0;
			this.planets.push(new Planet(x, y, production, owner, id, texture));
		});

		this.planets.map(p1 => {
			this.planets.map(p2 => {
				if (p1 === p2) return;
				if (p1.pos.distance(p2.pos) < p1.radius + p2.radius + ship_radius) {
					let p3 = p1.radius > p2.radius ? p2 : p1;
					p3.pos = this.findEmtpySpace(p3, ship_radius);
				}
			});
		});
	},
	findEmtpySpace(planet, ship_radius) {
		let nX = 40 + this.prand() * (this.winwidth / this.playfield_zoom - 80),
			nY = 60 + this.prand() * (this.winheight / this.playfield_zoom - 120),
			nPos = new Point(nX, nY),
			empty = true;
		
		this.planets.map(p1 => {
			if (p1 === planet || !empty) return;
			if (p1.pos.distance(nPos) < p1.radius + planet.radius + ship_radius) {
				empty = false;
			}
		});
		return empty ? nPos : this.findEmtpySpace(planet, ship_radius);
	},
	prand() {
		[...Array(25)].map(e => this.prandi());
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
