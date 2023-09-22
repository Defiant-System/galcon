
// galcon.start

{
	init() {
		// fast references
		let content = window.find("content");
		this.els = {
			content,
			stage: content.find(`> div[data-area="stage"]`),
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
			case "intro-view":
				// make sure correct view is shown
				Self.els.content.removeClass("success").data({ show: "intro" });
				break;
			case "start-tutorial":
				// make sure correct view is shown
				Self.els.content.removeClass("success").data({ show: "tutorial" });

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
				// fade in stage
				if (Self.els.stage.hasClass("fadeout")) {
					Self.els.stage.cssSequence("fadein", "transitionend", el =>
						el.removeClass("fadeout fadein"));
				}
				// start game loop
				GameUI.loop(() => {
					let [tut, num] = value.split("-");
					num++;
					Self.els.stage.addClass("fadeout");

					Self.els.tutorial.cssSequence("switch-fade", "transitionend", el => {
						if (!el.hasClass("switch-fade")) return;
						switch (num) {
							case 1:
								break;
							case 2:
								Self.dispatch({ type: "start-tutorial", arg: "step-2" });
								break;
							case 3:
								Self.dispatch({ type: "start-tutorial", arg: "step-3" });
								break;
							case 4:
								console.log("start classic game");
								break;
						}
					});

				});
				break;
			case "new-game":
				// make sure correct view is shown
				Self.els.content.removeClass("success").data({ show: "stage" });
				// proxy event
				Self.dispatch({ ...event, type: "start-"+ event.arg });
				return true;
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
					// fireworks
					Self.els.content.addClass("success");
				});
				break;
			case "start-stealth": break;
			case "start-3-way": break;
		}
	}
}
