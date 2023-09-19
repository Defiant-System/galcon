
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
		this.els.el.on("mouseover mouseout", ".planet-outline", this.dispatch);
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.stage,
			selected,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// native events
			case "mouseover":
				event.target.classList.add("hover");
				break;
			case "mouseout":
				event.target.classList.remove("hover");
				break;
			// custom events
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
				GameUI.render();
				break;
			case "select-planet":
				// return Fx.explode(event.offsetX, event.offsetY);
				// return Main.allships.AddShip(event.offsetX, event.offsetY, Main.planets[2]);
				
				el = $(event.target);
				selected = Self.els.el.find(".planet-outline.selected");
				if (el.hasClass("planet-outline")) {
					if (selected.length) {
						// let from = selected.map(e => Main.getPlanet(e.getAttribute("data-id"))),
						let from = Main.getPlanet(selected.data("id")),
							to = Main.getPlanet(el.data("id")),
							ship_num = from.ships * .75;
						Main.allships.LaunchShips(from, to, ship_num);

						Fx.line(from, to);

						// reset
						return selected.removeClass("selected");
					} else if (el.hasClass("mine")) {
						el.addClass("selected");
					}
				} else {
					selected.removeClass("selected");

					Fx.clearLines();
				}
				break;
		}
	}
}
