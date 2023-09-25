
let Owner = {
		NEUTRAL: 0,
		HUMAN: 1,
		AI: 2,
	};

let Palette = [
		{ color: "#aaaaaa", name: "neutral" },
		{ color: "#5577ee", name: "human" },
		{ color: "#ff5555", name: "ai" },
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
		this.rSeed = Math.random() * 8388607 + 24478357;
		this.planets = [];
		this.planetCount = 18;
	},
	generateMap(ai=1) {
		let shipRadius = Ship._radius << 1,
			planetCount = this.planetCount - ai - 1; // 1 player + AI(s)
		// basic random map
		[...Array(planetCount)].map(e => this.createPlanet(Owner.NEUTRAL));
		// insert play planet
		this.createPlanet(Owner.HUMAN, 50, null, 90);
		// insert AI planet
		this.createPlanet(Owner.AI, GameUI.width - 50, null, 90);
		// make sure of distance
		this.planets.map(p1 => {
			this.planets.map(p2 => {
				if (p1 === p2) return;
				if (p1.pos.distance(p2.pos) < p1.radius + p2.radius + shipRadius) {
					let p3 = p1.radius > p2.radius ? p2 : p1;
					p3.pos = this.findEmtpySpace(p3, shipRadius * 1.5);
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
		// DIV hover elements
		this.planets.map((p, i) => {
			let y = p.pos._y - p.radius,
				x = p.pos._x - p.radius,
				d = p.radius << 1;
			divs.push(`<div class="planet ${Palette[p.owner].name}" data-id="${p.id}" style="width: ${d}px; height: ${d}px; top: ${y}px; left: ${x}px;"></div>`);
		});
		APP.stage.els.el.find(".planet").remove();
		APP.stage.els.el.append(divs.join(""));

		// reset player
		let players = {};
		this.planets
			.filter(p => p.owner > 0)
			.map(p => {
				players[p.owner] = {
					losing: 0,
					ownership: 0,
					lost: false,
					type: Palette[p.owner].name,
				};
			});
		this.players = players;
	},
	findEmtpySpace(planet, shipRadius) {
		let nX = 40 + this.prand() * (GameUI.width - 80),
			nY = 60 + this.prand() * (GameUI.height - 120),
			nPos = new Point(nX, nY),
			empty = true;
		
		this.planets.map(p1 => {
			if (p1 === planet || !empty) return;
			if (p1.pos.distance(nPos) < p1.radius + planet.radius + shipRadius) {
				empty = false;
			}
		});
		return empty ? nPos : this.findEmtpySpace(planet, shipRadius);
	},
	prand() {
		[...Array(25)].map(e => this.prandi());
		return this.prandi();
	},
	prandi() {
		this.grand += 1;
		this.rSeed = this.rSeed << 1;
		this.rSeed = this.rSeed | (this.rSeed & 1073741824) >> 30;
		this.rSeed = this.rSeed ^ (this.rSeed & 614924288) >> 9;
		this.rSeed = this.rSeed ^ (this.rSeed & 4241) << 17;
		this.rSeed = this.rSeed ^ (this.rSeed & 272629760) >> 23;
		this.rSeed = this.rSeed ^ (this.rSeed & 318767104) >> 10;
		return (this.rSeed & 16777215) / 16777216;
	},
	CheckWinLose() {
		let playerKeys = Object.keys(this.players);
		// reset count
		playerKeys.map(k => this.players[k].ownership = 0);

		// count planets
		this.planets.map(p => {
			if (p.owner > 0) {
				// netural planets excluded
				this.players[p.owner].ownership++;
			}
		});

		// count ships
		Main.allships.map(s => {
			this.players[s.owner].ownership++;
		});

		playerKeys.map(k => {
			let player = this.players[k];
			if (!player.lost && player.ownership <= 0) {
				player.losing++;
				if (player.losing > 90) {
					// console.log("player lost", player);
					player.lost = true;
					return GameUI.over(player);
				}
			} else{
				player.losing = 0;
			}
		});
	}
};
