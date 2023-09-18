
let Surface = {
	texture: {},
	maps: "astroid gaia gas_giant hoth ixchel jupiter mars mercury moon muunilinst pluto quom saturn sun tatooine venus".split(" "),
	init() {
		this.images = [...this.maps];
		this.loadTextures();
	},
	loadTextures() {
		let name = this.images.pop(),
			img = new Image();
		img.onload = () => {
			this.texture[name] = img;
			if (this.images.length) this.loadTextures();
		};
		img.src = `~/img/${name}.jpg`;
	},
	render(ctx, p) {
		let tau = Math.PI * 2,
			ships = Math.round(p.ships),
			r2 = p.radius << 1,
			r0 = 1,
			r1 = p.radius * 1.25,
			x0 = p.pos._x - (p.radius * .25),
			y0 = p.pos._y - (p.radius * .25),
			x1 = x0,
			y1 = y0,
			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		gradient.addColorStop(0, "#ccc");
		gradient.addColorStop(.35, "#777");
		gradient.addColorStop(1, "#222");

		ctx.save();
		ctx.beginPath();
		ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
        ctx.clip();
        if (Surface.texture[p.texture]) {
			ctx.drawImage(Surface.texture[p.texture], p.pos._x - p.radius, p.pos._y - p.radius, p.radius * 2, p.radius * 2);
		}

		ctx.globalCompositeOperation = "hard-light";
		// ctx.globalCompositeOperation = "multiply";
		// ctx.globalAlpha = .75;
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
		ctx.fill();
		
		// ctx.globalAlpha = .5;
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(p.pos._x, p.pos._y, p.radius, 0, tau, true);
		ctx.fill();
		ctx.restore();

		// production number
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff";
		ctx.strokeText(ships, p.pos._x, p.pos._y+2, r2);
		ctx.fillText(ships, p.pos._x, p.pos._y+2, r2);
	}
};
