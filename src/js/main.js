
@import "./pgn/tutorial.js"

@import "./classes/misc.js"
@import "./classes/ai.js"
@import "./classes/gridcell.js"
@import "./classes/shipset.js"
@import "./classes/ship.js"
@import "./classes/fleet.js"
@import "./classes/planet.js"

@import "./modules/main.js"
@import "./modules/fx.js"
@import "./modules/starfield.js"
@import "./modules/namegen.js"
@import "./modules/gameui.js"
@import "./modules/surface.js"
@import "./modules/test.js"


const galcon = {
	init() {
		// fast references
		this.content = window.find("content");

		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
		Fx.init();
		Main.init();
		Starfield.init();
		Surface.init();
		GameUI.init();

		// turn off audio temporarily
		window.audio.mute = true;

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
				return Self.stage.dispatch({ type: "pause-game" });
			case "toggle-fps":
			case "generate-map":
			case "set-attack-fleet":
				return Self.stage.dispatch(event);
			case "start-tutorial":
			case "new-game":
				return Self.start.dispatch(event);
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
	start: @import "./areas/start.js",
	stage: @import "./areas/stage.js",
};

window.exports = galcon;
