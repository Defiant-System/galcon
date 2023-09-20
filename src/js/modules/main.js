
let Main = {
	init() {
		this.grand = 0;
		this.rseed = Math.random() * 8388607 + 24478357;
		this.planet_count = 18;
		this.winwidth = GameUI.width;
		this.winheight = GameUI.height;

		// create planets
		this.planets = [];

		// generate random map
		this.generateMap();
		// level.planets.map(p => this.planets.push(new Planet(...p)));
		this.appendHtml();

		// create shipsets
		let rect = new Rectangle(0, 0, this.winwidth, this.winheight);
		this.allships = new Shipset(rect, this.planets);

		// create game AI
		this.ai = new AI(9, Mission.CLASSIC, this);
	},
	getPlanet(id) {
		return this.planets.find(p => p.id === +id);
	},
	generateMap() {
		let ship_radius = Ship._radius << 1;
		// basic random map
		[...Array(this.planet_count)].map((e, id) => {
			let m = 70,
				x = m + this.prand() * (this.winwidth - (m * 2)),
				y = m + this.prand() * (this.winheight - (m * 2)),
				production = 10 + (this.prand() * 40),
				texture = Math.random() * Object.keys(Surface.maps).length | 0,
				owner = 2;
			if (id === 0) {
				owner = 0;
				production = 90;
			}
			if (id === this.planet_count-1) {
				owner = 1;
				production = 90;
			}
			this.planets.push(new Planet(x, y, production, owner, id, texture));
		});
		// make sure of distance
		this.planets.map(p1 => {
			this.planets.map(p2 => {
				if (p1 === p2) return;
				if (p1.pos.distance(p2.pos) < p1.radius + p2.radius + ship_radius) {
					let p3 = p1.radius > p2.radius ? p2 : p1;
					p3.pos = this.findEmtpySpace(p3, ship_radius * 1.5);
				}
			});
		});
		// remove "floats"
		this.planets.map((p, i) => {
			p.pos._x = p.pos._x | 0;
			p.pos._y = p.pos._y | 0;
			p.radius = p.radius | 0;
		});
	},
	appendHtml() {
		let APP = galcon,
			divs = [];
		// DIV hoverelements
		this.planets.map((p, i) => {
			let y = p.pos._y - p.radius,
				x = p.pos._x - p.radius,
				d = p.radius << 1;
			divs.push(`<div class="planet-disc ${Palette[p.owner].name}" data-id="${p.id}" style="width: ${d}px; height: ${d}px; top: ${y}px; left: ${x}px;"></div>`);
		});
		APP.stage.els.el.find(".planet-disc").remove();
		APP.stage.els.el.append(divs.join(""));
	},
	findEmtpySpace(planet, ship_radius) {
		let nX = 40 + this.prand() * (this.winwidth - 80),
			nY = 60 + this.prand() * (this.winheight - 120),
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
