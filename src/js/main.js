
@import "./pgn/tutorial.js"

@import "./classes/misc.js"
@import "./classes/gridcell.js"
@import "./classes/shipset.js"
@import "./classes/ship.js"
@import "./classes/fleet.js"
@import "./classes/planet.js"

@import "./modules/main.js"
@import "./modules/fx.js"
@import "./modules/gameui.js"
@import "./modules/glMatrix.js"
@import "./modules/surface.js"
@import "./modules/test.js"


const galcon = {
	init() {
		// fast references
		this.content = window.find("content");

		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
		Surface.init();
		GameUI.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = galcon,
			el;
		// console.log(event);
		switch (event.type) {
			case "window.init":
				break;
			case "window.keystroke":
				if (event.char !== "space") return;
				/* falls through */
			case "pause-game":
				// stops loop
				GameUI.fpsControl.stop();
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			default:
				el = event.el || (event.origin ? event.origin.el : null);
				if (el) {
					let rEl = el.data("area") ? el : el.parents("[data-area]"),
						area = rEl.data("area");
					if (area) {
						return Self[area].dispatch(event);
					}
				}
		}
	},
	stage: @import "./areas/stage.js",
};

window.exports = galcon;
