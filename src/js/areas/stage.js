
// galcon.stage

{
	init() {
		// fast references
		let el = window.find(`div[data-area="stage"]`);
		this.els = {
			el,
			gameBg: window.find(".game-bg"),
			toolSelect: window.find(".toolbar-selectbox_ > div:first"),
			canvas: el.find("canvas"),
		};
		// bind event handlers
		this.els.el.on("mousedown mouseup mouseover mouseout", this.gameplay);
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.stage,
			selected,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "output-pgn":
				value = { planets: [] };
				Main.planets.map(p => {
					// let texture = Surface.maps.indexOf(p.texture);
					// value.planets.push([p.pos._x, p.pos._y, p.radius, p.ships, p.owner, texture])
					value.planets.push([p.pos._x, p.pos._y, p.radius, p.ships, p.owner])
				});
				console.log( JSON.stringify(value) );
				break;
			case "set-bg":
				// Self.els.gameBg.data({ bg: event.arg });
				break;
			case "generate-map":
				Main.planets = [];
				Main.generateMap();
				Main.appendHtml();
				GameUI.render();
				break;
			case "select-all-planets":
				el = $(event.target);
				if (el.hasClass("human") && el.data("id")) {
					let planet = Main.getPlanet(+el.data("id"));
					Self.selected = Self.els.el.find(".planet.human").map(el => Main.getPlanet(+el.getAttribute("data-id")));
					Self.selected.map(p => {
						Fx.outline.add(p, Palette[planet.owner].color);
						Fx.line.add(p, planet);
					});
				}
				break;
			case "unselect-planet":
				Self.selected.map((p, i) => {
					if (p.id === event.planet.id) Self.selected.splice(i, 1);
				});
				Fx.line.remove(event.planet.id);
				Fx.outline.remove(event.planet.id);
				break;
		}
	},
	selected: [],
	attack_force: .65,
	gameplay(event) {
		let APP = galcon,
			Self = APP.stage,
			planet,
			el;
		// console.log(event);
		switch (event.type) {
			case "mousedown":
				el = $(event.target);
				if (el.hasClass("planet") && el.data("id")) {
					planet = Main.getPlanet(+el.data("id"));

					if (Self.selected.find(p => p.id === planet.id)) {
						Fx.outline.remove(planet);
						Self.selected.map((p, i) => {
							if (p.id === planet.id) Self.selected.splice(i, 1);
						});
						return;
					}
					
					Self.selected.push(planet);
					if (planet.owner !== Owner.HUMAN) {
						let fleet_id = Main.allships.fleet_id++;
						for (let i=0, il=Self.selected.length-1; i<il; i++) {
							let source = Self.selected[i],
								target = Self.selected[il];
							Main.allships.LaunchShips(source, target, fleet_id, Self.attack_force);
						}
						Self.selected = [];
						Fx.clearLines();
						return;
					}
					Fx.outline.add(planet, Palette[planet.owner].color);
					// save "drag" planet
					Self.drag = { el };
				} else {
					Self.selected = [];
					Fx.clearLines();
				}
				break;
			case "mouseup":
				el = $(event.target);
				if (el.hasClass("planet") && Self.drag && Self.drag.el[0] !== el[0]) {

					let planet = Main.getPlanet(+el.data("id")),
						fleet_id = Main.allships.fleet_id++;
					
					Self.selected.push(planet);

					for (let i=0, il=Self.selected.length-1; i<il; i++) {
						let source = Self.selected[i],
							target = Self.selected[il];
						Main.allships.LaunchShips(source, target, fleet_id, Self.attack_force);
					}
					Self.selected = [];
					Fx.clearLines();

					delete Self.drag;
				}
				break;
			case "mouseover":
				el = $(event.target);
				if (el.data("id") && Self.selected.length) {
					planet = Main.getPlanet(+el.data("id"));
					// Fx.outline.add(planet, Palette[Owner.HUMAN].color);
					Self.selected.map(p => Fx.line.add(p, planet));
				}
				break;
			case "mouseout":
				el = $(event.target);
				if (el.data("id")) {
					planet = Main.getPlanet(+el.data("id"));
					if (!Self.selected.includes(planet)) {
						Fx.outline.remove(+el.data("id"));
					}
					// remove all lines
					Fx.clearLines("line");
				}
				break;
		}
	}
}
