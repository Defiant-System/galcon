
// galcon.start

{
	init() {
		
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.start,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "start-view":
				break;
			case "new-game":
				Self.dispatch({ ...event, type: "start-"+ event.arg });
				return true;
			case "start-tutorial":
				// reset planets
				Main.planets = [];
				// plot tutorial map
				// level.planets.map(p => Main.planets.push(new Planet(...p)));
				// Main.appendHtml();
				break;
			case "start-classic":
				// reset planets
				Main.planets = [];
				// generate random map
				Main.generateMap();
				Main.appendHtml();
				// create shipsets
				let rect = new Rectangle(0, 0, GameUI.width, GameUI.height);
				Main.allships = new Shipset(rect, Main.planets);
				// create game AI
				Main.ai = new AI(1, Mission.CLASSIC, Main);
				// start game loop
				GameUI.loop();
				break;
			case "start-stealth": break;
			case "start-3-way": break;
		}
	}
}
