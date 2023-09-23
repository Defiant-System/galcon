
let Test = {
	init(APP) {
		
		// setTimeout(() => window.find(`.toolbar-tool_[data-arg="classic"]`).trigger("click"), 300);
		// setTimeout(() => window.find(`.toolbar-tool_[data-arg="tutorial"]`).trigger("click"), 300);
		setTimeout(() => APP.start.dispatch({ type: "start-tutorial", arg: "step-2" }), 300);
		
		// setTimeout(() => Fx.outline.add(Main.planets[0], "#ff9900"), 500);

		// setTimeout(() => Main.allships.LaunchShips(Main.planets[0], Main.planets[1], 1, .65), 1e3);
		// setTimeout(() => Main.allships.LaunchShips(Main.planets[0], Main.planets[2], 1, .65), 1e3);

		// setTimeout(() => {
		// 	APP.stage.els.el.cssSequence("fadeout", "transitionend", el => {
		// 		el.cssSequence("fadein", "transitionend", el => {
		// 			console.log(el);
		// 		});
		// 	});
		// }, 1500);

		// setTimeout(() => {
		// 	APP.start.els.tutorial.cssSequence("fadeout", "transitionend", el => {
		// 		console.log(el);
		// 	});
		// }, 1500);

		// setTimeout(() => Fx.outline.add(Main.planets[0], Palette[Owner.HUMAN].color), 1e3);

		// setTimeout(() => window.find(".toolbar-selectbox_").trigger("mousedown"), 900);
		
		// setTimeout(() => Fx.clearLines(), 3e3);

		// setTimeout(() => GameUI.fpsControl.stop(), 1e3);
	}
};
