
// galcon.stage

{
	init() {
		// fast references
		let el = window.find(`div[data-area="stage"]`);
		this.els = {
			el,
			canvas: el.find("canvas"),
		};
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.stage,
			selected,
			el;
		//console.log(event);
		switch (event.type) {
			case "generate-map":
				Main.planets = [];
				Main.generateMap();
				GameUI.render();
				break;
			case "select-planet":
				el = $(event.target);
				selected = Self.els.el.find(".planet-outline.selected");
				if (el.hasClass("planet-outline")) {
					if (selected.length) {
						// let from = selected.map(e => Main.getPlanet(e.getAttribute("data-id"))),
						let from = Main.getPlanet(selected.data("id")),
							to = Main.getPlanet(el.data("id")),
							ship_num = 10;
						Main.allships.LaunchShips(0, 0, from, to, ship_num);
						// reset
						return selected.removeClass("selected");
					}
					el.addClass("selected");
				} else {
					selected.removeClass("selected");
				}
				// Main.allships.AddShip(event.offsetX, event.offsetY, Main.planets[2]);
				break;
		}
	}
}
