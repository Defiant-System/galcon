
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
				Self.els.content.removeClass("success failure get-ready").data({ show: "intro" });

				if (Self.starfield) Self.starfield.start();
				else {
					// FPS control
					Self.starfield = karaqu.FpsControl({
						fps: 60,
						callback() {
							// render starfield
							Starfield.render();
						},
					});
					// start fps loop
					Self.starfield.start();
				}
				break;
			case "start-tutorial":
				// make sure correct view is shown
				Self.els.content.removeClass("success failure get-ready").data({ show: "tutorial" });

				value = event.arg || "step-1";
				// show "step"
				Self.els.tutorial.attr({ "class": "show-"+ value });
				// reset planets
				Main.planets = [];
				// reset stage selected
				APP.stage.selected = [];
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
								Self.els.stage.removeClass("fadein fadeout");
								Self.dispatch({ type: "new-game", arg: "classic" });
								break;
						}
					});

				});
				break;
			case "new-game":
				// get arg
				value = event.arg || $(event.target).data("arg");
				// make sure correct view is shown
				Self.els.content.removeClass("success failure get-ready").data({ show: "stage" });
				// proxy event
				Self.dispatch({ ...event, type: "start-"+ value });
				return true;
			case "start-classic":
				Self.els.content.addClass("get-ready");
				return;
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
				GameUI.loop(looser => {
					// fireworks or not
					let name = looser.type === "ai" ? "success" : "failure";
					Self.els.content.addClass(name);
				});
				break;
			case "start-stealth": break;
			case "start-3-way": break;
		}
	}
}
