
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
			r = p.radius,
			x = p.pos._x,
			y = p.pos._y,
			r2 = r << 1,
			r0 = 1,
			r1 = r * 1.25,
			x0 = x - (r * .25),
			y0 = y - (r * .25),
			x1 = x0,
			y1 = y0,
			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		
		gradient.addColorStop(0, "#fff");
		gradient.addColorStop(.35, "#999");
		gradient.addColorStop(1, "#555");

		ctx.save();
		// ctx.translate(x, y);
		// ctx.rotate((p.tilt * Math.PI) / 180);
		// ctx.translate(-x, -y);

		// ctx.beginPath();
		// ctx.arc(x, y, r, 0, tau, true);
        // ctx.clip();

        if (Surface.texture[p.texture]) {
        	let img = Surface.texture[p.texture],
        		ratio = img.width / img.height,
        		tH = r2,
        		tW = tH * ratio;
			ctx.drawImage(img, x - r - p.rotation, y - r, tW, tH);
		}

		// ctx.globalCompositeOperation = "soft-light";
		ctx.globalCompositeOperation = "multiply";
		// ctx.globalCompositeOperation = "screen";
		// ctx.globalAlpha = .75;
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
		ctx.fill();
		
		// ctx.globalAlpha = .5;
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
		ctx.fill();

		ctx.restore();

		// production number
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff";
		ctx.strokeText(ships, x, y+2, r2);
		ctx.fillText(ships, x, y+2, r2);
	}
};
