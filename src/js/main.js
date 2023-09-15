
@import "./pgn/tutorial.js"

@import "./classes/misc.js"
@import "./classes/gridcell.js"
@import "./classes/shipset.js"
@import "./classes/ship.js"
@import "./classes/fleet.js"
@import "./classes/planet.js"


@import "./modules/main.js"
@import "./modules/game.js"
@import "./modules/test.js"


const galcon = {
	init() {
		// fast references
		this.content = window.find("content");

		Game.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		switch (event.type) {
			case "window.init":
				break;
			case "window.keystroke":
				if (event.char !== "space") return;
				/* falls through */
			case "pause-game":
				// stops loop
				Game.fpsControl.stop();
				break;
			case "insert-ship":
				Main.allships.AddShip(event.offsetX, event.offsetY, Main.planets[2]);
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = galcon;
