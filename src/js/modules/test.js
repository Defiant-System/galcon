
let Test = {
	init(APP) {
		
		// setTimeout(() => window.find(`.toolbar-tool_[data-arg="classic"]`).trigger("click"), 300);
		// setTimeout(() => window.find(`.toolbar-tool_[data-arg="tutorial"]`).trigger("click"), 300);
		setTimeout(() => APP.start.dispatch({ type: "start-tutorial", arg: "step-1" }), 300);

		// setTimeout(() => Fx.explode(150, 140), 1e3);
		setTimeout(() => {
			let from = Main.planets[0],
				to = Main.planets[1];
			Main.allships.LaunchShips(from, to, 1, .65);
		}, 1e3);

		// setTimeout(() => Fx.outline.add(Main.planets[0], Palette[Owner.HUMAN].color), 1e3);

		// setTimeout(() => window.find(".toolbar-selectbox_").trigger("mousedown"), 900);
		
		// setTimeout(() => Fx.clearLines(), 3e3);

		// setTimeout(() => GameUI.fpsControl.stop(), 1e3);
	}
};
