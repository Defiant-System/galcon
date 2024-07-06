
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

				// if (Self.starfield) Self.starfield.start();
				// else {
				// 	// FPS control
				// 	Self.starfield = karaqu.FpsControl({
				// 		fps: 60,
				// 		callback() {
				// 			// render starfield
				// 			Starfield.render();
				// 		},
				// 	});
				// 	// start fps loop
				// 	Self.starfield.start();
				// }
				break;
			case "start-tutorial":
				// make sure correct view is shown
				Self.els.content.removeClass("success failure get-ready").data({ show: "tutorial" });

				value = event.arg || "step-1";
				// show "step"
				Self.els.tutorial.attr({ "class": "show-"+ value });
				// reset planets
				Main.ai = [];
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
								// show dock
								APP.dock.els.ul.removeClass("autohide");
								break;
							case 4:
								Self.els.stage.removeClass("fadein fadeout");
								Self.dispatch({ type: "new-game", arg: "classic" });
								break;
						}
					});
				});
				// start loop
				GameUI.fpsControl.start();
				break;
			case "show-get-ready-view":
				// show "get-ready view"
				Self.els.content.addClass("get-ready");
				// disable dock / pause button
				APP.dock.els.ul.find(`li[data-click="toggle-play"]`).addClass("disabled");
				break;
			case "hide-get-ready-view":
				// enable dock / pause button
				APP.dock.els.ul.find(`li[data-click="toggle-play"]`).addClass("disabled");
				// auto-hide dock
				APP.dock.els.ul.addClass("autohide");
				// show "get-ready view"
				Self.els.content.removeClass("get-ready");
				break;
			case "ready-start-game":
				// show "get-ready view"
				Self.dispatch({ type: "hide-get-ready-view" });
				// start game loop
				GameUI.fpsControl.start();
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
				// create game AI
				Main.ai = [new AI(2)];
				// reset planets
				Main.planets = [];
				// generate random map
				Main.generateMap();
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets);
				// start game loop
				GameUI.loop(looser => {
					// fireworks or not
					let name = looser.type === "ai" ? "success" : "failure";
					Self.els.content.addClass(name);
					APP.dock.els.ul.removeClass("autohide");
				});
				// show "get-ready view"
				Self.dispatch({ type: "show-get-ready-view" });
				break;
			case "start-stealth":
				// create game AI
				Main.ai = [new AI(2)];
				// reset planets
				Main.planets = [];
				// generate random map
				Main.generateMap();
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets, true); // second param is for "stealth"
				// start game loop
				GameUI.loop(looser => {
					// fireworks or not
					let name = looser.type === "ai" ? "success" : "failure";
					Self.els.content.addClass(name);
					APP.dock.els.ul.removeClass("autohide");
				});
				// show "get-ready view"
				Self.dispatch({ type: "show-get-ready-view" });
				break;
			case "start-3-way":
				// create game AI
				Main.ai = [new AI(2), new AI(3)];
				// reset planets
				Main.planets = [];
				// generate random map
				Main.generateMap();
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets);
				// start game loop
				GameUI.loop(looser => {
					// fireworks or not
					let name = looser.type === "ai" ? "success" : "failure";
					Self.els.content.addClass(name);
					APP.dock.els.ul.removeClass("autohide");
				});
				// show "get-ready view"
				Self.dispatch({ type: "show-get-ready-view" });
				break;
			case "test-map":
				// make sure correct view is shown
				Self.els.content.removeClass("success failure get-ready").data({ show: "stage" });
				// create game AI
				Main.ai = (testMap.ais || []).map(a => new AI(a));;
				// reset planets
				Main.planets = [];
				// plot tutorial map
				testMap.planets.map(p => Main.planets.push(new Planet(...p)));
				Main.appendHtml();
				// create shipsets
				Main.allships = new Shipset(Main.planets);
				// add ships, if any
				(testMap.ships || []).map(s => {
					s[2] = Main.planets[s[2]];
					Main.allships.AddShip(...s);
				});
				// start game loop
				GameUI.loop(looser => {
					// fireworks or not
					let name = looser.type === "ai" ? "success" : "failure";
					Self.els.content.addClass(name);
					APP.dock.els.ul.removeClass("autohide");
				});
				// start loop
				GameUI.fpsControl.start();
				break;
		}
	}
}
