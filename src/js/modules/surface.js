
let Surface = {
	texture: {},
	maps: "astroid hoth ixchel moon saturn".split(" "),
	// maps: "astroid gaia gas_giant hoth ixchel jupiter mars mercury moon muunilinst pluto quom saturn sun tatooine venus".split(" "),
	init() {
		this.rot = 0;
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
		
		gradient.addColorStop(0, "#ccc");
		gradient.addColorStop(.3, "#777");
		gradient.addColorStop(1, "#1e1e1e");

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
				if (p.rotation < -r2) ctx.drawImage(img, tX - tW, y - r, tW, tH);
				else if (p.rotation > 0) ctx.drawImage(img, tX + tW, y - r, tW, tH);
			}
		}

		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
		ctx.fill();

		// fill colver START
		ctx.globalCompositeOperation = "overlay";
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
		ctx.fill();
		// fill colver END

		ctx.restore();


		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.arc(x, y, r, 0, tau, true);
		ctx.stroke();

		/*/ dashed line START */
		if (p.owner === 1) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(p.aura += .0075);
			ctx.translate(-x, -y);
			let tot = 15,
				len = 15;
			ctx.strokeStyle = p.color + "77";
			ctx.lineWidth = 3;
			r += 5;
			while (len--) {
				let s1 = len / tot,
					s2 = (len - .6) / tot;
				ctx.beginPath();
				ctx.arc(x, y, r, s1*tau, s2*tau, true);
				ctx.stroke();
			}
			ctx.restore();
		}
		// dashed line END 

		// production number
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#fff";
		ctx.strokeText(ships, x, y+2, r2);
		ctx.fillText(ships, x, y+2, r2);
	}
};
