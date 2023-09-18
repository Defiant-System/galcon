
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
			x0 = x - (r * .35),
			y0 = y - (r * .35),
			x1 = x0,
			y1 = y0,
			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		
		gradient.addColorStop(0, "#fff");
		gradient.addColorStop(.3, "#888");
		gradient.addColorStop(1, "#222");

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((p.tilt * Math.PI) / 180);
		ctx.translate(-x, -y);

		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
        ctx.clip();

        if (Surface.texture[p.texture]) {
        	let img = Surface.texture[p.texture],
        		ratio = img.width / img.height,
        		tH = r2,
        		tW = tH * ratio;

			if (p.speed > 0) {
				let tX = x - r - p.rotation;
				ctx.drawImage(img, tX, y - r, tW, tH);
				if (p.rotation > r2) ctx.drawImage(img, tX + tW, y - r, tW, tH);
			} else {
				let tX = x - tW + r - p.rotation;
				ctx.drawImage(img, tX, y - r, tW, tH);
				
				if (p.rotation < -r2) {
					ctx.drawImage(img, tX - tW, y - r, tW, tH);
				} else if (p.rotation > 0) {
					ctx.drawImage(img, tX + tW, y - r, tW, tH);
				}
			}
		}

		ctx.globalCompositeOperation = "hard-light";
		// ctx.globalCompositeOperation = "multiply";
		// ctx.globalCompositeOperation = "screen";

		// ctx.fillStyle = p.color;
		// ctx.beginPath();
		// ctx.arc(x, y, r, 0, tau, true);
		// ctx.fill();
		
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
