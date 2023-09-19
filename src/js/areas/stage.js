
// galcon.stage

{
	init() {
		// fast references
		let el = window.find(`div[data-area="stage"]`);
		this.els = {
			el,
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
			case "pause-game":
				value = Self.els.el.hasClass("paused");
				Self.els.el.toggleClass("paused", value);
				// stops loop
				GameUI.fpsControl.stop();
				break;
			case "output-pgn":
				value = { planets: [] };
				Main.planets.map(p => {
					let texture = Surface.maps.indexOf(p.texture);
					value.planets.push([p.pos._x, p.pos._y, p.production, p.owner, p.id, texture])
				});
				console.log( JSON.stringify(value) );
				break;
			case "generate-map":
				Main.planets = [];
				Main.generateMap();
				Main.appendHtml();
				GameUI.render();
				break;
		}
	},
	selected: [],
	gameplay(event) {
		let APP = galcon,
			Self = APP.stage,
			Drag = Self.drag,
			planet,
			el;
		// console.log(event);
		switch (event.type) {
			case "mousedown":
				el = $(event.target);
				if (el.hasClass("planet-disc") && el.data("id")) {
					planet = Main.getPlanet(+el.data("id"));
					
					Self.selected.push(planet);
					if (Self.selected.length === 2) {
						let source = Self.selected[0],
							target = Self.selected[1],
							percentage = .5;
						Main.allships.LaunchShips(source, target, percentage);

						Self.selected = [];
						Fx.clearLines();
						return;
					}

					Fx.outline.add(planet, Palette[planet.owner].color);
				} else {
					Self.selected = [];
					Fx.clearLines();
				}
				break;
			case "mouseup":
				break;
			case "mouseover":
				el = $(event.target);
				if (el.data("id")) {
					planet = Main.getPlanet(+el.data("id"));
					Fx.outline.add(planet, Palette[0].color);

					if (Self.selected.length) {
						Fx.line.add(Self.selected[0], planet);
					}
				}
				break;
			case "mouseout":
				el = $(event.target);
				if (el.data("id")) {
					planet = Main.getPlanet(+el.data("id"));
					if (!Self.selected.includes(planet)) {
						Fx.outline.remove(+el.data("id"));
					}
				}
				break;
		}
	}
}
