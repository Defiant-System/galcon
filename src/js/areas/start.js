
// galcon.start

{
	init() {
		// fast references
		let content = window.find("content");
		this.els = {
			content,
			tutorial: content.find(`> div[data-area="tutorial"]`),
			step1: content.find(".step-1"),
			step2: content.find(".step-2"),
			step3: content.find(".step-3"),
		};
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.start,
			value,
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
				value = event.arg || "step-1";
				// show "step"
				Self.els.tutorial.attr({ "class": "show-"+ value });
				// reset planets
				Main.planets = [];
				// plot tutorial map
				tutorial[value].planets.map(p => Main.planets.push(new Planet(...p)));
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets);
				// start game loop
				GameUI.loop(() => {
					let [tut, num] = value.split("-");
					Self.els.tutorial.cssSequence("fadeout", "transitionend", el => {
						console.log(el);
					});
				});
				break;
			case "start-classic":
				// reset planets
				Main.planets = [];
				// generate random map
				Main.generateMap();
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets);
				// create game AI
				Main.ai = new AI(1, Mission.CLASSIC, Main);
				// start game loop
				GameUI.loop(() => {
					console.log("Game over");
				});
				break;
			case "start-stealth": break;
			case "start-3-way": break;
		}
	}
}
