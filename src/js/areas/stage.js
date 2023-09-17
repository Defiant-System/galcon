
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
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "generate-map":
				Main.planets = [];
				Main.generateMap();
				GameUI.render();
				break;
			case "select-planet":
				let el = $(event.target);
				if (el.hasClass("planet-outline")) {
					el.addClass("selected");
				} else {
					Self.els.el.find(".planet-outline.selected").removeClass("selected");
				}
				// Main.allships.AddShip(event.offsetX, event.offsetY, Main.planets[2]);
				break;
		}
	}
}
