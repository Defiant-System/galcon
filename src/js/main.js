
@import "./classes/misc.js"
@import "./classes/planet.js"


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
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = galcon;
