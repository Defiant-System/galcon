
let Surface = {
	texture: {},
	maps: "astroid gaia gas_giant hoth ixchel jupiter mars mercury moon muunilinst pluto quom saturn sun tatooine venus".split(" "),
	init() {
		this.TAU = Math.PI * 2;
		this.piDeg = Math.PI / 180;
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
			else {
				// Surface is ready
				Anim.draw();
			}
		});
	},
	update(p) {
		let img = this.texture[this.maps[p.texture]];
		// rotate planet
		p.rotation += p.speed;
		if (!p.rotation_max && img) {
			let ratio = img.width / img.height;
			p.rotation_max = (ratio * (p.r * 2)) | 0;
		}
		if (p.speed > 0 && p.rotation > p.rotation_max) p.rotation = 0;
		if (p.speed < 0 && p.rotation < -p.r * 4) p.rotation = p.rotation_max;
	},
	render(ctx, p) {
		let img = this.texture[this.maps[p.texture]],
			r = p.r,
			x = p.x,
			y = p.y,
			r2 = r << 1,
			r0 = 1,
			r1 = r * 1.25,
			x0 = x - (r * .35),
			y0 = y - (r * .35),
			x1 = x0,
			y1 = y0,
			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

		gradient.addColorStop(0, "#ccc");
		gradient.addColorStop(.3, "#666");
		gradient.addColorStop(1, "#181818");

		ctx.save();
		// tilt planet
		ctx.translate(x, y);
		ctx.rotate(p.tilt * this.piDeg);
		ctx.translate(-x, -y);
		// clip planet area
		ctx.beginPath();
		ctx.arc(x, y, r, 0, this.TAU);
		ctx.clip();


		let ratio = img.width / img.height,
			tH = r2,
			tW = tH * ratio;
		if (p.speed > 0) {
			let tX = x - r - p.rotation;
			ctx.drawImage(img, tX, y - r, tW, tH);
			if (p.rotation > r2) ctx.drawImage(img, tX + tW, y - r, tW, tH);
		} else {
			let tX = x - tW + r - p.rotation;
			ctx.drawImage(img, tX, y - r, tW, tH);
			if (p.rotation < -r2) ctx.drawImage(img, tX - tW, y - r, tW, tH);
			else if (p.rotation > 0) ctx.drawImage(img, tX + tW, y - r, tW, tH);
		}

		// radial gradient
		ctx.globalCompositeOperation = "hard-light";
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, r+1, 0, this.TAU);
		ctx.fill();

		ctx.restore();
	}
};
