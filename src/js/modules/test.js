
let Test = {
	init(APP) {
		
		setTimeout(() => {
			let source = Main.planets[0],
				target = Main.planets[2],
				ship_num = 15;
			Main.allships.LaunchShips(null, null, source, target, ship_num);
		}, 1000);

		setTimeout(() => Game._paused = true, 20e3);

	}
};
