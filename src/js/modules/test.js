
let Test = {
	init(APP) {
		
		setTimeout(() => {
			let source = Main.planets[0],
				target = Main.planets[2],
				owner = source.owner,
				fleet_id = 1,
				ship_num = 15;
			Main.allships.LaunchShips(owner, fleet_id, source, target, ship_num);
		}, 1000);

		setTimeout(() => Game.fpsControl.stop(), 20e3);

	}
};
