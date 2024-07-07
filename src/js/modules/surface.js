
let Surface = {
	ready: false,
	texture: {},
	maps: "astroid gaia gas_giant hoth ixchel jupiter mars mercury moon muunilinst pluto quom saturn sun tatooine venus".split(" "),
	init() {
		this.rot = 0;
		this.images = [...this.maps];
		this.loadTextures();
	},
	loadTextures() {
		let Self = this,
			name = Self.images.pop(),
			request = new Request( `~/img/${name}.jpg`);
		fetch(request).then(async resp => {
			let blob = await resp.blob(),
				img = await createImageBitmap(blob);

			// image to be used in "draw"
			Self.texture[name] = img;

			if (Self.images.length) Self.loadTextures();
			else Self.ready = true;
		});
	},
	render(ctx, p) {
		
	}
};
