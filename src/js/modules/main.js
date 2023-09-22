
let Owner = {
		NEUTRAL: 0,
		HUMAN: 1,
		AI: 2,
	};

let Palette = [
		{ color: "#aaaaaa", name: "neutral" },
		{ color: "#5577ee", name: "human" },
		{ color: "#ff3333", name: "ai" },
	];

let Mission = {
		CLASSIC: 0,
		STEALTH: 1,
		VACUUM: 2,
		BEAST: 3,
		THREEWAY: 4,
	};

let Main = {
	init() {
		this.grand = 0;
		this.rseed = Math.random() * 8388607 + 24478357;
		this.planet_count = 18;
	},
	generateMap(ai=1) {
		let ship_radius = Ship._radius << 1,
			planet_count = this.planet_count - ai - 1; // 1 player + AI(s)
		// basic random map
		[...Array(planet_count)].map(e => this.createPlanet(Owner.NEUTRAL));
		// insert play planet
		this.createPlanet(Owner.HUMAN, 50, null, 90);
		// insert AI planet
		this.createPlanet(Owner.AI, GameUI.width - 50, null, 90);
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
	createPlanet(owner, px, py, pp) {
		let m = 70,
			x = px || m + this.prand() * (GameUI.width - (m * 2)),
			y = py || m + this.prand() * (GameUI.height - (m * 2)),
			ships = pp || 3 + this.prand() * 29,
			radius = Math.min(23 + (ships * .75), 31) | 0,
			texture = Math.random() * Object.keys(Surface.maps).length | 0;
		this.planets.push(new Planet(x, y, radius, ships, owner, texture));
	},
	getPlanet(id) {
		return this.planets.find(p => p.id === +id);
	},
	appendHtml() {
		let APP = galcon,
			divs = [];
		// DIV hoverelements
		this.planets.map((p, i) => {
			let y = p.pos._y - p.radius,
				x = p.pos._x - p.radius,
				d = p.radius << 1;
			divs.push(`<div class="planet ${Palette[p.owner].name}" data-id="${p.id}" style="width: ${d}px; height: ${d}px; top: ${y}px; left: ${x}px;"></div>`);
		});
		APP.stage.els.el.find(".planet").remove();
		APP.stage.els.el.append(divs.join(""));
	},
	findEmtpySpace(planet, ship_radius) {
		let nX = 40 + this.prand() * (GameUI.width - 80),
			nY = 60 + this.prand() * (GameUI.height - 120),
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
