
let Test = {
	init(APP) {
		
		// setTimeout(() => {
		// 	let source = Main.planets[0],
		// 		target = Main.planets[2],
		// 		owner = source.owner,
		// 		fleet_id = 1,
		// 		ship_num = 15;
		// 	Main.allships.LaunchShips(owner, fleet_id, source, target, ship_num);
		// }, 1000);

		setTimeout(() => Game.fpsControl.stop(), 1e3);

		// setTimeout(() => {
		// 	let planet = {
		// 			tilt: 25,
		// 			speed: 10,
		// 			radius: 50,
		// 			rotation: 22,
		// 			texture: "alien",
		// 		};
		// 	Surface.render(planet);
		// }, 1e3);
	}
};
