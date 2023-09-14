
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
			case "insert-ship":
				let point = new Point(event.offsetX, event.offsetY);
				Main.allships.push(new Ship(point, Main.planets[2]));
				break;
			case "pause-game":
				// stops loop
				Game._paused = true;
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = galcon;
